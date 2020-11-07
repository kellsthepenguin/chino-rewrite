import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Help extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'help'
        })
    }

    async execute(ctx: CommandContext) {
        await ctx.chn.send(ctx.embed().setTitle(ctx.t('common:help.title')))
    }
}
