const EventEmitter = require("events");

class BFDAPI extends EventEmitter {
    constructor(clientOrId,token,options) {
        super();
        this.errors = require("./errors");
        this.config = require("./config");
        if([undefined,null,""].includes(clientOrId)) throw new this.errors.ConstructorError("missing client or id");
        if([undefined,null,""].includes(token)) throw new this.errors.ConstructorError("missing token");
        this.options = typeof options === "object" ? options : {};
        this.util = require("util");
        this.request = this.util.promisify(require("request"));
        if(["string","int"].includes(typeof clientOrId) && !isNaN(clientOrId) && parseInt(clientOrId,10)) {
            this.clientId = parseInt(clientOrId,10);
            this.options.usingLib = false;
        } else {
            this.lib = this._isLib("discord.js",clientOrId) || this._isLib("eris",clientOrId);
            if(clientOrId && !this.lib) {
                throw new this.errors.ConstructorError("unsupported client");
            } else {
                this.client = clientOrId;
                this.clientId = this.client.user.id;
                this.options.usingLib = true;
            }
        }
        if(typeof this.options.autopost !== "undefined" && this.options.autopost === true) {
            if(typeof this.options.interval === "undefined" || isNaN(this.options.interval) || this.options.interval < this.config.minInterval || this.options.interval > this.config.maxInterval) throw new this.errors.ConstructorError(`invalid interval, must be between ${this.config.minInterval} and ${this.config.maxInterval} (ms).`);

        }
    }

    _isLib(library, client){
        try {
            const lib = require.cache[require.resolve(library)];
            return lib && client instanceof lib.exports.Client;
        } catch (e) {
            return false;
        }
    }
}

module.exports = BFDAPI;