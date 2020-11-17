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
        await ctx.chn.send(ctx.embed().setTitle(t('common:economy.money.received.title')).setDescription(t('common:economy.money.received.desc', {
            money: ctx.user.money
        })))
    }
}
