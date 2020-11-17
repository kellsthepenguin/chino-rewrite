import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import {inspect} from "util";

export default class Eval extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'eval',
            category: 'dev',
            ownerOnly: true
        });
    }

    async execute(ctx: CommandContext) {
        if (!ctx.args.length) return ctx.msg.reply(`사용법: ${ctx.prefix}eval <코드>`)
        const input = ctx.args.join(' ').replace(/^```(js)\n/, '').replace(/```$/, '')
        const embed = ctx.embed()
        embed.setTitle('Evaluate')
        embed.addField('INPUT', '```js\n' + input + '```')
        embed.setFooter(`${ctx.author.tag} | 실행중...`, embed.footer?.iconURL)
        const now = Date.now()
        const m = await ctx.chn.send(embed)
        const now2 = Date.now()
        const res = await new Promise(resolve => resolve(eval(input))).catch(e => {
            embed.setColor('RED')
            return e.message
        }).then((res: any) => {
            if (typeof res !== 'string') res = inspect(res)
            if (res.length > 1000) res = res.slice(0,1000) + '...'
            return res
        })
        embed.setFooter(`${ctx.author.tag} | 실행 시간: ${Date.now() - now2}ms | 메시지 핑: ${m.createdTimestamp - now}ms`, embed.footer?.iconURL)
        embed.addField('OUTPUT', '```js\n' + res.replace(new RegExp(this.bot.token!, 'i'), '(secret)') + '```')
        await m.edit(embed)
    }
}
