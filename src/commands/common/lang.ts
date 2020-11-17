import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Lang extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'lang',
            category: 'common'
        })
    }

    async execute(ctx: CommandContext) {
        if (!ctx.args.length || !this.bot.i18n.modules.find(r=>r.__lang === ctx.args[0])) {
            const lang = await this.bot.i18n.getLang(ctx.msg)
            const embed = ctx.embed()
            embed.setTitle('Command usage')
            embed.setDescription(`Current: ${lang}\ncommand usage: ${ctx.prefix}lang [language]\n[Supported languages]\n${Array.from(new Set(this.bot.i18n.modules.map(r=>r.__lang))).join(', ')}`)
            return ctx.chn.send(embed)
        }
        await ctx.bot.db('users').where({id: ctx.author.id}).update({locale: ctx.args[0]})
        const t = ctx.bot.i18n.getTFunc(ctx.args[0])
        const embed = ctx.embed()
        embed.setTitle(t('common:config.lang.success.title'))
        embed.setDescription(t('common:config.lang.success.desc'))
        return ctx.chn.send(embed)
    }
}
