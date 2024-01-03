module.exports = {
    name: "ping",
    description: "See the latency and API latency of tel.",
    public: true,
    dm: true,
    guild: true,
    execute(message, args) {
        message.channel.send("Ping?").then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.floor(message.client.ws.ping)}ms`));
    },
}