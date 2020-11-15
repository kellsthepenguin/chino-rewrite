import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import {User} from "discord.js";

export default class Skip extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'skip',
            audio: {
                join: true,
                player: true
            },
            category: 'audio'
        });
    }

    async execute(ctx: CommandContext) {
        const player = ctx.audio!
        if (!ctx.member!.hasPermission(['ADMINISTRATOR'])) {
            let t
            if (player.queue.current) t = player.queue.current
            else t = player.queue[0]
            if ((t.requester as User).id !== ctx.author.id) {
                return ctx.chn.send(ctx.embed().setTitle(ctx.t('audio:skip.error.permissions.title'))
                    .setDescription(ctx.t('audio:skip.error.permissions.desc')))
            }
        }
        player.stop()
        return ctx.chn.send(ctx.embed().setTitle(ctx.t('audio:skip.success.title')).setDescription(ctx.t('audio:skip.success.desc', {
            title: player.queue.current?.title
        })))
    }
}
