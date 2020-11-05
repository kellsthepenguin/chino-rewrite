package com.github.pikokr.chino.listeners

import com.github.pikokr.chino.Chino
import com.github.pikokr.chino.commands.dev.Eval
import com.github.pikokr.chino.commands.dev.RestartBackend
import com.github.pikokr.chino.commands.general.Help
import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

fun commandList() = arrayOf(
        // dev
        Eval, RestartBackend,
        // general
        Help)

object CommandHandler : Listener() {
    override fun execute(e: GenericEvent) {
        handler(e) {
            evt(MessageReceivedEvent::class) {
                if (it.author.isBot) return@evt
                val prefix = Chino.config.commandPrefix
                if (!it.message.contentRaw.startsWith(prefix)) return@evt
                val args = it.message.contentRaw.removePrefix(prefix).split(" ").toMutableList()
                val command = args[0]
                args.removeAt(0)
                val commands = commandList()
                val cmd = commands.find { c->
                    val info = c.getInfo()
                    info.name == command || command in info.aliases
                } ?: return@evt
                val info = cmd.getInfo()
                val ctx = CommandContext(cmd, it, args)
                if (info.ownerOnly && it.author.id !in Chino.config.owners) {
                    ctx reply ctx.embed().setTitle("개발자 전용 명령어").setColor(Color.RED).setDescription("이 명령어는 봇 개발자만 사용 할 수 있어요!").build()
                    return@evt
                }
                cmd.execute(ctx)
            }
        }
    }
}