import {Client, ClientOptions} from "discord.js";
import CommandManager from "../managers/CommandManager";
import ConfigManager from "../managers/ConfigManager";
import EventManager from "../managers/EventManager";

export class Asterion extends Client {
    
    eventManager?: EventManager;
    commandManager?: CommandManager;

    configManager: ConfigManager;
    
    constructor(options: ClientOptions) {
        super({...options});

        this.eventManager = new EventManager(this);
        this.commandManager = new CommandManager(this);
        this.configManager = new ConfigManager();

        this.eventManager.init();
        this.commandManager.init();

        this.login(process.env.DISCORD_TOKEN);
    }

}