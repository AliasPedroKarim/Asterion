import Base from "./Base";
import { CommandInteraction, Interaction, InteractionReplyOptions, Message, MessagePayload, PermissionString, ReplyMessageOptions } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

interface PermissionsCommand {
    bot: PermissionString[],
    user: (PermissionString | 'CREATOR')[]
}

export class SlashCommandBuilderCustom extends SlashCommandBuilder {
    guildIDs: string[] = [];

    constructor(guildIDs?: string[]) {
        super();

        this.guildIDs = guildIDs || [];
    }

    forGuilds() {
        return this.guildIDs.length != 0;
    }

    addGuild(guildID: string) {
        this.guildIDs.push(guildID);
        return this;
    }
}

export class MessageInteraction {
    private ctx: Message | CommandInteraction;

    constructor(ctx: Message | CommandInteraction) {
        this.ctx = ctx;
    }

    get channel() {
        return this.ctx.channel;
    }

    get guild() {
        return this.ctx.guild;
    }

    get member() {
        return this.ctx.member;
    }

    get interaction(): CommandInteraction {
        if (this.ctx instanceof Message) return null;
        return this.ctx as CommandInteraction;
    } f

    get message(): Message {
        if (this.ctx instanceof CommandInteraction) return null;
        return this.ctx as Message;
    }

    get client() {
        return this.ctx.client;
    }

    reply(options: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions & { fetchReply: true }) {
        return this.ctx.reply(options);
    }
}

export default class Command extends Base {
    aliases?: string[];
    usage?: string | string[];
    category?: string;
    description?: string;
    example?: string[] | string;
    permissions: PermissionsCommand = {
        user: [],
        bot: []
    };
    cooldown: number = 5;

    slashBuilder: SlashCommandBuilderCustom

    constructor(name) {
        super(name);

        this.slashBuilder = (new SlashCommandBuilderCustom())
            .setName(name)
            .setDescription("no description.");
    }

    setUsage(usage: string | string[]): Command {
        if (Array.isArray(usage)) {
            this.usage = usage.map((u) => `${this.name} ${u}`);
        } else {
            this.usage = `${this.name} ${usage}`;
        }
        return this;
    }

    setCategory(category: string): Command {
        this.category = category;
        return this;
    }

    setAliases(aliases: string[]): Command {
        this.aliases = aliases;
        return this;
    }

    setDescription(description: string): Command {
        this.description = description;
        this.slashBuilder.setDescription(this.description);
        return this;
    }

    setExample(example: string | string[]): Command {
        if (Array.isArray(example)) {
            this.usage = example.map((e) => `${this.name} ${e}`);
        } else {
            this.usage = `${this.name} ${example}`;
        }
        return this;
    }

    setPermissionsUser(permissions: (PermissionString | 'CREATOR')[]) {
        this.permissions.user = permissions;
        return this;
    }

    setPermissionsBot(permissions: PermissionString[]) {
        this.permissions.bot = permissions;
        return this;
    }

    setCooldown(cooldown: number) {
        this.cooldown = cooldown;
        return this;
    }

    async process(messageInteraction: MessageInteraction) {
        this.before();

        await this.run(messageInteraction);

        this.after();
    }

    before() {
        return null;
    }

    async run(messageInteraction: MessageInteraction) {
        return null;
    }

    after() {
        return null;
    }
}