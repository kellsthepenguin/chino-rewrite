import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import _ from "lodash";
import {Message, MessageEmbed, MessageReaction, User} from "discord.js";
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
                `${item.identifier === p.queue.current?.identifier ? '**' : ''}${
                    10*idx+index+1
                } ${
                    item.title.length > 40 ?
                        item.title.slice(0,40) + '...' : 
                        item.title
                } ${
                    moment.duration(item.duration).format('hh:mm:ss')
                }${
                    item.identifier === p.queue.current?.identifier ? '**' : ''
                }`
            ))).setFooter(ctx.t('audio:queue.range', {
                start: 10*idx+1,
                end: 10*idx+1+9,
                total: q.length
            }))
        ))
        let current = 0
        if (!embeds[current]) {
            return ctx.chn.send(ctx.t('audio:errors.not_playing'))
        }
        const m: Message = await ctx.chn.send(embeds[current])
        const emojis: string[] = ['⬅','➡']
        await Promise.all(emojis.map(m.react.bind(m)))
        const collector = m.createReactionCollector((reaction: MessageReaction, user: User) => (
            emojis.includes(reaction.emoji.name) && user.id === ctx.author.id
        ), {
            dispose: true
        })

        const handler = async (reaction: MessageReaction, user: User) => {
            switch (reaction.emoji.name) {
                case '⬅':
                    if (embeds[current-1]) {
                        await m.edit(embeds[--current])
                    }
                    break
                case '➡':
                    if (embeds[current+1]) {
                        await m.edit(embeds[++current])
                    }
                    break
            }
        }

        collector.on('collect', handler)

        collector.on('remove', handler)
    }
}
