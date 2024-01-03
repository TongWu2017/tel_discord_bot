module.exports = {
    public: false,
    async execute(message, args) {
        const { client } = message
        const { config, functions } = client.mods
        const { save } = functions
        const arr = []
        if (message.guild) arr.push(message)
        if (args.length == 0) {
            arr.push(message.channel.send("[TOGGLE] how the fuck do I toggle anything if you don't tell me what to toggle?"))
        } else if (args[0] == "0") {
            config.toggle.dupeDel ? config.toggle.dupeDel = false : config.toggle.dupeDel = true
            arr.push(await message.channel.send("[TOGGLE] dupeDel has been set to " + config.toggle.dupeDel))
        } else if (args[0] == "1") {
            config.toggle.afkIgnore ? config.toggle.afkIgnore = false : config.toggle.afkIgnore = true
            arr.push(await message.channel.send("afkIgnore has been set to " + config.toggle.afkIgnore))
        } else if (args[0] == "2") {
            config.toggle.rmRxn ? config.toggle.rmRxn = false : config.toggle.rmRxn = true
            arr.push(await message.channel.send("rmRxn has been set to " + config.toggle.rmRxn))
        } else {
            arr.push(await message.channel.send("[TOGGLE] this is not a valid toggle argument you idiot!"))
        }
        setTimeout(() => {
            message.guild ? message.channel.bulkDelete(arr) : arr[0].delete()
        }, 1000);
        save(config, "config.json")
    },
}