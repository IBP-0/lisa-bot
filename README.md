# Lisa-Bot

A discord bot plant that everyone can take care off.

## Introduction

This discord bot is named after [the plant Lisa from the video game "Life is Strange"](https://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>).
Lisa acts like a [Tamagotchi](https://en.wikipedia.org/wiki/Tamagotchi) that people from all kinds of different discord servers can take care of.

To get started using Lisa, check `$help` for a list of commands.

### State of the Project

_Due to [Discord not being all that great in terms of privacy](https://foundation.mozilla.org/en/privacynotincluded/discord/), I've decided that I will not add any new features for this project (but still fix bugs and security issues)._

## Getting Lisa

### Inviting Lisa

If you want the bot to join your server, go to <https://discord.com/api/oauth2/authorize?client_id=263671526279086092&permissions=51200&scope=bot> and confirm your server.

### Setting Up Lisa Yourself

#### Requirements

-   Node.js >= 16

#### How To

After you cloned the repository via Git, running `npm ci` from your CLI should install all dependencies. Then, add your discord API token to the environment variables as `DISCORD_TOKEN`. After you've done that, running `npm run start` will start the bot.
