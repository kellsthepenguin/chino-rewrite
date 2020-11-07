import ChinoClient from "../ChinoClient";
import CommandContext from "./CommandContext";

type CommandOpts = {
    id: string
    aliases?: any
    permissions?: {
        user?: string[]
        client?: string[]
    }
    category?: string
    ownerOnly?: boolean
}

export default class Command {
    bot: ChinoClient
    options: CommandOpts
    __path: string

    constructor(client: ChinoClient, options: CommandOpts) {
        this.bot = client
        this.__path = ''
        this.options = options
        this.options.category = this.options.category || 'general'
    }

    execute(ctx: CommandContext) {}
}
