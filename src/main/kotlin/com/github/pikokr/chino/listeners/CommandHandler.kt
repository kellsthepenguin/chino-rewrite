package com.github.pikokr.chino.listeners

import com.github.pikokr.chino.Chino
import com.github.pikokr.chino.commands.dev.Jss
import com.github.pikokr.chino.commands.dev.Kts
import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color

fun commandList() = arrayOf(Kts, Jss)

object CommandHandler : Listener() {
    override fun execute(e: GenericEvent) {
        handler(e) {
            evt(MessageReceivedEvent::class) {
                val prefix = Chino.config.commandPrefix
                if (!it.message.contentRaw.startsWith(prefix)) return@evt
                var args = it.message.contentRaw.removePrefix(prefix).split(" ").toMutableList()
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
                    return@evt ctx reply ctx.embed().setTitle("개발자 전용 명령어").setColor(Color.RED).setDescription("이 명령어는 봇 개발자만 사용 할 수 있어요!").build()
                }
                cmd.execute(ctx)
            }
        }
    }
}