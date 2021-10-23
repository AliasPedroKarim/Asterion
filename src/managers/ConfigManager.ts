import { config } from "../utils/Constants";

export default class ConfigManager {

    get prefix() {
        return config.prefix;
    }

}