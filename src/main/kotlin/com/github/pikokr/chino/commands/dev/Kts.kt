package com.github.pikokr.chino.commands.dev

import com.github.pikokr.chino.Chino
import com.github.pikokr.chino.listeners.Command
import com.github.pikokr.chino.listeners.CommandContext
import com.github.pikokr.chino.listeners.CommandInfo
import java.lang.Exception
import javax.script.ScriptContext
import javax.script.ScriptEngineManager

object Kts : Command() {
    override fun getInfo(): CommandInfo {
        return CommandInfo("kts", ownerOnly = true)
    }

    override fun execute(ctx: CommandContext) {
        if (ctx.args.isEmpty()) return ctx reply "내용을 입력해주세요"
        ctx.msg.textChannel.sendMessage("실행중...").queue {
            val manager = ScriptEngineManager()
            val engine = manager.getEngineByName("kotlin")

            val bindings = engine.createBindings()

            bindings["ctx"] = ctx

            val input = ctx.args.joinToString(" ").removePrefix("```").removePrefix("kt")
                .removePrefix("\n").removeSuffix("```")
            val result = try {
                engine.eval("""
                    import com.github.pikokr.chino.listeners.CommandContext
                    import com.github.pikokr.chino.Chino
                    
                    val ctx: CommandContext = bindings["ctx"]!! as CommandContext
                    with (ctx) {
                        $input
                    }
                """.trimIndent(), bindings).toString()
            } catch (e: Exception) {
                e.message.toString()
            }

            val embed = ctx.embed()
            embed.addField("INPUT", "```kt\n${input.substring(0, input.length.coerceAtMost(1000))}\n```", false)
            embed.addField("OUTPUT", "```kt\n${result.substring(0, result.length.coerceAtMost(1000))}\n```", false)
            it.editMessage(embed.build()).queue()
        }
    }
}

