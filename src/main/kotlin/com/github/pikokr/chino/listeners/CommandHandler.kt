package com.github.pikokr.chino.listeners

import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

object CommandHandler : Listener() {
    override fun execute(e: GenericEvent) {
        handler(e) {
            evt(MessageReceivedEvent::class) {
                println("message received!")
            }
        }
    }
}