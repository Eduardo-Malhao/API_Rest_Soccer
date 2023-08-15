import MatchesInterface from '../Interfaces/MatchesInterface';
import TeamsInterface from '../Interfaces/TeamsInterface';
import { LeaderboardInterface } from '../Interfaces/LeaderboardInterface';
import MatchesModel from '../model/MatchesModel';
import TeamsModel from '../model/TeamsModel';

export default class LeaderboardService {
  constructor(
    private matchModel: MatchesModel = new MatchesModel(),
    private teamsModel: TeamsModel = new TeamsModel(),
  ) { }

  public async matches() {
    const response = await this.matchModel.findFinished();
    return response;
  }

  public async teamNames() {
    const response = await this.teamsModel.findAllWithoutId();
    return response;
  }

  // team = leaderbord[]
  public static allHomeWin(match: any, teams: any) {
    teams.forEach((team: LeaderboardInterface) => {
      const oldStats = team;

      if (team.name === match.homeTeam.teamName) {
        oldStats.totalPoints += 3;
        oldStats.totalGames += 1;
        oldStats.totalVictories += 1;
        oldStats.efficiency = +(
          (oldStats.totalPoints / (oldStats.totalGames * 3)) * 100).toFixed(2);
      }
      if (team.name === match.awayTeam.teamName) {
        oldStats.totalPoints += 0;
        oldStats.totalGames += 1;
        oldStats.totalLosses += 1;
        oldStats.efficiency = +(
          (oldStats.totalPoints / (oldStats.totalGames * 3)) * 100).toFixed(2);
      }
    });
  }

  public static allAwayWin(match: any, teams: any) {
    teams.forEach((team: LeaderboardInterface) => {
      const oldStats = team;

      if (team.name === match.homeTeam.teamName) {
        oldStats.totalPoints += 0;
        oldStats.totalGames += 1;
        oldStats.totalLosses += 1;
        oldStats.efficiency = +(
          (oldStats.totalPoints / (oldStats.totalGames * 3)) * 100).toFixed(2);
      }
      if (team.name === match.awayTeam.teamName) {
        oldStats.totalPoints += 3;
        oldStats.totalGames += 1;
        oldStats.totalVictories += 1;
        oldStats.efficiency = +(
          (oldStats.totalPoints / (oldStats.totalGames * 3)) * 100).toFixed(2);
      }
    });
  }

  public static draw(match: any, teams: any) {
    teams.forEach((team: LeaderboardInterface) => {
      const oldStats = team;

      if (team.name === match.homeTeam.teamName) {
        oldStats.totalPoints += 1;
        oldStats.totalGames += 1;
        oldStats.totalDraws += 1;
        oldStats.efficiency = +(
          (oldStats.totalPoints / (oldStats.totalGames * 3)) * 100).toFixed(2);
      }
      if (team.name === match.awayTeam.teamName) {
        oldStats.totalPoints += 1;
        oldStats.totalGames += 1;
        oldStats.totalDraws += 1;
        oldStats.efficiency = +(
          (oldStats.totalPoints / (oldStats.totalGames * 3)) * 100).toFixed(2);
      }
    });
  }

  public static goals(match: any, teams: any) {
    teams.forEach((team: LeaderboardInterface) => {
      const oldStats = team;
      oldStats.goalsFavor += match.homeTeamGoals;
      oldStats.goalsOwn += match.awayTeamGoals;
      oldStats.goalsBalance += match.homeTeamGoals - match.awayTeamGoals;
    });
  }

  public static makeArrayOfTeams(teams: TeamsInterface[]) { // array com nomes de times
    const leaderbord: LeaderboardInterface[] = [];

    teams.forEach((team) => {
      leaderbord.push({
        name: team.teamName,
        totalPoints: 0,
        totalGames: 0,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 0,
        goalsOwn: 0,
        goalsBalance: 0,
        efficiency: 0,
      });
    });
    return leaderbord;
  }

  public static generateAllLeaderboard(
    matches: MatchesInterface[],
    teamLead: LeaderboardInterface[],
  ) {
    matches.forEach((match: any) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        LeaderboardService.allHomeWin(match, teamLead);
        LeaderboardService.goals(match, teamLead);
      }
      if (match.homeTeamGoals === match.awayTeamGoals) {
        LeaderboardService.allAwayWin(match, teamLead);
        LeaderboardService.goals(match, teamLead);
      }
      if (match.homeTeamGoals < match.awayTeamGoals) {
        LeaderboardService.draw(match, teamLead);
        LeaderboardService.goals(match, teamLead);
      }
    });
  }
}
