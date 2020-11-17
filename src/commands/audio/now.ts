import Command from "../../util/command/Command"
import ChinoClient from "../../util/ChinoClient"
import CommandContext from "../../util/command/CommandContext"
import {Guild, MessageEmbed} from "discord.js"
import moment from "moment"

class NowPlaying extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'now_playing',
            category: 'audio',
            audio: {},
            globalAliases: ['np']
        })
    }

    static createBar = (total: number, current: number, size = 40, line = '▬', slider = '🔘') => {
        if (current > total) {
            const bar = line.repeat(size + 2)
            const percentage = (current / total) * 100
            return [bar, percentage]
        } else {
            const percentage = current / total
            const progress = Math.round((size * percentage))
            const emptyProgress = size - progress
            const progressText = line.repeat(progress).replace(/.$/, slider)
            const emptyProgressText = line.repeat(emptyProgress)
            const bar = progressText + emptyProgressText
            const calculated = percentage * 100
            return [bar, calculated]
        }
    }

    static async getEmbed(guild: Guild) {
        const client = guild.client as ChinoClient

        const lang = (await client.db('guilds').limit(1).where({id: guild.id}))[0]?.locale || 'ko'

        const t = client.i18n.getTFunc(lang)

        const player = client.audio.players.get(guild.id)

        const tr = player?.queue.current

        return player && tr ? new MessageEmbed().setColor('GREEN')
                .setTitle(tr.title)
                .setURL(tr.uri!)
                .setThumbnail(tr.displayThumbnail?('maxresdefault') : '')
                .setDescription('```\n' + moment.duration(player.position).format('hh:mm:ss') + '/' + moment.duration(tr.duration).format('hh:mm:ss') + '\n' + NowPlaying.createBar(tr.duration!, player.position)[0] + '```')
            : new MessageEmbed().setTitle(t('audio:now.no.title')).setColor('RED')
    }

    async execute(ctx: CommandContext) {
        const m = await ctx.chn.send(await NowPlaying.getEmbed(ctx.msg.guild!))
        this.bot.audio.npMessageMap.set(ctx.msg.guild!.id, m)
    }
}

export default NowPlaying
