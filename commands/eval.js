module.exports = {
    public: false,
    name: "null",
    description: "null",
    guild: true,
    dm: true,
    execute(message, args) {
        const Discord = require("discord.js");
        const fetch = require('node-fetch');
        const { exec } = require("child_process")
        const cheerio = require('cheerio')
        const util = require("util")
        const fs = require('fs')
        const Jimp = require('jimp');
        const { client } = message
        const { config, afk, econ, snipe, functions, stats, qotd, event } = client.mods
        const { randomHex, remove, toWk, randC, rng, autoEmbed, timeCo, guildFind, now, sleep, save, print, scramble, randWord, gcd, msgUrl, getKeyByValue, objValueAmt, toOrdinalSuffix, unscramble } = functions
        const { mid, cid, gid, prefix } = message.vars
        if (mid !== config.owner) return
        var printRes = true
        const evalChannel = message.channel
        var evalArgs = message.content.slice(prefix.length).trim().split(' ')
        evalArgs.shift()
        evalArgs = evalArgs.join(' ').trim()
        if (args[0] === 'return') {
            printRes = false
            evalArgs = evalArgs.split(' ')
            evalArgs.shift()
            evalArgs = evalArgs.join(' ').trim()
        }
        try {
            const evalRes = eval(evalArgs)
            if (JSON.stringify(evalRes) && JSON.stringify(evalRes).includes(config.token)) return evalChannel.send('👁️👄👁️', new Discord.MessageAttachment('https://media.discordapp.net/attachments/651657225126805514/741459619398025276/unknown.png'))
            if (printRes) evalChannel.send(`\`\`\`js\n${typeof evalRes}\`\`\`` + `\`\`\`js\n${JSON.stringify(evalRes) ? JSON.stringify(evalRes) : evalRes ? evalRes.toString() : JSON.stringify(evalRes)}\`\`\``).catch(err => evalChannel.send(`\`\`\`js\n${err.name}\`\`\`\n\`\`\`js\n${err.message}\`\`\``))
        } catch (error) {
            evalChannel.send(`\`\`\`js\n${error.name}\`\`\`\n\`\`\`js\n${error.message}\`\`\``)
            return
        }
    },
}
