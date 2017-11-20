# Lisa

A discord bot with miscellaneous features

## Introduction

This bot is named after the plant Lisa from the Video game "Life is Strange".
<http://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>

It is a discord bot running on Node.js with Discord.js.

To get started using Lisa, check `$help` for a list of commands.

## Usage

If you want the bot to join your server,
go to <https://discordapp.com/oauth2/authorize?&client_id=269802184571486218&scope=bot> and confirm your server.

If you want to modify the bot, you should start by cloning this repo & installing the npm modules.

### Setup

After you cloned the repo, running `npm install` from your CLI should install all dependencies.

Then, add your bot-key to the enviroment variables as `DISCORD_KEY` (you could use another name as long as you update the index.js)

After you've done that, running `node index.js` will start the bot.

### Content

Lisa is split into modules:

- core: Contains general commands like `help`, `about` or `invite`
- lisa: Lisa-minigame commands like `status`, `water` or `pet`
- fun: Miscellaneous commands for all kinds of stuff
- tag: Use and create YNA tags, based on the popular discord-bot 42's tag system. Check `$help tag` for more help.
- pokemon: pokemon related data lookups
- users: searches/matches users
- roles: role related commands
- data: general data commands

### Optional dependencies:

Requiring node-gyp:

```shell
npm install uws hammerandchisel/erlpack
```
