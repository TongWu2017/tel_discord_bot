module.exports = {
    name: "magic8ball",
    description: "Ask the Magic 8 Ball a question!",
    public: true,
    dm: true,
    guild: true,
    aliases: ["m8b", "8ball"],
    async execute(message, args) {
        const { randC, autoEmbed } = message.client.mods.functions
        var fortunes = ["N o ", "Error, your query could not be recieved at this time.", "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful.", "Definitely not.", "You and I both know how unlikely that is.", "Ping is too high, please try again later.", "Absolutely not!", "Yeah..."]
        return message.channel.send({ embeds: [autoEmbed(randC(fortunes))]});
    },
}