module.exports = {
    name: "choose",
    description: "Choose from a list of items, separated by `,`",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { randC, autoEmbed } = message.client.mods.functions
        let list = args.join(" ").split(",")
        if (args.length == 0) return message.reply("idiot you need something for me to choose from")
        if (list.length == 1) return message.reply("idiot you need at least two items separated by `,` for me to choose from")
        return message.channel.send({ embeds: [autoEmbed(`I choose ${randC(list).trim()}`)]})
    },
}