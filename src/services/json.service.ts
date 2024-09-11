import { Format } from '@/controllers/parser.controller';
import { ASTNode } from '@/entities';
import { Container, Service } from 'typedi';
import { AstToJsonService } from './ast-to-json.service';
import { ParserService } from './parser.service';
import { TokenizerService } from './tokenizer.service';

@Service()
export class JsonService {
  private parser: ParserService = Container.get(ParserService);
  private tokenizer: TokenizerService = Container.get(TokenizerService);
  private ast: AstToJsonService = Container.get(AstToJsonService);

  public parse(data: string, query: Format = 'json'): ASTNode {
    const tokens = this.tokenizer.tokenize(data);
    const result = this.parser.parse(tokens);

    if (query === 'ast') {
      return result;
    }

    return this.ast.convertAstToJson(result);
  }
}
