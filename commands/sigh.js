module.exports = {
    name: "sigh",
    description: "Who are you sighing in?",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { rng, autoEmbed } = message.client.mods.functions
        return message.channel.send({ embeds: [autoEmbed(`You sighed and became ${rng(0, 100)}% more depressed!`)] })
    },
}