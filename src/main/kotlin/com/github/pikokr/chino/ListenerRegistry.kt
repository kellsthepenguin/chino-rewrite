package com.github.pikokr.chino

import com.github.pikokr.chino.listeners.Ready
import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.hooks.EventListener

object ListenerRegistry : EventListener {
    val listeners: Array<Listener> = arrayOf(Ready())

    override fun onEvent(e: GenericEvent) {
        for (listener in listeners) {
            listener.execute(e)
        }
    }
}
