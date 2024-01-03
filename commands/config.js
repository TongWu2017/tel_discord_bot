module.exports = {
    name: "config",
    description: "Server config",
    public: true,
    dm: false,
    guild: true,
    aliases: ["guildsettings"],
    async execute(message, args) {
        const { client } = message
        const { config, functions } = client.mods
        const { remove, save } = functions
        const { gid } = message.vars
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply("You lack the manager server permission to access server config settings");
        if (args.length == 0) return message.reply("you specified nothing to config.")
        if (!config.servers[gid]) config.servers[gid] = {}
        if (args[0].toLowerCase() == 'allowspam') {
            if (config.servers[gid].spamAllowedChannels == null) {
                config.servers[gid].spamAllowedChannels = []
            }
            if (config.servers[gid].spamAllowedChannels.includes(message.channel.id)) {
                return message.reply("this channel already allows spam and superspam. To disallow it, use `tel config disallowspam`.")
            }
            config.servers[gid].spamAllowedChannels.push(message.channel.id)
            message.reply("this channel now allows spam and superspam. To disallow it, use `tel config disallowspam`.")
        } else if (args[0].toLowerCase() == 'disallowspam') {
            if (config.servers[gid].spamAllowedChannels == null) {
                return message.reply("this server does not allow spam and superspam. To allow them in a channel, use `tel config allowspam` in it.")
            } else if (!config.servers[gid].spamAllowedChannels.includes(message.channel.id)) {
                return message.reply("this channel already has spam and superspam disabled (by default). To allow them, use `tel config allowspam`.")
            }
            remove(config.servers[gid].spamAllowedChannels, message.channel.id)
            message.reply("this channel now disallows spam and superspam. To allow them again, use `tel config allowspam`.")
        } else if (args[0].toLowerCase() == 'prefix') {
            if (args.length < 2) {
                delete config.servers[gid].prefixes
                message.reply("this server's prefix has been reset to `tel`!")
            } else {
                config.servers[gid].prefixes = args[1].toLowerCase()
                message.reply("this server's prefix has been set to `" + args[1] + "`!")
            }
        } else if (args[0].toLowerCase() == 'selfsnipe') {
            if (typeof config.servers[gid].selfSnipe == 'undefined') {
                config.servers[gid].selfSnipe = false
            }
            if (config.servers[gid].selfSnipe == false) {
                config.servers[gid].selfSnipe = true
                message.reply("members of this server can now snipe their own messages!")
            } else if (config.servers[gid].selfSnipe == true) {
                config.servers[gid].selfSnipe = false
                message.reply("members of this server cannot snipe their own messages anymore!")
            }
        } else if (args[0].toLowerCase() == 'enable') {
            code
        } else if (args[0].toLowerCase() == 'disable') {
            code
        } else {
            return message.reply("`" + args[0] + "` is an invalid config option.")
        }
        save(config, "config.json")
        return
    },
}