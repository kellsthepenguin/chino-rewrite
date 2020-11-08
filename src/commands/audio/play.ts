import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Play extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'play',
            category: 'audio',
            audio: {
                join: true
            }
        });
    }

    async execute(ctx: CommandContext) {
        await ctx.msg.reply('테스트')
    }
}
