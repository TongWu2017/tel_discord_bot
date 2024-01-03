module.exports = {
    name: "snipe",
    description: "See the most recently deleted message",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const Discord = require("discord.js")
        const { client } = message
        const { config, snipe, functions, } = client.mods
        const { remove, autoEmbed, timeCo, sleep } = functions
        var { mid, cid, gid } = message.vars
        cid = "s" + cid
        if (client.vars.cooldown.includes(cid)) {
            return message.reply("there's a cooldown. Can you not spam the command?");
        }
        if (!snipe[cid] || snipe[cid].length == 0) {
            return message.channel.send({ embeds: [autoEmbed("No message has been deleted recently!")] });
        }
        var snipeNum = +args[0];
        if (!(snipeNum > 0)) {
            snipeNum = 1;
        } else if (snipeNum > snipe[cid].length) {
            snipeNum = snipe[cid].length;
            message.reply("the number you chose is too big!");
        }
        const entry = snipe[cid][snipe[cid].length - snipeNum]
        if (mid !== config.owner && mid == entry.id && config.servers[gid] && !config.servers[gid].selfSnipe) {
            return message.reply("did you really just try to snipe your own message? What are you, attention seeker?")
        }
        const aId = await client.users.fetch(entry.id)
        const snipeEmbed = new Discord.MessageEmbed()
            .setAuthor(aId.tag, aId.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setDescription(entry.msg)
            .setFooter("Deleted " + timeCo(message.createdTimestamp - entry.time) + "ago")
            .setColor(message.guild.members.cache.has(entry.id) ? message.guild.members.cache.get(entry.id).displayHexColor : "000000")
        if (entry.img) {
            snipeEmbed.setImage(entry.img)
        }
        message.channel.send({ embeds: [snipeEmbed] })
        client.vars.cooldown.push(cid)
        await sleep(1000)
        remove(client.vars.cooldown, `s${message.channel.id}`)
    },
}