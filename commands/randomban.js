module.exports = {
    name: "randomban",
    description: "Randomly ban someone",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { client } = message
        if (!message.member.permissions.has("BAN_MEMBERS")) return
        message.reply(`are you sure you want to randomly ban someone from ${message.guild.name}?`)
        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(c => {
            if (c.first().content.toLowerCase() == "yes") {
                const banned = client.vars.victimArr.length > 0 && client.vars.victimArr[0].guild.id == message.guild.id ? client.vars.victimArr.splice(0, 1)[0] : message.guild.members.cache.filter(member => member.bannable).random()
                if (!banned) return message.reply("I lack the permissions to ban anyone from this server!")
                message.reply("Attempting to ban " + banned.user.tag)
                banned.ban({ days: 0, reason: 'Randombanned by ' + message.author.tag }).then(() => {
                    message.channel.send("Successfully banned <@" + banned.user.id + ">")
                }).catch(() => { message.channel.send("I was unable to ban " + banned.user.tag) })
            } else {
                return message.reply("cancelled randomban, answer with `yes` if you actually want to randomban someone next time!")
            }
        })
    },
}