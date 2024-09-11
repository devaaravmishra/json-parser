import { HttpException } from '@/exceptions/HttpException';
import { JsonService } from '@/services/json.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export type Format = 'json' | 'ast';

export class ParserController {
  private jsonService: JsonService = Container.get(JsonService);

  constructor() {
    // Bind context to class methods to avoid issues with 'this' keyword
    this.parse = this.parse.bind(this);
  }

  public async parse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { json } = req.body;
      const format = req.query.format as Format;

      if (!json || typeof json !== 'string') {
        throw new HttpException(400, 'Invalid JSON data');
      }

      if (format && format !== 'json' && format !== 'ast') {
        throw new HttpException(400, 'Invalid format query parameter (must be json or ast)');
      }

      const result = this.jsonService.parse(json, format);

      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}
