import Command, { MessageInteraction } from "../structures/Command";

export class Ping extends Command {
    constructor() {
        super('ping');
    }

    async run(messageInteraction: MessageInteraction) {
        messageInteraction.reply(`Hello ${messageInteraction.member}, the ping is ${messageInteraction.client.ws.ping} ms`);
    }
}
