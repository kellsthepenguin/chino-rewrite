import CommandContext from "../command/CommandContext";
import {MessageReaction} from "discord.js";

export default async (ctx: CommandContext) => {
    const lng = {
        "register": {
            "title": "Register",
            "desc": "You should register to use chino's services!\nYou can register with clicking :white_check_mark: reaction!",
            "success": {
                "title": "Success!",
                "desc": "You can use chino's service now.\nIf you are not korean, you can select other languages with {{prefix}}lang command!"
            },
            "cancelled": {
                "title": "Cancelled",
                "desc": "You cancelled the registration process."
            }
        }
    }

    const embed = ctx.embed()
    embed.setTitle(lng.register.title).setDescription(lng.register.desc)
    const m = await ctx.chn.send(embed)
    await m.react('✅')
    await m.react('❌')
    const collected = await m.awaitReactions((args: MessageReaction) => args.users.cache.has(ctx.author.id) && ['❌', '✅'].includes(args.emoji.name), {
        time: 30000,
        max: 1
    })
    if (!collected.size || collected.first()?.emoji.name === '❌') {
        await m.edit(embed.setTitle(lng.register.cancelled.title).setDescription(lng.register.cancelled.desc))
        return false
    }
    await ctx.bot.db('users').insert({id: ctx.author.id})
    await m.edit(embed.setTitle(lng.register.success.title).setDescription(lng.register.success.desc.replace('{{prefix}}', ctx.prefix)))
    return true
}
