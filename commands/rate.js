module.exports = {
    name: "rate",
    description: "Rate someone (or yourself)",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { rng, autoEmbed } = message.client.mods.functions
        if (!args.length) return message.reply("how the fuck am I supposed to perform this command if you don't tell me what you are rating?")
        const rater = args.shift()
        if (args.length) return message.channel.send({ embeds: [autoEmbed(args.join(" ") + " is " + rng(0, 100) + "% " + rater + "!")] });
        message.channel.send({ embeds: [autoEmbed("You are " + rng(0, 100) + "% " + rater + "!")] });

    },
}