module.exports = {
    name: "randomkick",
    description: "Randomly kick someone",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { client } = message
        if (!message.member.permissions.has("KICK_MEMBERS")) return
        message.reply(`are you sure you want to randomly kick someone from ${message.guild.name}?`)
        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(c => {
            if (c.first().content.toLowerCase() == "yes") {
                const kicked = client.vars.victimArr.length > 0 && client.vars.victimArr[0].guild.id == message.guild.id ? client.vars.victimArr.splice(0, 1)[0] : message.guild.members.cache.filter(member => member.kickable).random()
                if (!kicked) return message.reply("I lack the permissions to ban anyone from this server!")
                message.reply("Attempting to kick " + kicked.user.tag)
                kicked.kick({ days: 0, reason: 'Randomkicked by ' + message.author.tag }).then(() => {
                    message.channel.send("Successfully kicked <@" + kicked.user.id + ">")
                }).catch(() => { message.channel.send("I was unable to kick " + kicked.user.tag) })
            } else {
                return message.reply("cancelled randomkick, answer with `yes` if you actually want to randomkick someone next time!")
            }
        })
    },
}