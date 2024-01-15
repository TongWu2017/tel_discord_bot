module.exports = {
    name: "help",
    description: "See all of tel's commands",
    public: true,
    dm: true,
    guild: true,
    async execute(message, args) {
        const Discord = require("discord.js")
        const { client } = message

        const commands = client.commands.filter(command => command.public)
        const pages = []
        var i = 0
        commands.forEach(command => {
            if (i % 25 == 0) pages.push([])
            pages[Math.floor(i / 25)].push({ "name": command.name, "value": command.description, "inline": true })
            i += 1
        })
        if (args.length == 0 || pages[+args[0] - 1]) {
            const page = +args[0] || 1
            const embed = new Discord.MessageEmbed()
                .setTitle("My commands")
                .setDescription(`${commands.size} commands in total`)
                .setFooter(`Viewing page ${page} out of ${pages.length} pages`)
                .addFields(pages[page - 1])
            message.channel.send({ embeds: [embed] })
        } else {
            const commands_ = client.commands_.filter(command => command.public)
            const command = commands.get(args[0].toLowerCase()) || commands_.get(args[0].toLowerCase())
            if (!command) return message.reply("command not found")
            const embed = new Discord.MessageEmbed()
                .setTitle(command.name)
                .addField("Description", command.description)
            if (command.aliases && command.aliases.length > 0) embed.addField("Aliases", command.aliases.join(", "))
            message.channel.send({ embeds: [embed] })

        }
    },
}