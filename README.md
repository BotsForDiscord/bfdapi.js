# bfdapi.js
The official Bots for Discord API wrapper written in Javascript.

**Table Of Contents**
* [Posting with client & Autopost](#example-usage-with-client)
* [posting without client](#example-usage-without-client)
* [other methods](#you-can-also-fetch-other-information-from-the-api)
## How to Install
`npm i bfdapi.js`

## Documentation

#### example usage with client:
```js
const Discord = require("discord.js"),
    client = new Discord.Client(),
    BFDAPI = require("bfdapi.js");
client.on("ready",()=>{
    const bfd = new BFDAPI(client,"bfd api token",/* autopost stats: true/false*/false,/* autopostInterval, how often to post stats? between 1 minute and 1 day (in ms), defaults to 5 minutes*/6e4,/*shardSupport, attempt to deal with ShardingManager sharding by fetching from each shard*/false);
    bfd.on("post",(count)=>console.log(`Posted guild count: ${count}`));
    bfd.on("error",(err)=>console.error(`Error while posting: ${err}`));
});

client.login("token");
```

#### example usage without client:
```js
const BFDAPI = require("bfdapi.js"),
    // auto posting is not available with this
    bfd = new BFDAPI("client id","bfd api token");
```

### API Methods

##### You can also fetch other information from the api:

##### Post count manually
`postCount(guildCount,id)`
```js
const BFDAPI = require("bfdapi.js"),
    bfd = new BFDAPI("client id","bfd api token");
    
bfd.postCount(100);
```

##### Get info about bots
`getBotInfo(id)` (alias: `getBot`)
```js
const BFDAPI = require("bfdapi.js"),
    bfd = new BFDAPI("client id","bfd api token");
    
bfd.getBotInfo("374076950924230656");
// Kenny
```

##### Get bot widget
`getBotWidget(id,darkTheme)`
```js
const BFDAPI = require("bfdapi.js"),
    bfd = new BFDAPI("client id","bfd api token");
    
bfd.getBotWidget("374076950924230656",true);
// Kenny#4088
```

##### Get user info
`getUserInfo(id)` (alias: `getUser`)
```js
const BFDAPI = require("bfdapi.js"),
    bfd = new BFDAPI("client id","bfd api token");
    
bfd.getUserInfo("242843345402069002");
// Donovan_DMC#1337
```

##### Get user bots
`getUserBots(id)`
```js
const BFDAPI = require("bfdapi.js"),
    bfd = new BFDAPI("client id","bfd api token");
    
bfd.getUserBots("242843345402069002");
// Donovan_DMC#1337
```

##### Pause autoposting
`pauseAutoPost()` (alias: `stopAutoPost`)
```js
const Discord = require("discord.js"),
    client = new Discord.Client(),
    BFDAPI = require("bfdapi.js");
client.on("ready",()=>{
    const bfd = new BFDAPI(client,"bfd api token",false,6e4,false);
    bfd.on("post",(count)=>console.log(`Posted guild count: ${count}`));
    bfd.on("error",(err)=>console.error(`Error while posting: ${err}`));
    // pause after 5 seconds
    setTimeout(()=>{
        if(bfd.pauseAutoPost()) {
            console.log("paused");
        }
    },5e3);
});

client.login("token");
```

##### Resume autoposting
`resumeAutoPost()` (alias: `startAutoPost`)
```js
const Discord = require("discord.js"),
    client = new Discord.Client(),
    BFDAPI = require("bfdapi.js");
client.on("ready",()=>{
    const bfd = new BFDAPI(client,"bfd api token",false,6e4,false);
    bfd.on("post",(count)=>console.log(`Posted guild count: ${count}`));
    bfd.on("error",(err)=>console.error(`Error while posting: ${err}`));
    // pause after 5 seconds
    setTimeout(()=>{
        if(bfd.pauseAutoPost()) {
            console.log("paused");
            setTimeout(()=>{
                if(bfd.resumeAutoPost())  console.log("
            },5e3);
        }
    },5e3);
});

client.login("token");
```