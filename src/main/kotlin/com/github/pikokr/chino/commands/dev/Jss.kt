package com.github.pikokr.chino.commands.dev

import com.github.pikokr.chino.Chino
import com.github.pikokr.chino.listeners.Command
import com.github.pikokr.chino.listeners.CommandContext
import com.github.pikokr.chino.listeners.CommandInfo
import java.lang.Exception
import javax.script.ScriptEngineManager

object Jss : Command() {
    override fun getInfo(): CommandInfo {
        return CommandInfo("jss", ownerOnly = true)
    }

    override suspend fun execute(ctx: CommandContext) {
        if (ctx.args.isEmpty()) {
            ctx reply "내용을 입력해주세요"
            return
        }
        val manager = ScriptEngineManager()
        val engine = manager.getEngineByExtension("js")!!
        engine.put("ctx", ctx)
        engine.put("Chino", Chino)
        val input = ctx.args.joinToString(" ").removePrefix("```").removePrefix("js")
            .removePrefix("\n").removeSuffix("```")
        val result = try {
            engine.eval(input).toString()
        } catch (e: Exception) {
            e.message.toString()
        }

        val embed = ctx.embed()
        embed.addField("INPUT", "```js\n${input.substring(0, input.length.coerceAtMost(1000))}\n```", false)
        embed.addField("OUTPUT", "```js\n${result.substring(0, result.length.coerceAtMost(1000))}\n```", false)
        ctx reply embed.build()
    }
}

