This is a module for interacting with [Bots For Discord](https://botsfordiscord.com)'s [api](https://docs.botsfordiscord.com).

*) You must have a bot listed on [Bots For Discord](https://botsfordiscord.com), and have an api key to use this module.
*) This module does not have auto posting features.
*) This module does not have a way to handle vote webhooks (this is your job to handle, not ours!).
*) You cannot provide a Discord.JS/Eris client in replacment of your client id.

examples:

### Posting Server Count
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.postServerCount(5).then((res) => console.log(res));
// if successful: { message: 'Server count successfully updated.', success: true }
// if failed, it will throw an error```