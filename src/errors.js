class ConstructorError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConstructorError";
    }
}

class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "APIError";
    }
}

module.exports = {ConstructorError,APIError};