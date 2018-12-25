const EventEmitter = require("events"),
    util = require("util"),
    request = util.promisify(require("request")),
    opt = require("./options");

class BFDAPI extends EventEmitter {
    /**
     * Create new BFDAPI instance
     * @param {any} clientOrId Client instance or bot id
     * @param {String} apiToken Bots For Discord api token
     * @param {Boolean} autoPost Enable or disable auto positing
     * @param {Number} autoPostInterval auto post interval
     * @param {Boolean} shardSupport support sharding (tested d.js internal & manager)
     */
    constructor(clientOrId,apiToken,autoPost,autoPostInterval,shardSupport) {
        super();
        this.opt = opt;
        this.request = request;
        if(!clientOrId) throw new TypeError("missing client or id.");
        if(!apiToken) throw new TypeError("missing api token.");
        this.clientOrId = clientOrId;
        this.apiToken = apiToken;
        this._hasClient = this._isLib("discord.js",clientOrId) || this._isLib("eris",clientOrId);
        if(autoPost && !autoPostInterval) var autoPostInterval = this.opt.autoPostDefault;
        this.options = {
            autoPost,
            autoPostInterval,
            shardSupport
        }

        if(this._hasClient && this.options.autoPost) this.startAutoPost();
    }

    /**
     * Check if something is a library
     * @param {String} library library to check for
     * @param {any} client possible client to check
     * @returns {Boolean} 
     */
    _isLib(library, client){
        try {
            const lib = require.cache[require.resolve(library)];
            return lib && client instanceof lib.exports.Client;
        } catch (e) {
            return false;
        }
    }

    /**
     * Send a request to the bots for discord api
     * @param {String=/} path api path
     * @param {String=GET} method request method to use
     * @param {object={}} body body to send with request
     * @param {object={}} headers additional headers to send
     * @param {clean=true} clean make input easier to parse when returning
     * @param {String=UTF-8} encoding encoding of what's returned (null for images)
     * @returns {Promise} Result of promise will be the api response
     */
    async _apiRequest(path = "/",method = "GET",body = {},headers = {}, clean = true, encoding = "UTF-8") {
        return this.request(`${this.opt.apiBase}${path}`,{
            method: method.toLowerCase(),
            body: JSON.stringify(body),
            headers: Object.assign({
                Authorization: this.apiToken,
                "Content-Type": "application/json",
                encoding
            },headers)
        })
        .then(req => !clean ? req : {status:req.statusCode,body:JSON.parse(req.body)})
        .catch(req => !clean ? req : {status:req.statusCode,body:JSON.parse(req.body)});
    }

    /**
     * autopost function
     * @param {BFDAPI=this} cl bfdapi instance
     * @returns {Number} Returns guild count
     */
    async _autopost(cl=this) {       
        var count = cl.options.shardSupport ?
        ![null,undefined,""].includes(cl.clientOrId.shard) ?
        typeof cl.clientOrId.shard.fetchClientValues !== "undefined" ? 
        cl.clientOrId.shard.fetchClientValues("guilds.size").reduce((a, b) => a + b, 0) :
        typeof cl.clientOrId.shard.broadcastEval !== "undefined" ?
        cl.clientOrId.shard.broadcastEval("this,guilds.size").reduce((a, b) => a + b, 0) :
        cl.clientOrId.guilds.size :
        cl.clientOrId.guilds.size :
        cl.clientOrId.guilds.size;
        return cl._apiRequest(`/bot/${cl.clientOrId.user.id}`,"POST",{server_count:count})
        .then(req => req.status === 200 ? cl.emit("post",cl.clientOrId.guilds.size) : cl.emit("error",req.body))
        .then(count);
    };

    /**
     * Post guild count
     * @param {Number=} guildCount count to post
     * @param {Number=|String=} id bot id to post for
     * @returns {object} some info on the posting
     */
    async postCount(guildCount = this._hasClient ? this.clientOrId.guilds.size : null,id = this._hasClient ? this.clientOrId.user.id : this.clientOrId) {
        if([undefined,null,NaN,""].includes(guildCount) && !this._hasClient) throw new TypeError("missing/invalid guild count.");
        if(!id) throw new TypeError("missing/invalid client id");
        return this._apiRequest(`/bot/${id}`,"POST",{server_count:guildCount})
        .then(req => req.status === 200 ? {success: true, count: guildCount, id} : {success: false, status: req.status, body: req.body, id})
    }

    /**
     * Get a bots info from the api
     * @param {(Number=|String=)} id the bots id
     */
    async getBotInfo(id = this._hasClient ? this.clientOrId.user.id : this.clientOrId) {
        if(!id) throw new TypeError("missing/invalid id");
        return this._apiRequest(`/bot/${id}`,"GET")
        .then(req => req.status === 200 ? {success: true, id, data: req.body} : {success: false, status: req.status, body: req.body, id})
    }

    get getBot() {
        return this.getBotInfo;
    }

    /**
     * Get a bots widget
     * @param {(Number=|String=)} id id of the bot to get the widget for
     * @param {Boolean=true} darkTheme toggle widget using dark theme
     * @returns {object} bot widget svg
     */
    async getBotWidget(id = this._hasClient ? this.clientOrId.user.id : this.clientOrId, darkTheme = true) {
        if(!id) throw new TypeError("missing/invalid id");
        return this._apiRequest(`/bot/${id}/widget${darkTheme?"?theme=dark":""}`,"GET",{},{},false,null)
        .then(req => req.body);
    }

    /**
     * get a users info from the api
     * @param {(String|Number)} id id of the user who you want to get info on
     */
    async getUserInfo(id) {
        if(!id) throw new TypeError("missing/invalid id");
        return this._apiRequest(`/user/${id}`,"GET")
        .then(req => req.status === 200 ? {success: true, id, data: req.body} : {success: false, status: req.status, body: req.body, id})
    }

    get getUser() {
        return this.getUserInfo;
    }
    /**
     * get a users bots
     * @param {(Number=|String=)} id id of the user whose bots you want to get
     */
    async getUserBots(id) {
        if(!id) throw new TypeError("missing/invalid id");
        return this._apiRequest(`/user/${id}/bots`,"GET")
        .then(req => req.status === 200 ? {success: true, id, data: req.body} : {success: false, status: req.status, body: req.body, id})
    }

    /**
     * stop auto posting temporarily
     * @returns {Boolean}
     */
    pauseAutoPost() {
        if(typeof this._autoInterval === "undefined") return false;
        clearInterval(this._autoInterval);
        delete this._autoInterval;
        return true;
    }

    get stopAutoPost() {
        return this.pauseAutoPost;
    }

    /**
     * Resume auto posting after pausing it
     * @returns {Boolean}
     */
    resumeAutoPost() {
        if(this.options.autoPostInterval < this.opt.autoPostMin) throw new Error("auto post interval is too low (less than 1 minute in ms)");
        if(this.options.autoPostInterval > this.opt.autoPostMax) throw new Error("auto post interval is too high (more than 24 hours in ms)");
        this._autopost(this);
        if(this._autoInterval) delete this._autoInterval;
        this._autoInterval = setInterval(this._autopost,this.options.autoPostInterval,this);
        return true;
    }

    get startAutoPost() {
        return this.resumeAutoPost;
    }
}

module.exports = BFDAPI;