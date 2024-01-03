module.exports = {
    name: "unscramble",
    description: "Unscramble a word",
    aliases: ["uns"],
    public: true,
    dm: true,
    guild: true,
    async execute(message, args) {
        const fetch = require('node-fetch');
        const fs = require('fs')
        const { client } = message
        const { functions } = client.mods
        const { autoEmbed, unscramble } = functions
        const embed = autoEmbed().setTitle("Unscrambled words")
        const res = await unscramble(args.join("").toLowerCase())
        if (!res) return message.reply("Your word was unable to be unscrambled")
        embed.setDescription(`${res.length} results found`)
        res.forEach(word => embed.addField(`[${res.indexOf(word)}]`, word))
        return message.channel.send({ embeds: [embed]})
    },
}