import { Interaction } from "discord.js";
import Event from "../structures/Event";

export class InteractionCreate extends Event {
    async trigger(interaction: Interaction) {}
}