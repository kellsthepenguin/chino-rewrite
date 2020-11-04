package com.github.pikokr.chino.listeners

import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.events.ReadyEvent

class Ready : Listener() {
    override fun execute(e: GenericEvent) {
        handler(e) {
            evt(ReadyEvent::class) {
                println("Ready!")
            }
        }
    }
}