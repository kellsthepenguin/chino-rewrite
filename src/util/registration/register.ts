import CommandContext from "../command/CommandContext";
import {MessageReaction} from "discord.js";

export default async (ctx: CommandContext) => {
    const embed = ctx.embed()
    embed.setTitle(ctx.t('common:register.title')).setDescription(ctx.t('common:register.desc'))
    const m = await ctx.chn.send(embed)
    await m.react('✅')
    await m.react('❌')
    const collected = await m.awaitReactions((args: MessageReaction) => args.users.cache.has(ctx.author.id) && ['❌', '✅'].includes(args.emoji.name), {
        time: 30000,
        max: 1
    })
    if (!collected.size || collected.first()?.emoji.name === '❌') {
        await m.edit(embed.setTitle(ctx.t('common:register.cancelled.title')).setDescription(ctx.t('common:register.cancelled.desc')))
        return false
    }
    await ctx.bot.db('users').insert({id: ctx.author.id})
    await m.edit(embed.setTitle(ctx.t('common:register.success.title')).setDescription(ctx.t('common:register.success.desc', {
        prefix: ctx.prefix
    })))
    return true
}
