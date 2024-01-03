module.exports = {
    name: "what",
    description: "What is this?",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const { randC, autoEmbed } = message.client.mods.functions
        var appearance = [" big", " tiny", " giant", " lazy", " small", " moving", " shiny", " sharp", " dull", " flat", " fluffy", " soft", " hard", "n ionized", " famous", " rolling", " falling"];
        var colour = ["red", "green", "blue", "yellow", "pink", "gray", "black", "transparent", "aqua", "cyan", "golden", "orange", "turquoise", "jade", "silver", "brown", "purple", "indigo", "violet", "bronze"];
        var emotion = ["happy", "sad", "depressed", "angry", "upset", "stupid", "genius", "crying", "singing", "showering", "jumpy"];
        var material = ["iron", "steel", "wooden", "ceramic", "silicon", "aluminium", "plastic", "glass", "stone", "diamond", "obsidian", "bedrock", "rubber", "cotton"];
        var noun = ["horn", "doorknob", "bathtub", "sink", "wire", "paper", "printer", "drawer", "python", "god", "calculator", "cup", "backpack", "tray", "table", "chair", "router", "ball", "pool", "car", "bat", "bowl", "soup", "cabinet", "bookshelf", "bed", "desk", "phone", "computer", "screen", "bottle", "toaster", "oven", "microwave", "key", "keyboard", "botton", "door"];
        return message.channel.send({ embeds: [autoEmbed((args[0] ? args.join(" ") + " is a" : "You are a") + randC(appearance) + " " + randC(colour) + " " + randC(emotion) + " " + randC(material) + " " + randC(noun) + "!")] });
    },
}