package com.github.pikokr.chino.structs

import net.dv8tion.jda.api.events.GenericEvent

open class Listener {
    fun handler(event: GenericEvent, action: ListenerDSL.() -> Unit) {
        action(ListenerDSL(event))
    }

    open fun execute(event: GenericEvent) {}
}