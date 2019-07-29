const EventEmitter = require("eventemitter3");
const phin = require("phin");
const BFDAPIError = require("./BFDAPIError");

class BFDAPI extends EventEmitter {
	/**
	 * main class
	 * @param {string} id - the clients id
	 * @param {string} token - the clients api token
	 * @param {object} options - the clients options 
	 */
	constructor(id, token, options) {
		if (!id) throw new TypeError("missing client id");
		if (!token) throw new TypeError("missing token");
		if (!options) options = {};

		super();

		this._id = id;
		this._token = token;
		this._options = options;
	}

	get id() {
		return this._id;
	}

	get token() {
		return this._token;
	}

	get options() {
		return this._options;
	}

	/**
	 * Fetches a bots vote info, will return null if the bot does not exist
	 * @param {string} [id] - client id, if different from current client id
	 * @param {string} [auth] - different authorization to use, if needed
	 * @returns {Promise<APIBotVotes>} 
	 */
	async getBotVotes(id = this.id, auth = this.token) {
		if (!id) throw new TypeError("missing bot id");
		return phin({
			url: `https://botsfordiscord.com/api/bot/${id}/votes`,
			headers: {
				"Authorization": auth
			},
			parse: "json"
		}).then((b) => {
			if (b.statusCode !== 200) switch (b.statusCode) {
				case 400:
				case 401:
				case 403:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "request error"
					});
					break;

				case 404:
					return null;
					break;

				case 500:
				case 502:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "server error"
					});
					break;

				default:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "unknown"
					});
			}

			return {
				hasVoted: b.body.hasVoted || [],
				hasVoted24: b.body.hasVoted24 || [],
				votes: b.body.votes || 0,
				votes24: b.body.votes24 || 0,
				votesMonth: b.body.votesMonth || 0
			};
		}).catch(err => {
			throw err;
		});
	}

	/**
	 * Fetches a bots api info, will return null if the bot does not exist
	 * @param {string} [id] - client id, if different from current client id
	 * @returns {Promise<APIBot>}
	 */
	async getBot(id = this.id) {
		if (!id) throw new TypeError("missing bot id");
		return phin({
			url: `https://botsfordiscord.com/api/bot/${id}`,
			parse: "json"
		}).then((b) => {
			if (b.statusCode !== 200) switch (b.statusCode) {
				case 400:
				case 401:
				case 403:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "request error"
					});
					break;

				case 404:
					return null;
					break;

				case 500:
				case 502:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "server error"
					});
					break;

				default:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "unknown"
					});
			}

			return {
				approved: b.body.approved || false,
				approvedTime: b.body.approvedTime || "",
				avatar: b.body.avatar || "",
				clientId: b.body.avatar || b.body.id || "0",
				color: b.body.color || "",
				discrim: b.body.discrim || "",
				featured: b.body.featured || false,
				github: b.body.github || "",
				id: b.body.id || id,
				invite: b.body.invite || `https://discordapp.com/oauth2/authorize?client_id=${b.body.id || id}&scope=bot`,
				library: b.body.library || "",
				name: b.body.name,
				owner: b.body.owner,
				owners: b.body.owners || [],
				parter: b.body.partner || false,
				prefix: b.body.prefix || "",
				server_count: b.body.server_count || 0,
				short_desc: b.body.short_desc,
				status: b.body.status || "offline",
				support_server: b.body.support_server || "",
				tag: b.body.tag,
				tags: b.body.tags || [],
				vanityUrl: b.body.vanityUrl || "",
				verified: b.body.verified || false,
				votes: b.body.votes || 0,
				votes24: b.body.votes24 || 0,
				votesMonth: b.body.votesMonth || 0,
				website_bot: b.body.website_bot || false
			};
		}).catch(err => {
			throw err;
		});
	}

	/**
	 * Fetches the api info on a user, returns null if the user was not found
	 * @param {string} id - the id of the user to fetch
	 * @returns {Promise<APIUser>}
	 */
	async getUser(id) {
		if (!id) throw new TypeError("missing user id");
		return phin({
			url: `https://botsfordiscord.com/api/user/${id}`,
			parse: "json"
		}).then((u) => {
			if (u.statusCode !== 200) switch (u.statusCode) {
				case 400:
				case 401:
				case 403:
					throw new BFDAPIError({
						statusCode: u.statusCode,
						body: u.body,
						type: "request error"
					});
					break;

				case 404:
					return null;
					break;

				case 500:
				case 502:
					throw new BFDAPIError({
						statusCode: u.statusCode,
						body: u.body,
						type: "server error"
					});
					break;

				default:
					throw new BFDAPIError({
						statusCode: u.statusCode,
						body: u.body,
						type: "unknown"
					});
			}

			return {
				avatar: u.body.avatar || "",
				background: u.body.background || "",
				bio: u.body.bio || "",
				discrim: u.body.discrim || "",
				flags: u.body.flags || 0,
				house: u.body.house || "",
				id: u.body.id || id,
				isAdmin: u.body.isAdmin || false,
				isBeta: u.body.isBeta || false,
				isJrMod: u.body.isJrMod || false,
				isMod: u.body.isMod || false,
				isPartner: u.body.isPartner || false,
				isVerifiedDev: u.body.isVerifiedDev || false,
				name: u.body.name || "",
				status: u.body.status || "offline",
				tag: u.body.tag || "",
				username: u.body.username || "",
				website: u.body.website || ""
			};
		}).catch(err => {
			throw err;
		});
	}

	/**
	 * Fetches the bots of a user, returns null if the user was not found
	 * @param {string} id - the id of the user you want to get the bots of
	 * @returns {Promise<APIUserBots>}
	 */
	async getUserBots(id) {
		if (!id) throw new TypeError("missing user id");
		return phin({
			url: `https://botsfordiscord.com/api/users/${id}/bots`,
			headers: {
				"Authorization": this.token
			},
			parse: "json"
		}).then((b) => {
			if (b.statusCode !== 200) switch (b.statusCode) {
				case 400:
				case 401:
				case 403:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "request error"
					});
					break;

				case 404:
					return null;
					break;

				case 500:
				case 502:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "server error"
					});
					break;

				default:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body,
						type: "unknown"
					});
			};

			if (b.body.bots.length === 0) return [];

			return Promise.all(b.body.bots.map(async (b) => this.getBot(b)));
		}).catch(err => {
			throw err;
		});
	}

	/**
	 * Fetches the bots api widget, or returns null if the bot was not found
	 * @param {string} id - the id of the bot to fetch the widget of
	 * @returns {Promise<string>}
	 */

	async getBotWidget(id = this.id) {
		if (!id) throw new TypeError("missing bot id");
		return phin({
			url: `https://botsfordiscord.com/api/bot/${id}/widget`,
			parse: "none"
		}).then((b) => {
			if (b.statusCode !== 200) switch (b.statusCode) {
				case 400:
				case 401:
				case 403:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body.toString(),
						type: "request error"
					});
					break;

				case 404:
					return null;
					break;

				case 500:
				case 502:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body.toString(),
						type: "server error"
					});
					break;

				default:
					throw new BFDAPIError({
						statusCode: b.statusCode,
						body: b.body.toString(),
						type: "unknown"
					});
			};

			return b.body.toString();
		}).catch(err => {
			throw err;
		});
	}

	/**
	 * post your bots server count stats
	 * @param {number} server_count - the number of servers your bot is in
	 * @param {string} [id] - the id to post stats to, if different from the current id
	 * @param {string} [auth] - different authorization to use, if needed
	 * @returns {Promise<{ message: string, success: boolean }>}
	 */
	async postServerCount(server_count = 0, id = this.id, auth = this.token) {
		return phin({
			method: "POST",
			url: `https://botsfordiscord.com/api/bot/${id}`,
			data: {
				server_count
			},
			headers: {
				"Authorization": auth,
				"Content-Type": "application/json"
			},
			parse: "json"
		}).then((p) => {
			if (p.statusCode !== 200) switch (p.statusCode) {
				case 400:
				case 401:
				case 403:
					throw new BFDAPIError({
						statusCode: p.statusCode,
						body: p.body,
						type: "request error"
					});
					break;

				case 404:
					return null;
					break;

				case 500:
				case 502:
					throw new BFDAPIError({
						statusCode: p.statusCode,
						body: p.body,
						type: "server error"
					});
					break;

				default:
					throw new BFDAPIError({
						statusCode: p.statusCode,
						body: p.body,
						type: "unknown"
					});
			}

			return {
				message: p.body.message || "",
				success: p.statusCode === 200
			};
		}).catch(err => {
			throw err;
		});
	}
}

module.exports = BFDAPI;

/**
 * @typedef {object} APIBot
 * @prop {boolean} approved
 * @prop {string} approvedTime
 * @prop {string} avatar
 * @prop {string} [clientId]
 * @prop {string} color
 * @prop {string} discrim
 * @prop {boolean} featured
 * @prop {string} [github]
 * @prop {string} id
 * @prop {string} invite
 * @prop {string} [library]
 * @prop {string} name
 * @prop {string} owner
 * @prop {string[]} [owners]
 * @prop {boolean} parter
 * @prop {string} prefix
 * @prop {number} [server_count]
 * @prop {string} [short_desc]
 * @prop {"online" | "idle" | "dnd" | "offline"} [status]
 * @prop {string} [support_server]
 * @prop {string} tag
 * @prop {string[]} [tags]
 * @prop {string} [vanityUrl]
 * @prop {boolean} verified
 * @prop {number} votes
 * @prop {number} votes24
 * @prop {number} votesMonth
 * @prop {boolean} website_bot
 */

/**
 * @typedef {object} APIUser
 * @prop {string} [avatar]
 * @prop {string} [background]
 * @prop {string} [bio]
 * @prop {string} discrim
 * @prop {number} [flags]
 * @prop {"courage" | "glory" | "serenity"} [house]
 * @prop {string} id
 * @prop {boolean} isAdmin
 * @prop {boolean} isBeta
 * @prop {boolean} isJrMod
 * @prop {boolean} isMod
 * @prop {boolean} isPartner
 * @prop {boolean} isVerifiedDev
 * @prop {string} name
 * @prop {"online" | "idle" | "dnd" | "offline"} [status]
 * @prop {string} tag
 * @prop {string} username
 * @prop {string} [website]
 */

/**
 * @typedef {object} APIUserBots
 * @prop {APIBot[]} [bots]
 */

/**
 * @typedef {object} APIBotVotes
 * @prop {string[]} hasVoted
 * @prop {string[]} hasVoted24
 * @prop {number} votes
 * @prop {number} votes24
 * @prop {number} votesMonth
 */

/**
 * @prop {string} token - the current api token
 * @prop {object} options - the options for the current instance
 */