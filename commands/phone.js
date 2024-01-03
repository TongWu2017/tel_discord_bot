module.exports = {
    name: "phone",
    description: "Call someone on the phone",
    public: true,
    dm: true,
    guild: true,
    async execute(message, args) {
        const Discord = require("discord.js")
        const { client } = message
        const { phone } = client.vars
        if (phone[message.channel.id]) {
            client.channels.cache.get(phone[message.channel.id]).send({ embeds: [new Discord.MessageEmbed().setDescription("The other side hang up the phone")] })
            message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription("You hang up the phone")] })
            delete phone[phone[message.channel.id]]
            delete phone[message.channel.id]
            return
        }
        if (phone.wait) {
            if (phone.wait == message.channel.id) {
                phone.wait = false
                return message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription("You cancel the phone call")] })
            }
            phone[message.channel.id] = phone.wait
            phone[phone.wait] = message.channel.id
            phone.wait = false
            message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription("You answer the phone!")] })
            client.channels.cache.get(phone[message.channel.id]).send({ embeds: [new Discord.MessageEmbed().setDescription("The phone is answered!")] })
        } else {
            phone.wait = message.channel.id
            message.channel.send("<a:nmsi_bot_loading:731747810877374464>")
        }
    },
}