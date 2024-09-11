import { NextFunction, Request, Response } from 'express';

export class RootController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.send('Hello World');
    } catch (error) {
      next(error);
    }
  }
  public async health(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.send('OK');
    } catch (error) {
      next(error);
    }
  }
}
