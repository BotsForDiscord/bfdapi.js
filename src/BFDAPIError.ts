export class BFDAPIError extends Error {
	/**
	 * discords api error
	 * @param message - the error message
	 */
	constructor(message: { statusCode: number; body: string; type: string }) {
		let parsedMessage: string = 'no error message';
		if (typeof message !== "string") {
			if (typeof message === "object") parsedMessage = JSON.stringify(message);
		}

		super(parsedMessage);
	}
}
