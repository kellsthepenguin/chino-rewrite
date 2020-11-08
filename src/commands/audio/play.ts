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
        const t = ctx.t
        if (!ctx.args.length) return ctx.chn.send(ctx.embed().setTitle(t('common:commands.audio.play.usage.title')).setDescription(
            t('common:commands.audio.play.usage.desc', {
                prefix: ctx.prefix
            })
        ))
        const search = ctx.args.join(' ')
        const res = await this.bot.audio.search(search, ctx.author)
        console.log(res)
    }
}
