module.exports = {
    name: "disable",
    description: "disables a command",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { client } = message
        const { config, functions } = client.mods
        const { save, remove } = functions
        const { cid, gid } = message.vars
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("only admins can disable/enable commands")
        if (!args[0]) return message.reply("you can't disable nothing")
        const commands = client.commands.filter(command => command.public)
        const commands_ = client.commands_.filter(command => command.public)
        const command = commands.get(args[0].toLowerCase()) || commands_.get(args[0].toLowerCase())
        if (!command) return message.reply("unknown command.")
        if (!config.servers[gid]) config.servers[gid] = {}
        if (!config.servers[gid].disabled) config.servers[gid].disabled = {}
        var channel
        if (args[1] && ["guild", "server", "all"].includes(args[1].toLowerCase())) {
            channel = "_"
            if (config.servers[gid].enabled) Object.keys(config.servers[gid].enabled).filter(key => config.servers[gid].enabled[key].includes(command.name)).forEach(key => remove(config.servers[gid].enabled[key], command.name))
        } else if (message.mentions.channels.first() && message.mentions.channels.first().guild.id === gid) {
            channel = message.mentions.channels.first().id
        } else {
            channel = cid
        }
        if (!config.servers[gid].disabled[channel]) config.servers[gid].disabled[channel] = []
        config.servers[gid].enabled && config.servers[gid].enabled[channel] && config.servers[gid].enabled[channel].includes(command.name) ? remove(config.servers[gid].enabled[channel], command.name) : 0
        if (!config.servers[gid].disabled[channel].includes(command.name)) {
            config.servers[gid].disabled[channel].push(command.name)
            save(config, "config.json")
            return message.reply(`successfully disabled ${command.name} in ${channel == "_" ? message.guild.name : `<#${channel}>`}`)

        }
        save(config, "config.json")
        return message.reply(`${command.name} was already disabled in ${channel == "_" ? message.guild.name : `<#${channel}>`}, but it was disabled again anyways...`)
    },
}