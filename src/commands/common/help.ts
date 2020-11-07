import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Help extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'help',
            category: 'common'
        })
    }

    async execute(ctx: CommandContext) {
        const lang = await this.bot.i18n.getLang(ctx.msg)
        const t = ctx.t
        const categories = Array.from(new Set(this.bot.cmdHandler.commandMap.map(r=>r.options.category)))
        await ctx.chn.send(ctx.embed().setTitle(t('common:help.title')).addFields(
            categories.map(category => {
                return {
                    name: t(`common:help.categories.${category}`),
                    value: this.bot.cmdHandler.commandMap.filter(r=>r.options.category === category).map(r=>`\`${(r.options.aliases[lang] || [])[0] || r.options.id}\``).join(' ')
                }
            })
        ))
    }
}
