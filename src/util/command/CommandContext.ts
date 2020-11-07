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

export default class CommandContext {
    msg: Message
    cmd: Command
    args: string[]
    bot: ChinoClient
    chn: TextChannel|DMChannel|NewsChannel
    author: User
    member: GuildMember|null
    t: ((key: string, templates?: any) => string)
    constructor(bot: ChinoClient, msg: Message, args: string[], cmd: Command, t: ((key: string, templates?: any) => string), prefix: string) {
        this.msg = msg
        this.cmd = cmd
        this.bot = bot
        this.args = args
        this.chn = msg.channel
        this.author = msg.author
        this.member = msg.member
        this.t = t
    }
    embed() {
        return new MessageEmbed().setColor('BLUE').setFooter(this.msg.author.tag, this.msg.author.displayAvatarURL({dynamic: true}))
    }
}
