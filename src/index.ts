import {Asterion} from "./Client/Asterion";
import dotenv from "dotenv";
import { Intents } from "discord.js";

dotenv.config();

const asterion = new Asterion({
    intents: Intents.FLAGS.GUILDS
});