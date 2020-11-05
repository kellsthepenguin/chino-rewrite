package com.github.pikokr.chino.commands.dev

import com.github.pikokr.chino.listeners.Command
import com.github.pikokr.chino.listeners.CommandContext
import com.github.pikokr.chino.listeners.CommandInfo
import kotlinx.coroutines.Deferred
import java.lang.Exception
import javax.script.ScriptEngineManager

private suspend fun execute(ctx: CommandContext, input: String): String {
    val manager = ScriptEngineManager()
    val engine = manager.getEngineByName("kotlin")

    val bindings = engine.createBindings()

    bindings["ctx"] = ctx

    val job = (engine.eval("""
                    import com.github.pikokr.chino.listeners.CommandContext
                    import com.github.pikokr.chino.Chino
                    import kotlinx.coroutines.GlobalScope
                    import kotlinx.coroutines.async
                    
                    val ctx: CommandContext = bindings["ctx"]!! as CommandContext
                    
                    GlobalScope.async { 
                        $input
                    }
                """.trimIndent(), bindings) as Deferred<*>).await()
    return job.toString()
}

object Kts : Command() {
    override fun getInfo(): CommandInfo {
        return CommandInfo("kts", ownerOnly = true)
    }

    override suspend fun execute(ctx: CommandContext) {
        if (ctx.args.isEmpty()) {
            ctx reply "내용을 입력해주세요"
            return
        }
        val it = ctx reply "실행중..."
        val input = ctx.args.joinToString(" ").removePrefix("```").removePrefix("kt")
                .removePrefix("\n").removeSuffix("```")
        val result = try {
            execute(ctx, input)
        } catch (e: Exception) {
            e.message.toString()
        }

        val embed = ctx.embed()
        embed.addField("INPUT", "```kt\n${input.substring(0, input.length.coerceAtMost(1000))}\n```", false)
        embed.addField("OUTPUT", "```kt\n${result.substring(0, result.length.coerceAtMost(1000))}\n```", false)
        it.editMessage(embed.build()).queue()
    }
}

