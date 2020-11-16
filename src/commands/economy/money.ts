import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";

export default class Money extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            category: 'economy',
            id: 'money.view'
        });
    }

    async execute(ctx: CommandContext) {
        const {t} = ctx
        await ctx.chn.send(ctx.embed().setTitle(t('common:economy.money.title', {
            tag: ctx.author.tag
        })).setDescription(t('common:economy.money.desc', {
            money: ctx.user.money
        })))
    }
}
