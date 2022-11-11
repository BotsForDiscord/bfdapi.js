import { EventEmitter } from "eventemitter3";
import { request } from "undici";
import type { HttpMethod } from "undici/types/dispatcher";
import { version } from "../package.json";
import { BFDAPIError } from "./BFDAPIError";
import { URLSearchParams } from "node:url";

export class BFDAPI extends EventEmitter {
  public static baseUrl = "https://discords.com/api";

  /**
   * A client for interacting with the discords api
   * @param id - the clients id
   * @param token - the clients api token
   */
  constructor(readonly id: string, readonly token: string) {
    super();
  }

  private async _request<T extends unknown = unknown>(
    method: HttpMethod,
    route: string,
    options?: RequestOptions
  ) {
    let headers: {
      "User-Agent": string;
      "Content-Type"?: string;
      Authorization?: string;
    } = {
      "User-Agent": `bfdapi.js/${version}`,
    };
    if (options?.auth) {
      if (!this.token)
        throw new TypeError("BFDAPI not constructed with a token");
      headers["Content-Type"] = "application/json";
      headers["Authorization"] = options.auth;
    }

    const response = await request(
      BFDAPI.baseUrl +
        route +
        (options?.query ? new URLSearchParams(options.query) : ""),
      {
        method,
        body: options?.body ? JSON.stringify(options.body) : null,
        headers,
      }
    );

    if (response.statusCode !== 200)
      switch (response.statusCode) {
        case 400:
        case 401:
        case 403:
          throw new BFDAPIError({
            statusCode: response.statusCode,
            body: await response.body.text(),
            type: "Request Error",
          });
        case 404:
          return null;
        case 500:
        case 502:
          throw new BFDAPIError({
            statusCode: response.statusCode,
            body: await response.body.text(),
            type: "Server Error",
          });
        default:
          throw new BFDAPIError({
            statusCode: response.statusCode,
            body: await response.body.text(),
            type: "Unknown",
          });
      }

    if (options?.query) return response.body.text() as T;
    return response.body.json() as Promise<T>;
  }

  /**
   * Fetches a bots vote info, will return null if the bot does not exist
   * @param id - client id, if different from current client id
   * @param auth - different authorization to use, if needed
   */
  async getBotVotes(): Promise<APIBotVotes | null>;
  async getBotVotes(id: string, auth: string): Promise<APIBotVotes | null>;
  async getBotVotes(
    id: string = this.id,
    auth: string = this.token
  ): Promise<APIBotVotes | null> {
    if (!id) throw new TypeError("missing bot id");
    if (!auth) throw new TypeError("missing auth token");
    const res = await this._request<APIBotVotes>("GET", `/${id}/votes`, {
      auth,
    });
    if (!res) return null;

    return {
      hasVoted: res.hasVoted || [],
      hasVoted24: res.hasVoted24 || [],
      votes: res.votes || 0,
      votes24: res.votes24 || 0,
      votesMonth: res.votesMonth || 0,
    };
  }

  /**
   * Fetches a bots api info, will return null if the bot does not exist
   * @param id - client id, if different from current client id
   */
  async getBot(id: string = this.id): Promise<APIBot | null> {
    if (!id) throw new TypeError("missing bot id");
    const res = await this._request<APIBot>("GET", `/bot/${id}`);
    if (!res) return null;

    return {
      approved: res.approved || false,
      approvedTime: res.approvedTime || "",
      avatar: res.avatar || "",
      clientId: res.id || "0",
      color: res.color || "",
      discrim: res.discrim || "",
      featured: res.featured || false,
      github: res.github || "",
      id: id,
      invite:
        res.invite ||
        `https://discordapp.com/oauth2/authorize?client_id=${id}&scope=bot`,
      library: res.library || "",
      name: res.name,
      owner: res.owner,
      owners: res.owners || [],
      partner: res.partner || false,
      prefix: res.prefix || "",
      server_count: res.server_count || 0,
      short_desc: res.short_desc || "",
      status: res.status || "offline",
      support_server: res.support_server || "",
      tag: res.tag,
      tags: res.tags || [],
      vanityUrl: res.vanityUrl || "",
      verified: res.verified || false,
      votes: res.votes || 0,
      votes24: res.votes24 || 0,
      votesMonth: res.votesMonth || 0,
      website_bot: res.website_bot || false,
    };
  }

  /**
   * Fetches the api info on a user, returns null if the user was not found
   * @param id - the id of the user to fetch
   */
  async getUser(id: string): Promise<APIUser | null> {
    if (!id) throw new TypeError("missing user id");
    const res = await this._request<APIUser>("GET", `/user/${id}`);
    if (!res) return null;

    return {
      avatar: res.avatar || "",
      background: res.background || "",
      bio: res.bio || "",
      discrim: res.discrim || "",
      flags: res.flags || 0,
      house: res.house || "none",
      id: res.id || id,
      isAdmin: res.isAdmin || false,
      isBeta: res.isBeta || false,
      isJrMod: res.isJrMod || false,
      isMod: res.isMod || false,
      isPartner: res.isPartner || false,
      isVerifiedDev: res.isVerifiedDev || false,
      name: res.name || "",
      status: res.status || "offline",
      tag: res.tag || "",
      username: res.username || "",
      website: res.website || "",
    };
  }

  /**
   * Fetches the bots of a user, returns null if the user was not found
   * @param id - the id of the user you want to get the bots of
   */
  async getUserBots(id: string): Promise<APIBot[] | null> {
    if (!id) throw new TypeError("missing user id");
    const res = await this._request<APIUserBots>("GET", `/user/${id}/bots`);
    if (!res || !res.bots) return null;

    if (res.bots.length === 0) return [];

    return Promise.all(res.bots.map((b) => this.getBot(b) as Promise<APIBot>));
  }

  /**
   * Fetches the bots api widget, or returns null if the bot was not found
   * @param id - the id of the bot to fetch the widget of
   */
  async getBotWidget(
    id: string = this.id,
    options?: { theme: "dark"; width: number }
  ): Promise<string | null> {
    if (!id) throw new TypeError("missing bot id");
    return this._request<string>(
      "GET",
      `/bot/${id}/widget`,
      options
        ? { query: { theme: options.theme, width: options.width.toString() } }
        : undefined
    );
  }

  /**
   * post your bots server count stats
   * @param server_count - the number of servers your bot is in
   * @param id - the id to post stats to, if different from the current id
   * @param auth - different authorization to use, if needed
   */
  async postServerCount(
    server_count: number = 0,
    id: string = this.id,
    auth: string = this.token
  ): Promise<string> {
    if (!id) throw new TypeError("missing bot id");
    if (!auth) throw new TypeError("missing auth token");
    const res = await this._request<{ message: string }>("POST", `/bot/${id}`, {
      auth,
      body: { server_count },
    });

    return res?.message || "";
  }
}

interface RequestOptions {
  query?: Record<string, string>;
  auth?: string;
  body?: object;
}

export interface APIBot {
  approved: boolean;
  approvedTime: string;
  avatar: string;
  clientId?: string;
  color: string;
  discrim: string;
  featured: boolean;
  github?: string;
  id: string;
  invite: string;
  library?: string;
  name: string;
  owner: string;
  owners?: string[];
  partner: boolean;
  prefix: string;
  server_count?: number;
  short_desc?: string;
  status?: "online" | "idle" | "dnd" | "offline";
  support_server?: string;
  tag: string;
  tags?: string[];
  vanityUrl?: string;
  verified: boolean;
  votes: number;
  votes24: number;
  votesMonth: number;
  website_bot: boolean;
}

export interface APIUser {
  avatar?: string;
  background?: string;
  bio?: string;
  discrim: string;
  flags?: number;
  house?: "courage" | "glory" | "serenity" | "none";
  id: string;
  isAdmin: boolean;
  isBeta: boolean;
  isJrMod: boolean;
  isMod: boolean;
  isPartner: boolean;
  isVerifiedDev: boolean;
  name: string;
  status?: "online" | "idle" | "dnd" | "offline";
  tag: string;
  username: string;
  website?: string;
}

export interface APIUserBots {
  bots?: string[];
}

export interface APIBotVotes {
  hasVoted: string[];
  hasVoted24: string[];
  votes: number;
  votes24: number;
  votesMonth: number;
}
