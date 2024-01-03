module.exports = {
    name: "emoji",
    description: "Uploads the image(s) to the custom emoji(s) in your message, may take a while",
    public: true,
    dm: true,
    guild: true,
    aliases: ["e"],
    async execute(message, args) {
        const a = message.content.match(/<a?:.+?:\d+>/g)
        if (!a) return message.reply("your message lacks custom emojis")
        const b = []
        message.channel.sendTyping()
        for (i in a) {
            const x = a[i].split("<").join("$").split(":").join("$").split(">").join("$").split("$").filter(item => item.length)
            if (x.length == 3) b.push(`https://cdn.discordapp.com/emojis/${x[2]}.gif`)
            else b.push(`https://cdn.discordapp.com/emojis/${x[1]}.png`)
        }
        for (i = 0, j = b.length; i < j; i += 10) {
            const y = b.slice(i, i + 10);
            await message.channel.send({ files: y })
        }
    },
}