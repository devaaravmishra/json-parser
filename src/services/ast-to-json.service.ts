import { ASTNode } from '@/entities';
import { HttpException } from '@/exceptions/HttpException';
import { Service } from 'typedi';

@Service()
export class AstToJsonService {
  public convertAstToJson(ast: ASTNode): any {
    return this.astToJson(ast);
  }

  private astToJson(ast: ASTNode): any {
    switch (ast.type) {
      case 'Object':
        const result: { [key: string]: any } = {};

        for (const key in ast.value) {
          result[key] = this.astToJson(ast.value[key]);
        }

        return result;
      case 'Array':
        return ast.value.map((item: ASTNode) => this.astToJson(item));
      case 'String':
      case 'Number':
      case 'Boolean':
      case 'Null':
        return ast.value;
      default:
        throw new HttpException(400, `Unexpected AST node type: ${(ast as { type: string }).type}`);
    }
  }
}
