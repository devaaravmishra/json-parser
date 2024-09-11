import { Token } from '@/entities';
import { HttpException } from '@/exceptions/HttpException';
import { isWhiteSpace } from '@/utils/utilityMethods';
import { Service } from 'typedi';

@Service()
export class TokenizerService {
  private pos: number;
  private input: string;
  private tokens: Token[];

  public tokenize(input: string): Token[] {
    this.pos = 0;
    this.tokens = [];

    // Remove leading and trailing quotes if present
    input = input.trim().replace(/^['"`]|['"`]$/g, '');

    this.input = input;

    // Consume any leading whitespace
    this.consumeWhitespace();

    while (this.pos < input.length) {
      const char = input[this.pos];

      if (isWhiteSpace(char)) {
        this.consume();
        continue;
      }

      this.tokens.push(this.parseToken(char));

      if (
        this.currentToken() !== ':' &&
        this.currentToken() !== ',' &&
        this.currentToken() !== '}' &&
        this.currentToken() !== ']'
      ) {
        this.pos++;
      }
    }

    return this.tokens;
  }

  public parseToken(char: string): Token {
    switch (char) {
      case '{':
        return { type: 'BraceOpen', value: char };
      case '}':
        this.pos++;
        return { type: 'BraceClose', value: char };
      case '[':
        return { type: 'BracketOpen', value: char };
      case ']':
        this.pos++;
        return { type: 'BracketClose', value: char };
      case ',':
        this.pos++;
        return { type: 'Comma', value: char };
      case ':':
        this.pos++;
        return { type: 'Colon', value: char };
      case '"':
        return { type: 'String', value: this.parseString() };
      case '-':
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        return { type: 'Number', value: this.parseNumber() };
      case 't':
        return { type: 'True', value: this.parseTrue() };
      case 'f':
        return { type: 'False', value: this.parseFalse() };
      case 'n':
        return { type: 'Null', value: this.parseNull() };
      default:
        throw new HttpException(400, `Unexpected character: ${char}`);
    }
  }

  private parseNumber(): string {
    let str = '';

    // If the number is negative, add the minus sign to the string and consume the token
    if (this.currentToken() === '-') {
      str += '-';
      this.consume('-');
    }

    // Parse the integer part of the number
    str += this.parseDigits();

    // If the number has a fractional part, parse it
    if (this.currentToken() === '.') {
      str += '.';
      this.consume('.');
      str += this.parseDigits();
    }

    // If the number has an exponent, parse it
    if (this.currentToken() === 'e' || this.currentToken() === 'E') {
      str += this.currentToken();
      this.consume();

      if (this.currentToken() === '+' || this.currentToken() === '-') {
        str += this.currentToken();
        this.consume();
      }

      str += this.parseDigits();
    }

    return str;
  }

  private parseDigits(): string {
    let str = '';

    // If the first digit is zero, add it to the string and consume the token
    if (this.currentToken() === '0') {
      str += this.currentToken();
      this.consume();
    }
    // If the first digit is between 1 and 9, parse the rest of the digits
    else if (this.currentToken() >= '1' && this.currentToken() <= '9') {
      str += this.currentToken();
      this.consume();

      while (this.currentToken() >= '0' && this.currentToken() <= '9') {
        str += this.currentToken();
        this.consume();
      }
    }
    // Otherwise, the JSON number is invalid
    else {
      throw new HttpException(400, `Invalid JSON number at position ${this.pos}`);
    }

    // Return the parsed string of digits
    return str;
  }

  private parseString(): string {
    let value = '';

    this.consume('"');

    while (this.currentToken() !== '"') {
      if (this.currentToken() === '\\') {
        value += this.parseEscapeSequence();
      } else {
        value += this.currentToken();
        this.pos++; // we didn't consume the token because we want to include the escape character, if they exists between the quotes
      }
    }

    // consume the closing quote
    this.consume('"');

    return value;
  }

  private parseTrue(): string {
    this.consume('t');
    this.consume('r');
    this.consume('u');
    this.consume('e');
    return 'true';
  }

  private parseFalse(): string {
    this.consume('f');
    this.consume('a');
    this.consume('l');
    this.consume('s');
    this.consume('e');
    return 'false';
  }

  private parseNull(): string {
    this.consume('n');
    this.consume('u');
    this.consume('l');
    this.consume('l');
    return 'null';
  }

  private parseEscapeSequence(): string {
    // Consume the backslash
    this.consume('\\');

    switch (this.currentToken()) {
      // If the escape sequence is a double quote, backslash, or forward slash, return the corresponding character
      case '"':
      case '\\':
      case '/':
        const c = this.currentToken();
        this.consume();
        return c;
      // If the escape sequence is a backspace, return the corresponding character
      case 'b':
        this.consume();
        return '\b';
      // If the escape sequence is a form feed, return the corresponding character
      case 'f':
        this.consume();
        return '\f';
      // If the escape sequence is a newline, return the corresponding character
      case 'n':
        this.consume();
        return '\n';
      // If the escape sequence is a carriage return, return the corresponding character
      case 'r':
        this.consume();
        return '\r';
      // If the escape sequence is a tab, return the corresponding character
      case 't':
        this.consume();
        return '\t';
      // If the escape sequence is a Unicode code point, parse it and return the corresponding character
      case 'u':
        this.consume();
        const code = parseInt(this.input.slice(this.pos, this.pos + 4), 16);

        if (isNaN(code)) {
          throw new HttpException(400, `Invalid Unicode escape sequence at position ${this.pos}`);
        }

        this.pos += 4;

        return String.fromCharCode(code);
      // Otherwise, the JSON escape sequence is invalid
      default:
        throw new HttpException(400, `Invalid escape sequence at position ${this.pos}`);
    }
  }

  private consumeWhitespace(): void {
    while (this.hasMoreTokens() && isWhiteSpace(this.currentToken())) {
      this.consume();
    }
  }

  private hasMoreTokens(): boolean {
    return this.pos < this.input.length;
  }

  private currentToken(): string {
    return this.input[this.pos];
  }

  private consume(expected?: string): void {
    if (expected && this.currentToken() !== expected) {
      throw new HttpException(400, `Expected '${expected}' but found '${this.currentToken()}'`);
    }

    this.pos++;

    // skip any whitespace characters
    while (
      this.currentToken() === ' ' ||
      this.currentToken() === '\n' ||
      this.currentToken() === '\t' ||
      this.currentToken() === '\r'
    ) {
      this.pos++;
    }
  }
}
