import { RootController } from '@/controllers/root.controller';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

export class IndexRoute implements Routes {
  public router: Router = Router();
  public root = new RootController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.root.index);
    this.router.get('/health', this.root.health);
  }
}
