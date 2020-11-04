package com.github.pikokr.chino

import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.hooks.EventListener

object ListenerRegistry : EventListener {
    val listeners: Array<Listener<GenericEvent>> = arrayOf()

    override fun onEvent(e: GenericEvent) {
        for (listener in listeners) {
            if (listener.type == e::class) {
                listener.execute(e)
            }
        }
    }
}