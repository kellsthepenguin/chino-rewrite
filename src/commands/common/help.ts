import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Help extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            name: '도움말'
        })
    }

    async execute(ctx: CommandContext) {
        await ctx.chn.send('도움말')
    }
}
