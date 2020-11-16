import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import {Guild, MessageEmbed} from "discord.js";

class NowPlaying extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'now_playing',
            category: 'audio',
            audio: {},
            globalAliases: ['np']
        });
    }

    static async getEmbed(guild: Guild) {
        const client = guild.client as ChinoClient

        const lang = (await client.db('guilds').limit(1).where({id: guild.id}))[0]?.locale || 'ko'

        const t = client.i18n.getTFunc(lang)

        const player = client.audio.players.get(guild.id)

        return player && player.queue.current ? new MessageEmbed() : new MessageEmbed().setTitle(t('audio:now.no.title')).setColor('RED')
    }

    async execute(ctx: CommandContext) {
        await ctx.chn.send(await NowPlaying.getEmbed(ctx.msg.guild!))
    }
}

export default NowPlaying
