import { TeamGroup } from "../types";

export class TeamBalancer {
  /**
   * Distribute a list of members randomly & fairly into N groups/teams.
   * Uses crypto-quality Fisher-Yates shuffle.
   */
  public static divideTeams<T = string>(
    members: T[],
    teamCount: number,
    teamNames?: string[]
  ): TeamGroup<T>[] {
    if (!members || members.length === 0) {
      throw new Error("Members list cannot be empty.");
    }
    if (teamCount <= 0) {
      throw new Error("Team count must be greater than zero.");
    }

    const shuffled = [...members];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const effectiveTeamCount = Math.min(teamCount, members.length);
    const teams: TeamGroup<T>[] = Array.from({ length: effectiveTeamCount }, (_, idx) => ({
      id: idx + 1,
      name: teamNames?.[idx] || `Team ${idx + 1}`,
      members: [],
    }));

    shuffled.forEach((member, index) => {
      const teamIdx = index % effectiveTeamCount;
      teams[teamIdx].members.push(member);
    });

    return teams;
  }

  /**
   * Pick K unique random winners/candidates from a list without replacement.
   */
  public static pickMultiple<T = string>(items: T[], count: number): T[] {
    if (count <= 0) return [];
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, items.length));
  }
}
