import type { BaseManager, FetchOptions, MatchByPlayerOptions, MatchData, MatchTimelineData } from '../types';
import { Match, MatchTimeline, type Summoner } from '../structures';
import type { Client } from '../client';
import { parseFetchOptions } from '../util';

/**
 * A match manager - to fetch and manage matches.
 */
export class MatchManager implements BaseManager<Match> {
  /**
   * The client this match manager belongs to.
   */
  readonly client: Client;

  /**
   * Creates a new match manager.
   * @param client - The client this match manager belongs to.
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Fetch a match by its ID.
   * @param id - The ID of the match
   * @param options - The basic fetch options
   */
  async fetch(id: string, options?: FetchOptions) {
    const opts = parseFetchOptions(this.client, 'match', options);
    const { ignoreCache, cache, store, ignoreStorage, region } = opts;
    this.client.logger?.debug(`Fetching match for ID: ${id} with options: `, opts);

    try {
      if (!ignoreCache) {
        this.client.logger?.trace(`Checking cache for match`);
        const exists = await this.client.cache.has(`match:${id}`);
        if (exists) return this.client.cache.get<Match>(id);
      }

      this.client.logger?.trace(`Fetching items, spells, runes for match`);
      const items = await this.client.items.fetchAll();
      const spells = await this.client.summonerSpells.fetchAll();
      const runeTrees = await this.client.runes.fetchAll();
      if (!ignoreStorage) {
        this.client.logger?.trace(`Checking storage for match`);
        const storage = this.client.storage.fetch<MatchData>('match', id);
        const stored = storage instanceof Promise ? await storage.catch(() => undefined) : storage;
        if (stored && !ignoreStorage) {
          this.client.logger?.trace(`Found match in storage, processing and returning...`);
          const participantChamps = await this.client.champions.fetchByKeys(
            stored.info.participants.map((p) => p.championId)
          );
          const bannedChamps = await this.client.champions.fetchByKeys(
            stored.info.teams.map((t) => t.bans).flatMap((b) => b.map((b) => b.championId))
          );
          const result = new Match(
            this.client,
            stored,
            bannedChamps.concat(participantChamps),
            items,
            runeTrees,
            spells
          );
          if (cache) await this.client.cache.set(`match:${id}`, result);
          return result;
        }
      }

      this.client.logger?.trace(`Fetching match from API`);
      const response = await this.client.api.request(`/lol/match/v5/matches/${id}`, {
        region: region!,
        regional: true,
        api: 'MATCH',
        method: 'getMatch',
        params: 'Match ID: ' + id
      });

      const data = <MatchData>response.data;
      this.client.logger?.trace(`Match fetched from API, processing and returning...`);
      const participantChamps = await this.client.champions.fetchByKeys(
        data.info.participants.map((p) => p.championId)
      );
      const bannedChamps = await this.client.champions.fetchByKeys(
        data.info.teams.map((t) => t.bans).flatMap((b) => b.map((b) => b.championId))
      );

      const match = new Match(this.client, data, bannedChamps.concat(participantChamps), items, runeTrees, spells);
      if (cache) await this.client.cache.set(`match:${id}`, match);
      if (store) await this.client.storage.save(data, `match`, id);
      return match;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Fetch a match timeline by the match ID.
   *
   * @param matchId - The ID of the match
   * @param options - The basic fetch options
   */
  async fetchMatchTimeline(matchId: string, options?: FetchOptions) {
    const opts = parseFetchOptions(this.client, 'match', options);
    const { ignoreCache, ignoreStorage, store, cache, region } = opts;
    this.client.logger?.debug(`Fetching match timeline for ID: ${matchId} with options: `, opts);

    try {
      if (!ignoreCache) {
        this.client.logger?.trace(`Checking cache for match timeline`);
        const exists = await this.client.cache.has(`match-timeline:${matchId}`);
        if (exists) return this.client.cache.get<MatchTimeline>(`match-timeline:${matchId}`);
      }

      const items = await this.client.items.fetchAll(options);
      if (!ignoreStorage) {
        this.client.logger?.trace(`Checking storage for match timeline`);
        const storage = this.client.storage.fetch<MatchTimelineData>('match-timeline', matchId);
        const stored = storage instanceof Promise ? await storage.catch(() => undefined) : storage;
        if (stored) {
          this.client.logger?.trace(`Found match timeline in storage, processing and returning...`);
          const timeline = new MatchTimeline(stored, items);
          if (cache) await this.client.cache.set(matchId, timeline);
          return timeline;
        }
      }

      this.client.logger?.trace(`Fetching match timeline from API`);
      const response = await this.client.api.request(`/lol/match/v5/matches/${matchId}/timeline`, {
        region: region!,
        regional: true,
        api: 'MATCH',
        method: 'getTimeline',
        params: 'Match ID: ' + matchId
      });

      const data = <MatchTimelineData>response.data;
      this.client.logger?.trace(`Match timeline fetched from API, processing and returning...`);
      const timeline = new MatchTimeline(data, items);
      if (cache) await this.client.cache.set(matchId, timeline);
      if (store) await this.client.storage.save(data, 'match-timeline', matchId);
      return timeline;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Fetch a list of match IDs by a player ID.
   * These are neither stored nor cached.
   *
   * @param player - The summoner or their player ID whose matches need to be fetched.
   * @param options - The options for filtering the matches.
   */
  async fetchMatchListByPlayer(player: Summoner | string, options?: MatchByPlayerOptions) {
    const playerId = typeof player === 'string' ? player : player.playerId;
    const region = typeof player === 'string' ? this.client.region : player.region;
    this.client.logger?.debug(`Fetching match list for player ID: ${playerId} with options: `, options);

    try {
      this.client.logger?.trace(`Fetching match list from API`);
      // The base is not used here, it is only there to prevent INVALID URL errors.
      const url = new URL('/lol/match/v5/matches/by-puuid/' + playerId + '/ids', 'https://na1.api.riotgames.com');
      if (options?.startTime) url.searchParams.set('startTime', options.startTime.toString());
      if (options?.endTime) url.searchParams.set('endTime', options.endTime.toString());
      if (options?.queue) url.searchParams.set('queue', options.queue.toString());
      if (options?.type) url.searchParams.set('type', options.type);
      if (options?.start) url.searchParams.set('start', options.start.toString());
      if (options?.count) url.searchParams.set('count', options.count.toString());
      const response = await this.client.api.request(url.pathname + url.search, {
        region,
        regional: true,
        api: 'MATCH',
        method: 'getMatchIdsByPUUID',
        params: 'Player ID: ' + playerId
      });
      this.client.logger?.trace(`Match list fetched from API, returning...`);
      return <string[]>response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
