import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Skip extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'skip',
            audio: {
                join: true,
                player: true
            }
        });
    }

    execute(ctx: CommandContext) {
    }
}
