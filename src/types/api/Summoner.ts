/**
 * The summoner data as returned by the API.
 */
export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  revisionDate: number;
  profileIconId: number;
  summonerLevel: number;
}

/**
 * A partial representation of a summoner.
 */
export interface PartialSummoner {
  id: string;
  name: string;
  profileIconId: number;
  playerId: string;
  summonerLevel: number;
}
