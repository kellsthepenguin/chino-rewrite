package com.github.pikokr.chino.listeners

import com.github.pikokr.chino.Chino
import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

object CommandHandler : Listener() {
    override fun execute(e: GenericEvent) {
        handler(e) {
            evt(MessageReceivedEvent::class) {
                val prefix = Chino.config.commandPrefix
                if (!it.message.contentRaw.startsWith(prefix)) return@evt
                val args = it.message.contentRaw.removePrefix(prefix).split(" ")
            }
        }
    }
}