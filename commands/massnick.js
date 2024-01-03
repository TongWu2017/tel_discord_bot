module.exports = {
    name: "massnick",
    description: "Rename all the users in this server to a certain nickname",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const Discord = require("discord.js")
        const fetch = require('node-fetch');
        const fs = require('fs')
        const { client } = message
        const { config, afk, econ, snipe, functions, stats, qotd, event } = client.mods
        const { randomHex, remove, toWk, randC, rng, autoEmbed, timeCo, guildFind, now, sleep, save, print, scramble, randWord, gcd, msgUrl, getKeyByValue, objValueAmt, toOrdinalSuffix, unscramble } = functions
        const { mid, cid, gid, prefix } = message.vars
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("you lack the permissions to use this command")
        await message.channel.send(`Attempting to rename ${message.guild.members.cache.size} users to ${args.join(" ")}`)
        if (config.massnick[gid]) {
            return message.reply("this server has been massnicked already, don't massnick it again without resetting it.")
        }
        if (args.length == 0) {
            return message.reply("specify something to massnick to!")
        }
        config.massnick[gid] = {}
        const massnick = message.guild.members.cache.map(member => member)
        const failArrMassnick = []
        for (var i = 0; i < massnick.length; i++) {
            config.massnick[gid][massnick[i].user.id] = massnick[i].nickname
            await massnick[i].setNickname(args.join(" ")).catch(() => failArrMassnick.push(massnick[i].user.tag))
        }
        save(config, "config.json")
        return message.reply({ content: "I finished the massnick process!", embeds: [new Discord.MessageEmbed().setDescription(`I was unable to rename the following people: ${failArrMassnick.join(", ").length > 2000 ? "too many to display" : failArrMassnick.join(", ")}`)] })
    },
}