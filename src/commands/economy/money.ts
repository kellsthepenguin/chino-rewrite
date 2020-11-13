import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Money extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            category: 'economy',
            id: 'money'
        });
    }

    async execute(ctx: CommandContext) {
        console.log(ctx.user.money)
    }
}
