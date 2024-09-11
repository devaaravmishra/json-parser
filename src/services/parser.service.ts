import { ASTNode, Token } from '@/entities';
import { HttpException } from '@/exceptions/HttpException';
import { Service } from 'typedi';

@Service()
export class ParserService {
  private tokens: Token[];
  private current: number;

  public parse(tokens: Token[]): ASTNode {
    if (!tokens || tokens.length === 0) {
      throw new HttpException(400, 'No tokens to parse');
    }

    this.tokens = tokens;
    this.current = 0;

    return this.parseValue();
  }

  private advance(): Token {
    return this.tokens[++this.current];
  }

  private parseValue(): ASTNode {
    const token = this.tokens[this.current];

    switch (token.type) {
      case 'String':
        return { type: 'String', value: token.value };
      case 'Number':
        return { type: 'Number', value: Number(token.value) };
      case 'True':
        return { type: 'Boolean', value: true };
      case 'False':
        return { type: 'Boolean', value: false };
      case 'Null':
        return { type: 'Null', value: null };
      case 'BraceOpen':
        return this.parseObject();
      case 'BracketOpen':
        return this.parseArray();
      default:
        throw new HttpException(400, `Unexpected token: ${token.type}`);
    }
  }

  private parseObject(): ASTNode {
    const node: ASTNode = { type: 'Object', value: {} };
    let token = this.advance(); // Consume '{'

    while (token.type !== 'BraceClose') {
      if (token.type !== 'String') {
        throw new HttpException(400, `Expected string in key-value pair, got ${token.type}`);
      }

      const key = token.value;
      token = this.advance(); // Consume key

      if (token.type !== 'Colon') {
        throw new HttpException(400, `Expected colon after key, got ${token.type}`);
      }

      token = this.advance(); // Consume ':'
      const value = this.parseValue(); // Recursively parse the value
      node.value[key] = value;

      token = this.advance(); // Consume value or ','
      if (token.type === 'Comma') {
        token = this.advance(); // Consume ',' if present
      }
    }

    return node;
  }

  private parseArray(): ASTNode {
    const node: ASTNode = { type: 'Array', value: [] };
    let token = this.advance(); // Consume '['

    while (token.type !== 'BracketClose') {
      const value = this.parseValue();
      node.value.push(value);

      token = this.advance(); // Consume value or ','
      if (token.type === 'Comma') {
        token = this.advance(); // Consume ',' if present
      }
    }

    return node;
  }
}
