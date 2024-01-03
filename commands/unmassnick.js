module.exports = {
    name: "unmassnick",
    description: "Undo massnicking",
    public: true,
    dm: false,
    guild: true,
    aliases: ["massnickreset"],
    async execute(message, args) {
        const Discord = require("discord.js")
        const fetch = require('node-fetch');
        const fs = require('fs')
        const { client } = message
        const { config, afk, econ, snipe, functions, stats, qotd, event } = client.mods
        const { randomHex, remove, toWk, randC, rng, autoEmbed, timeCo, guildFind, now, sleep, save, print, scramble, randWord, gcd, msgUrl, getKeyByValue, objValueAmt, toOrdinalSuffix, unscramble } = functions
        const { mid, cid, gid, prefix } = message.vars
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("you lack the permissions to use this command")
        await message.channel.send(`Attempting to un-rename ${message.guild.members.cache.size} users to ${args.join(" ")}`)
        if (!config.massnick[gid]) {
            return message.reply("this server has not been massnicked.")
        }
        const massnick = message.guild.members.cache.array()
        const failArrMassnickReset = []
        for (var i = 0; i < massnick.length; i++) {
            await massnick[i].setNickname(config.massnick[gid][massnick[i].user.id]).catch(() => failArrMassnickReset.push(massnick[i].user.tag))
        }
        delete config.massnick[gid]
        save(config, "config.json")
        return message.reply({ embeds: ["I finished massnick resetting process!", new Discord.MessageEmbed().setDescription(`I was unable to un-rename the following people: ${failArrMassnickReset.join(", ").length > 2000 ? "too many to display" : failArrMassnickReset.join(", ")}`)] })
    },
}