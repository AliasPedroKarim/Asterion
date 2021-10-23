import { Client } from "discord.js";
import Event from "../structures/Event";

export class Ready extends Event {
    async trigger(client: Client) {
        console.log(`${client.user.username} is now ready...`);
    }
}