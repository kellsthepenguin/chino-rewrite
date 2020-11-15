import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import _ from "lodash";
import {MessageEmbed} from "discord.js";
import moment from "moment";

export default class Stop extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'queue',
            audio: {
                player: true
            },
            category: 'audio'
        });
    }

    async execute(ctx: CommandContext) {
        const p = ctx.audio!
        const q = p.queue.current ? [p.queue.current, ...p.queue] : [...p.queue]
        const chunked = _.chunk(q, 10)
        const embeds = chunked.map((chunk, idx) => (
            new MessageEmbed().setTitle(ctx.t('audio:queue.title')).setDescription(chunk.map((item, index) => (
                `${10*idx+index+1} ${item.title} ${moment.duration(item.duration).format('hh:mm:ss')}`
            ))).setFooter(ctx.t('audio:queue.range', {
                start: 10*idx+1,
                end: 10*idx+1+9,
                total: q.length
            }))
        ))
        if (!embeds[0]) {
            return ctx.chn.send(ctx.t('audio:errors.not_playing'))
        }
        const m = await ctx.chn.send(embeds[0])
        const emojis = ['⬅','➡']
        await Promise.all(emojis.map(m.react.bind(m)))
    }
}
