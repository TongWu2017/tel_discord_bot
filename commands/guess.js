module.exports = {
    name: "guess",
    description: "Guess who this is based on the avatar",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const Discord = require("discord.js")
        const guessMember = message.guild.members.cache.filter(member => args.join(" ").includes('-b') ? true : !member.user.bot).random()
        const guessEmbed = new Discord.MessageEmbed()
            .setTitle("Guessing time! You have 15 seconds")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setColor(guessMember.displayColor)
            .setImage(guessMember.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        if (args.join(" ").includes('-d')) guessEmbed.setDescription("Their discriminator is " + guessMember.user.discriminator)
        const m = await message.channel.send({ embeds: [guessEmbed] })
        message.channel.awaitMessages(msg => [guessMember.user.username.toLowerCase(), guessMember.user.tag.toLowerCase(), guessMember.displayName.toLowerCase()].includes(msg.content.toLowerCase()), { max: 1, time: 15000 }).then(msgs => message.channel.send(`> ${msgs.first().content}\n${msgs.first().author.toString()} you guessed it correctly!`)).catch(() => m.edit({ embeds: [guessEmbed.setTitle("Timed out!").setDescription(`The member is ${guessMember.user.tag}`)] }))
    },
}