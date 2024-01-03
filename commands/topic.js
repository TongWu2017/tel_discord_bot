module.exports = {
    name: "topic",
    description: "Random conversation starters",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { client } = message
        const { config, functions } = client.mods
        const { rng, autoEmbed } = functions
        const topic = rng(0, config.topics.length - 1)
        return message.channel.send({ embeds: [autoEmbed(`[${topic}] ${config.topics[topic]}`)]});
    },
}