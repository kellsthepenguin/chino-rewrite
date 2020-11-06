import {
    DMChannel,
    GuildMember,
    Message,
    NewsChannel,
    PartialTextBasedChannelFields,
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
    constructor(bot: ChinoClient, msg: Message, args: string[], cmd: Command) {
        this.msg = msg
        this.cmd = cmd
        this.bot = bot
        this.args = args
        this.chn = msg.channel
        this.author = msg.author
        this.member = msg.member
    }
}
