import ChinoClient from "../ChinoClient";
import CommandContext from "./CommandContext";

type CommandOpts = {
    name: string
    aliases?: string[]
    permissions?: {
        user?: string[]
        client?: string[]
    }
    category?: string
}

export default class Command {
    bot: ChinoClient
    options: CommandOpts
    __path: string

    constructor(client: ChinoClient, options: CommandOpts) {
        this.bot = client
        this.__path = ''
        this.options = options
        this.options.aliases = this.options.aliases || []
    }

    execute(ctx: CommandContext) {}
}