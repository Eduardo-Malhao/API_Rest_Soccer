import { Request, Response, NextFunction } from 'express';

export default class MatchValidation {
  public static async validateMatch(req: Request, res: Response, next: NextFunction)
    : Promise<void | Response> {
    const { homeTeamId, awayTeamId } = req.body;

    if (!req.body) {
      return res.status(401).json({ message: 'Missing fields' });
    }
    if (homeTeamId === awayTeamId) {
      return res.status(422).json(
        { message: 'It is not possible to create a match with two equal teams' },
      );
    }

    next();
  }
}
