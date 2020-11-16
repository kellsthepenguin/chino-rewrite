import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

class Volume extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'volume',
            audio: {
                player: true,
                join: true
            },
            category: 'audio'
        });
    }

    execute(ctx: CommandContext) {
        const p = ctx.audio!
        if (!ctx.args.length) {
            return ctx.chn.send(ctx.t('audio:volume.current', {
                current: p.volume
            }) + '\n' + ctx.t('audio:volume.usage', {prefix: ctx.prefix}))
        }
        const n = Number(ctx.args[0])
        if (isNaN(n) || n > 1000 || n < 1) {
            return ctx.chn.send(ctx.t('audio:volume.usage', {prefix: ctx.prefix}))
        }
        p.setVolume(n)
        return ctx.chn.send(ctx.t('audio:volume.success', {volume: p.volume}))
    }
}

export default Volume
