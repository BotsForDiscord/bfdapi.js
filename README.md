This is a module for interacting with [Bots For Discord](https://botsfordiscord.com)'s [api](https://docs.botsfordiscord.com).

#### You must have a bot listed on [Bots For Discord](https://botsfordiscord.com), and have an api key to use this module.
#### This module does not have a way to handle vote webhooks (this is your job to handle, not ours!).
#### You cannot provide a Discord.JS/Eris client in replacment of your client id.

examples:

### Posting Server Count
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.postServerCount(5).then((res) => console.log(res));
// if successful: { message: 'Server count successfully updated.', success: true }
// if failed, it will throw an error
```

### Auto-Posting Server Count
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.autopostServerCount(5, 60).then((res) => console.log(res));
// You can replace 5 with the method to get your bots guild count inside Number()
// 60 is the interval it posts, so this would post every 60 minutes (or every hour)
// this will NOT post on the first time it is ran, but in the NEXT x Minutes you set.

// if successful: { message: 'Server count successfully updated.', success: true }
// if failed, it will throw an error
```

### Get Bot Votes
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBotVotes().then((res) => console.log(res));
// this will be different quite often
// if successful: { hasVoted: [], hasVoted24: [], votes: 0, votes24: 0, votesMonth: 0}
// if failed, it will throw an error
```

### Get Bot
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBot("bot id").then((res) => console.log(res));
// this will be different for every bot
// if successful: <too large to put here>
// if failed, it will throw an error
```

### Get User
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getUser("user id").then((res) => console.log(res));
// this will be different for every bot
// if successful: <too large to put here>
// if failed, it will throw an error
```

### Get User Bots
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBot("bot id").then((res) => console.log(res));
// this will be different for every user
// if successful: array of Bots
// if failed, it will throw an error
```

## Get Bot Widget
```javascript
const BFDAPI = require("bfdapi.js");
const bfd = new BFDAPI("client id","api token");

bfd.getBotWidget().then((res) => console.log(res));
// if successful: bot widget string
// if failed, it will throw an error
```
