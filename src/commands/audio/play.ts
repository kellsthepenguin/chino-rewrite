import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import momentDurationFormatSetup from "moment-duration-format";
import * as moment from 'moment'
import {Track} from "erela.js";
import {MessageEmbed} from "discord.js";
import {TFunc} from "../../util/i18n/I18NRegistry";

momentDurationFormatSetup(moment)

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

    getTrackInfoEmbed(track: Track, t: TFunc) {
        return new MessageEmbed().setTitle(track.title).setURL(track.uri).setImage(track.displayThumbnail('maxresdefault')
        ).addFields([
            {
                name: t('audio:meta.duration'),
                value: moment.duration(track.duration).format('hh:mm:ss'),
                inline: true
            }
        ])
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
        if (res.loadType === 'SEARCH_RESULT') {
            const embeds = res.tracks.map(track => this.getTrackInfoEmbed(track, t))
            const m = await ctx.chn.send(embeds[0])
            await Promise.all(['◀', '✅', '▶'].map(value => m.react(value)))
        }
    }
}
