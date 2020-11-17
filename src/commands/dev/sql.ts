import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import AsciiTable from 'ascii-table'
import fetch from "node-fetch";

export default class Sql extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'sql',
            category: 'dev',
            ownerOnly: true
        });
    }

    async execute(ctx: CommandContext) {
        if (!ctx.args.length) return ctx.msg.reply(`사용법: ${ctx.prefix}sql [SQL 구문]`)
        const input = ctx.args.join(' ').replace(/^```(sql)?\n/, '').replace(/```$/, '')
        const embed = ctx.embed()
        embed.setTitle('SQL')
        embed.addField('INPUT', '```sql\n' + input + '```')
        embed.setFooter(`${ctx.author.tag} | 실행중...`, embed.footer?.iconURL)
        const now = Date.now()
        const m = await ctx.chn.send(embed)
        const now2 = Date.now()
        const res = await this.bot.db.raw(input).then(async (res: any) => {
            if (!res.rows.length) res = 'empty'
            else {
                res = AsciiTable.factory({
                    heading: res.fields.map((r: any)=>r.name),
                    rows: res.rows.map((r: any)=>Object.values(r))
                }).toString()
            }

            if (res.length > 1000) {
                const data = await (await fetch('https://hastebin.com/documents', {
                    body: res,
                    method: 'POST'
                })).json()
                res = `https://hastebin.com/${data.key}`
            } else res = '```\n' + res + '```'
            embed.setColor('GREEN')
            return res
        }).catch(e => {
            embed.setColor('RED')
            let res: string
            res = e.message
            if (res.length > 1000) res = res.slice(0,1000) + '...'
            return res
        })
        embed.setFooter(`${ctx.author.tag} | 실행 시간: ${Date.now() - now2}ms | 메시지 핑: ${m.createdTimestamp - now}ms`, embed.footer?.iconURL)
        embed.addField('OUTPUT', res)
        await m.edit(embed)
    }
}
