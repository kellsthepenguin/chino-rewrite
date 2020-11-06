import { AkairoClient } from "discord-akairo";

export default class ChinoClient extends AkairoClient {
    constructor() {
        super({
            disableMentions: 'everyone',
        })
    }
}
