This is a module for interacting with [Bots For Discord](https://botsfordiscord.com)'s [api](https://docs.botsfordiscord.com).

#### You must have a bot listed on [Bots For Discord](https://botsfordiscord.com), and have an api key to use this module.
#### This module does not have auto posting features.
#### This module does not have a way to handle vote webhooks (this is your job to handle, not ours!).
#### You cannot provide a Discord.JS/Eris client in replacment of your client id.

examples:

### Posting Server Count
```javascript
const { BFDAPI } = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.postServerCount(5).then((res) => console.log(res));
// if successful: { message: 'Server count successfully updated.' }
// if failed, it will throw an error
```

### Get Bot Votes
```javascript
const { BFDAPI } = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBotVotes().then((res) => console.log(res));
// this will be different quite often
// if successful: { hasVoted: [], hasVoted24: [], votes: 0, votes24: 0, votesMonth: 0}
// if failed, it will throw an error
```

### Get Bot
```javascript
const { BFDAPI } = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBot("bot id").then((res) => console.log(res));
// this will be different for every bot
// if successful: APIBot
// if failed, it will throw an error
```

### Get User
```javascript
const { BFDAPI } = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getUser("user id").then((res) => console.log(res));
// this will be different for every bot
// if successful: APIUser
// if failed, it will throw an error
```

### Get User Bots
```javascript
const { BFDAPI } = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBot("bot id").then((res) => console.log(res));
// this will be different for every user
// if successful: array of APIBot
// if failed, it will throw an error
```

### Get Bot Widget
```javascript
const { BFDAPI } = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBotWidget().then((res) => console.log(res));
// if successful: bot widget string
// if failed, it will throw an error
```

### Listening for votes
```javascript
const { BFDAPI } = require("bfdapi.js");
const bfd = new BFDAPI();

// path defaults to /discordswebhook
// port defaults to 3000
bfd.createWebhookListener("secret", 3030, "/webhook");

bfd.on("vote", (vote) => {
    console.log(vote);
    // vote: WebhookVote
});
```
