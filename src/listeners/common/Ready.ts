import Listener from "../../util/listener/Listener";
import ChinoClient from "../../util/ChinoClient";

export default class ReadyListener extends Listener {
    constructor(client: ChinoClient) {
        super(client, 'client', 'ready')
    }

    exec() {
        if (!this.bot.shard) {
            console.error('Error: Shard only')
            process.exit(1)
            return
        }
        console.info(`Shard #${this.bot.shard.ids.reduce((acc,cur)=>acc+cur)} ready!`)
    }
}
