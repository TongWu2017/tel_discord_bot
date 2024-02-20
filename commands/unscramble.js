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
        if (args.length < 1) return message.reply("Please provide a word to unscramble")
        const input = args[0].toLowerCase();
        const res = await unscramble(input)
        if (!res) return message.reply("Your word was unable to be unscrambled")
        embed.setDescription(`${res.length} results found`)
        if (option == "all") {
            for (var l = input.length; l > 0; l--) {
                const words = res.filter(w => w.length == l);
                if (words.length > 0) {
                    embed.addField(`${l} letter words`, words.join("\n"))
                }
            }
        } else if (+option != NaN) {
            const words = res.filter(w => w.length == +option);
            if (words.length > 0) {
                embed.addField(`${l} letter words`, words.join("\n"))
            }
        } else {              
            const words = res.filter(w => w.length == input.length);
            if (words.length > 0) {
                embed.addField(`${l} letter words`, words.join("\n"))
            }
        } 

        return message.channel.send({ embeds: [embed]})
    },
}