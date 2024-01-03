module.exports = {
    name: "iq",
    description: "See your IQ!",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { rng, autoEmbed } = message.client.mods.functions
        return message.channel.send({ embeds: [autoEmbed(args.length ? `${args.join(" ")}'s IQ is ${rng(rng(-1000, 0), rng(0, 1000))}!` : `${message.author.toString()}, your IQ is ${rng(rng(-1000, 0), rng(0, 1000))}!`)] });
    },
}