import ChinoClient from "../ChinoClient";

export default class Listener {
    bot: ChinoClient
    event: string
    __path: string
    emitter: string

    constructor(client: ChinoClient, emitter: string, event: string) {
        this.bot = client
        this.event = event
        this.emitter = emitter
        this.__path = ''
    }

    execute(...args: any[]) {}
}
