import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class GetMoney extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            category: 'economy',
            id: 'money.get',
            cool: 1000 * 60 * 60
        });
    }

    async execute(ctx: CommandContext) {
        const {t} = ctx
        await this.bot.db('users').update({money: Number(ctx.user.money) + 1000}).where({id: ctx.author.id})
        await ctx.chn.send(ctx.embed().setTitle(t('common:economy.money.received.title')).setDescription(t('common:economy.money.received.desc', {
            money: (await this.bot.db('users').where({id: ctx.author.id}))[0].money
        })))
    }
}
