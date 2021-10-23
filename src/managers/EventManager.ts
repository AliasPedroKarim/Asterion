import { Client } from "discord.js";
import Event from "../structures/Event";
import { ManagerClass } from "../types";
import { paths } from "../utils/Constants";
import { lcFirst } from "../utils/Utils";
import { ManagerBase } from "./ManagerBase";

export default class EventManager extends ManagerBase<Event> {
    constructor(client: Client) {
        super(client, { pathCtx: paths.events });
    }

    async loadOrReload(pathFile: string) {
        const managerClass: ManagerClass<Event> = await this.getClass(pathFile);

        // @ts-ignore
        if (managerClass.class.prototype instanceof Event) {
            // @ts-ignore
            const event = new managerClass.class(managerClass.name);

            if (this.ctx.has(event.name)) {
                this.ctx.delete(event.name);
                console.log(`${event.name} | Event reload...`);
            }

            event.trigger = event.trigger.bind(event);

            this.client.on(lcFirst(event.name), event.trigger);
            this.ctx.set(event.name, event);

            console.log(`${event.name} | Event load...`);
        }
    }
}