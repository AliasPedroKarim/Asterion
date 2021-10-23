
import Command, { MessageInteraction } from "../structures/Command";
import { ManagerBase } from "./ManagerBase";
import { Client, CommandInteraction, Interaction, Message } from "discord.js";
import { ManagerClass } from "../types";
import { paths } from "../utils/Constants";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { Asterion } from "../Client/Asterion";

export default class CommandManager extends ManagerBase<Command> {
    constructor(client: Client) {
        super(client, { pathCtx: paths.commands });
    }

    getCommand(name: string): Command {
        return this.ctx.find((cmd) => cmd.name === name);
    }

    async init() {
        await super.init();

        this.commandAddListeners();
        this.registerSlashCommand();
    }

    async loadOrReload(pathFile: string) {
        const managerClass: ManagerClass<Command> = await this.getClass(pathFile);

        // @ts-ignore
        if (managerClass.class.prototype instanceof Command) {
            // @ts-ignore
            const cmd = new managerClass.class(managerClass.name);

            if (this.ctx.has(cmd.name)) {
                this.ctx.delete(cmd.name);
                console.log(`${cmd.name} | Command reload...`);
            }

            this.ctx.set(cmd.name, cmd);
            console.log(`${cmd.name} | Command load...`);
        }
    }

    async executeCommand(commandName: string, messageOrInteraction: Message | CommandInteraction) {
        const cmd = this.getCommand(commandName);

        if (cmd) {
            try {
                cmd.before();

                await cmd.run(new MessageInteraction(messageOrInteraction));

                cmd.before();

            } catch (error) {
                console.error("Error execution command: ", error);
            }
        }
    }

    getPrefixMatcher(message: Message) {
        const client = this.client as Asterion;
        const filtered = message.content.trim().replace(/\s+/gmi, ' ');

        return filtered.startsWith(`<@!${client.user.id}> `) ? `<@!${client.user.id}> ` : 
            filtered.startsWith(`${client.user.toString()} `) ? `${client.user.toString()} ` :
            filtered.startsWith(`<@!${client.user.id}>`) ? `<@!${client.user.id}>` :
            filtered.startsWith(client.user.toString()) ? client.user.toString() : 
            filtered.toLowerCase().startsWith(client.configManager.prefix) ? client.configManager.prefix :
            filtered.toLowerCase().startsWith(`${client.user.username.toLowerCase()} `) ? `${client.user.username.toLowerCase()} ` : undefined;
    }

    commandAddListeners() {
        this.client.on("interactionCreate", async (interaction: Interaction) => {
            if (!interaction.isCommand()) return;

            const { commandName } = interaction;

            this.executeCommand(commandName, interaction);
        });

        this.client.on("messageCreate", (message: Message) => {
            if (
                message.author.bot
                || !message.channel
                || message.channel.type !== 'GUILD_TEXT'
                || !message.guild
            ) return;

            const prefixMatcher = this.getPrefixMatcher(message);
            
            let args = message.content.slice(prefixMatcher.length).split(/\s+/);

            if(!args.length) return;

            this.executeCommand(args.slice().shift(), message);
        });
    }

    registerSlashCommand() {
        const payload = this.ctx
            .filter((cmd) => !cmd.slashBuilder.forGuilds())
            .map((cmd) => cmd.slashBuilder.toJSON());

        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        rest
            .put(Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, process.env.GUILD_ID_TEST), { body: payload })
            .then(() => {
                console.log("Application commands registered.");
            })
            .catch((e) => {
                console.error("Oops ! RIP App commands", e);
            });

        // TODO Ne pas oublier de faire le truc avec les guilds ici
    }
}