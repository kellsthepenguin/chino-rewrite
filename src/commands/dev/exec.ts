import Command from "../../util/command/Command";
import ChinoClient from "../../util/ChinoClient";
import CommandContext from "../../util/command/CommandContext";
import {inspect} from "util";

export default class Exec extends Command {
    constructor(client: ChinoClient) {
        super(client, {
            id: 'exec',
            category: 'dev',
            ownerOnly: true
        });
    }

    async execute(ctx: CommandContext) {
        if (!ctx.args.length) return ctx.msg.reply(`사용법: ${ctx.prefix}exec [명령어]`)
        const input = ctx.args.join(' ').replace(/^```(sh)?\n/, '').replace(/```$/, '')
        const embed = ctx.embed()
        embed.setTitle('SHELL')
        embed.addField('INPUT', '```sh\n' + input + '```')
        embed.setFooter(`${ctx.author.tag} | 실행중...`, embed.footer?.iconURL)
        const now = Date.now()
        const m = await ctx.chn.send(embed)
        const now2 = Date.now()
        const res = await new Promise(resolve => {
            require('child_process').exec(input, (error: any, stdout: any, stderr: any) => resolve({error,stdout,stderr}))
        }).then((res: any) => {
            res = res.stdout + res.stderr
            if (res.length > 1000) res = res.slice(0,1000) + '...'
            return res
        })
        embed.setFooter(`${ctx.author.tag} | 실행 시간: ${Date.now() - now2}ms | 메시지 핑: ${m.createdTimestamp - now}ms`, embed.footer?.iconURL)
        embed.addField('OUTPUT', '```js\n' + res + '```')
        await m.edit(embed)
    }
}
