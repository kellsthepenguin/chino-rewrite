package com.github.pikokr.chino

import com.github.pikokr.chino.listeners.CommandHandler
import com.github.pikokr.chino.listeners.Ready
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.hooks.EventListener

object ListenerRegistry : EventListener {
    private fun load() = arrayOf(Ready, CommandHandler)
    override fun onEvent(e: GenericEvent) {
        for (listener in load()) {
            listener.execute(e)
        }
    }
}
