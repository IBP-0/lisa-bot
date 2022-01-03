# Lisa-Bot

A discord bot with miscellaneous features.

## State of the Project

*Due to [Discord not being all that great in terms of privacy](https://foundation.mozilla.org/en/privacynotincluded/discord/), I've decided that I will not add any new features for this project (but still fix bugs and security issues).*

## Introduction

This bot is named after the plant Lisa from the video game "Life is Strange".
<https://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>.

To get started using Lisa, check `$help` for a list of commands.

## Getting Lisa

If you want the bot to join your server, go
to <https://discord.com/api/oauth2/authorize?client_id=263671526279086092&permissions=51200&scope=bot> and confirm your
server.

## Setting Up Lisa yourself

After you cloned the repository, running `npm ci --prod` from your CLI should install all dependencies. Then, add your
discord API token to the environment variables as `DISCORD_TOKEN`. After you've done that, running `npm run serve` will
start the bot.
