module.exports = {
    name: "say",
    description: "Make the bot say something...",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        return message.channel.send({ embeds: [message.client.mods.functions.autoEmbed(args.join(" "))] });
    },
}