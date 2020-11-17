import {
    DMChannel,
    GuildMember,
    Message,
    NewsChannel,
    MessageEmbed,
    TextChannel,
    User
} from "discord.js";
import Command from "./Command";
import ChinoClient from "../ChinoClient";
import {Player} from "erela.js";

export default class CommandContext {
    msg: Message
    cmd: Command
    args: string[]
    bot: ChinoClient
    chn: TextChannel|DMChannel|NewsChannel
    author: User
    prefix: string
    member: GuildMember|null
    audio?: Player
    user: any
    t: ((key: string, templates?: any) => string)
    constructor(bot: ChinoClient, msg: Message, args: string[], cmd: Command, t: ((key: string, templates?: any) => string), prefix: string, user: any) {
        this.msg = msg
        this.cmd = cmd
        this.bot = bot
        this.args = args
        this.chn = msg.channel
        this.author = msg.author
        this.member = msg.member
        this.prefix = prefix
        this.t = t
        this.user = user
        if (msg.guild) {
            this.audio = this.bot.audio.players.get(msg.guild.id)
        }
    }

    embed() {
        return new MessageEmbed().setColor('BLUE').setFooter(this.msg.author.tag, this.msg.author.displayAvatarURL({dynamic: true}))
    }
}
