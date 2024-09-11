import { ParserController } from '@/controllers/parser.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class ParserRoute implements Routes {
  public path = '/parse';
  public router: Router = Router();
  public parserController = new ParserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.parserController.parse);
  }
}
