module.exports = {
    name: "user",
    description: "See someone's user info",
    public: true,
    dm: true,
    guild: true,
    aliases: ['info', 'userinfo', 'ui'],
    async execute(message, args) {
        const Discord = require("discord.js")
        const { client } = message
        const { guildFind } = client.mods.functions
        var user
        if (/^\d{17,19}$/.test(args[0])) user = await client.users.fetch(args[0]).catch(() => { })
        user = user || (guildFind(message) || message.author)
        const av = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })
        const member = message.guild ? message.guild.members.resolve(user) : undefined
        const embed = new Discord.MessageEmbed()
            .setAuthor(member ? user.tag + " · " + member.displayName : user.tag, av)
            .setDescription(user.id)
            .setImage(av)
            .addField("Account creation", `${user.createdAt.toUTCString()}\n${user.createdTimestamp}`)
            .addField("Guild join", `${member ? `${member.joinedAt.toUTCString()}\n${member.joinedTimestamp}` : "User not in guild"}`)
            .setColor(member ? member.displayHexColor : null)
        message.channel.send({ embeds: [embed] })
    },
}