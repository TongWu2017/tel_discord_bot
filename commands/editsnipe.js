module.exports = {
    name: "editsnipe",
    description: "See the most recent edited message",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const Discord = require("discord.js")
        const { client } = message
        const { config, snipe, functions } = client.mods
        const { remove, autoEmbed, timeCo, sleep } = functions
        var { cid, gid } = message.vars
        if (!config.premium.includes(gid)) {
            if (!message.channel.es) return message.channel.send({ embeds: [autoEmbed("No message has been edited recently!")]})
            const aId = await client.users.fetch(message.channel.es.id)
            const embed = new Discord.MessageEmbed()
                .setAuthor(aId.tag, aId.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                .setFooter(`Edited ${timeCo(message.createdTimestamp - message.channel.es.time)}ago${args.length > 0 ? "\nNote: only premium servers (coming soon™️) can editsnipe multiple messages back" : ""}`)
                .setDescription(message.channel.es.msg)
                .setColor(message.guild.members.cache.has(message.channel.es.id) ? message.guild.members.cache.get(message.channel.es.id).displayHexColor : "000000")
            message.channel.send({ embeds: [embed] })
            return
        }
        cid = "e" + cid
        if (client.vars.cooldown.includes(cid)) {
            return message.reply("there's a cooldown. Can you not spam the command?");
        }
        if (!snipe[cid] || snipe[cid].length == 0) {
            return message.channel.send({ embeds: [autoEmbed("No message has been edited recently!")]});
        }
        var esNum = +args[0];
        var esNum2 = +args[1];
        if (!(esNum > 0)) {
            esNum = 1;
        } else if (esNum > snipe[cid].length) {
            esNum = snipe[cid].length;
            message.reply("the first argument you chose is too big!");
        }
        const entry = snipe[cid][snipe[cid].length - esNum]
        if (!(esNum2 > 0)) {
            esNum2 = 1;
        } else if (esNum2 > entry.arr.length) {
            esNum2 = entry.arr.length;
            message.reply("The second argument you chose is too big!");
        }
        const aId = await client.users.fetch(entry.id)
        const member = message.guild.members.resolve(aId)
        const esEmbed = new Discord.MessageEmbed()
            .setDescription(entry.arr[esNum2 - 1].msg)
            .setFooter("Edited " + timeCo(message.createdTimestamp - entry.arr[esNum2 - 1].time) + "ago")
            .setAuthor(aId.tag, aId.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
        if (member) esEmbed.setColor(member.displayHexColor)

        message.channel.send({ embeds: [esEmbed] })
        client.vars.cooldown.push(cid)
        await sleep(1000)
        remove(client.vars.cooldown, `e${message.channel.id}`)
        return
    },
}
