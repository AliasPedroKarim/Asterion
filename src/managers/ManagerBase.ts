import { Client, Collection } from "discord.js";
import Base from "../structures/Base";
import { ManagerClass } from "../types";
import { scanDir } from "../utils/Utils";

interface ManagerBaseOptions {
    pathCtx: string
}

export class ManagerBase<T extends Base> {
    client: Client;
    ctx: Collection<string, T> = new Collection<string, T>();

    pathCtx = './';

    constructor(client: Client, options: ManagerBaseOptions) {
        this.client = client;
        this.pathCtx = options.pathCtx;
    }

    async init() {
        const files: string[] = scanDir(this.pathCtx, {extensions: ['js', 'ts']});

        for(const pathFile of files) {
            await this.loadOrReload(pathFile);
        }
    }
    
    getCtxFromPath(path: string): T {
        return this.ctx.find((cmd, key) => cmd.getPath() === path);
    }

    async getClass(pathFile: string): Promise<ManagerClass<T>> {
        if (this.getCtxFromPath(pathFile)) {
            // TODO Found a way to do the `delete require.cache` with typescript
            if (require) {
                delete require.cache[pathFile];
            }
        }

        const file: any = await import(pathFile);
        const className = Object.keys(file)[0];
    
        return {class: file[className] as T, name: className};
    }

    async loadOrReload(e: string) {}
}