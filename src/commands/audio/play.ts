import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import momentDurationFormatSetup from "moment-duration-format";
import * as moment from 'moment'
import {Track} from "erela.js";
import {Message, MessageEmbed, MessageReaction, User} from "discord.js";
import {TFunc} from "../../util/i18n/I18NRegistry";
import {PlaylistInfo, SearchResult} from "erela.js/structures/Manager";

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

    getPlaylistInfoEmbed(list: SearchResult, t: TFunc) {
        if (list.playlist) {
            return new MessageEmbed().setTitle(`${t('audio:info.playlist.added')} - ${list.playlist!.name}`).addField(t('audio:info.playlist.duration'), moment.duration(list.playlist!.duration).format('hh:mm:ss'))
        } else {
            return new MessageEmbed().setTitle(t('audio:result.multi.title')).addFields([
                {
                    name: t('audio:result.multi.duration'),
                    inline: true,
                    value: moment.duration(list.tracks.map(r=>r.duration).reduce((acc,cur)=>acc+cur)).format('hh:mm:ss')
                },
                {
                    name: t('audio:result.multi.cnt'),
                    inline: true,
                    value: list.tracks.length
                }
            ])
        }
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
        let track
        if (res.loadType === 'SEARCH_RESULT') {
            const embeds = res.tracks.map(track => this.getTrackInfoEmbed(track, t))
            const tracks: Track[] = []
            function embed(index: number) {
                return new MessageEmbed(embeds[index].toJSON()).setFooter(t('audio:tracks.selected', {cnt: tracks.length.toString()}))
            }
            const m: Message = await ctx.chn.send(embed(0))
            const reacts = ['◀', '▶', '➕', '✅']
            await Promise.all(reacts.map(value => m.react(value)))
            let page = 0
            await new Promise(async resolve => {
                const collector = m.createReactionCollector((reaction: MessageReaction, user: User) => user.id === ctx.author.id && reacts.includes(reaction.emoji.name), {
                    dispose: true
                })

                const handle = async (reaction: MessageReaction, user: User) => {
                    if (reaction.emoji.name === '◀') {
                        if (embeds[page - 1]) {
                            await m.edit(embed(--page))
                        }
                    }
                    if (reaction.emoji.name === '▶') {
                        if (embeds[page + 1]) {
                            await m.edit(embed(++page))
                        }
                    }
                    if (reaction.emoji.name === '➕') {
                        tracks.push(res.tracks[page])
                        await m.edit(embed(page))
                    }
                    if (reaction.emoji.name === '✅') {
                        return collector.stop('select')
                    }
                }
                collector.on('collect', handle)
                collector.on('remove', handle)
                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        resolve(m.delete())
                        ctx.chn.send(t('errors:timeout'))
                        return
                    }
                    if (reason === 'select') {
                        if (!tracks.length) return resolve(m.delete())
                        else if (tracks.length === 1) track = tracks[0]
                        else track = tracks
                        res.tracks = tracks
                    }
                    resolve(m.delete())
                })
            })
        } else if (res.loadType === 'TRACK_LOADED') {
            track = res.tracks[0]
        } else if (res.loadType === 'NO_MATCHES') {
            return ctx.chn.send(ctx.embed().setTitle(t('audio:errors.no_matches')))
        } else if (res.loadType === 'PLAYLIST_LOADED') {
            track = res.tracks
        } else if (res.loadType === "LOAD_FAILED") {
            return ctx.chn.send(ctx.embed().setDescription('```\n' + res.exception?.message + '```'))
        }

        if (!track) return

        const player = this.bot.audio.create({
            guild: ctx.msg.guild!.id,
            textChannel: ctx.chn.id,
            voiceChannel: ctx.member!.voice.channelID!
        })

        player.connect()

        player.queue.add(track)

        if (track instanceof Array) {
            await ctx.chn.send(this.getPlaylistInfoEmbed(res, t))
        } else {
            await ctx.chn.send(this.getTrackInfoEmbed(track, t))
        }

        if (!player.playing && !player.paused && !player.queue.size) await player.play()

        if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === res.tracks.length
        ) await player.play()
    }
}
