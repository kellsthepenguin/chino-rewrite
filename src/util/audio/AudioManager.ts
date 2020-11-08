import { Manager } from "erela.js";
import {Payload} from "erela.js/structures/Manager";
import ChinoClient from "../ChinoClient";
import config from '../../../config.json'

export default class AudioManager extends Manager {
    client: ChinoClient
    constructor(client: ChinoClient) {
        super({
            send(id: string, payload: Payload) {
                const guild = client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            }
        })
        this.client = client
        this.setupEvents()
    }

    private setupEvents() {
        this.on('playerCreate', player => console.log(`[MUSIC] Player created in guild ${player.guild}`))
        this.on('playerMove', (player, oldChannel, newChannel) => console.log(`[MUSIC] Player moved, guild: ${player.guild} old channel: ${oldChannel} new channel: ${newChannel}`))
        this.on('playerDestroy', player => console.log(`[MUSIC] Player destroyed in guild ${player.guild}`))
    }
}
