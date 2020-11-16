import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

class NowPlaying extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'now_playing',
            audio: {
                player: true
            },
            category: 'audio'
        });
    }

    execute(ctx: CommandContext) {
    }
}

export default NowPlaying
