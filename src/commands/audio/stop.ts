import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import {User} from "discord.js";

export default class Stop extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'stop',
            audio: {
                join: true,
                player: true
            },
            category: 'audio'
        });
    }

    execute(ctx: CommandContext) {
        const player = ctx.audio!
        if (!ctx.member!.hasPermission(['ADMINISTRATOR'])) {
            let q
            if (player.queue.current) q = [...player.queue, player.queue.current]
            else q = player.queue
            if (q.filter(r=>(r.requester as User).id !== ctx.author.id).length) {
                return ctx.chn.send(ctx.embed().setTitle(ctx.t('audio:stop.error.permissions.rest.title'))
                    .setDescription(ctx.t('audio:stop.error.permissions.rest.desc')))
            }
        }
        player.destroy()
        return ctx.chn.send(ctx.embed().setTitle(ctx.t('audio:stop.success.title')).setDescription(ctx.t('audio:stop.success.desc')))
    }
}
