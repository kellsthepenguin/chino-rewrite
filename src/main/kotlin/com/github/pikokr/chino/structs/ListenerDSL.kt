package com.github.pikokr.chino.structs

import net.dv8tion.jda.api.events.GenericEvent
import kotlin.reflect.KClass

class ListenerDSL(private val event: GenericEvent) {
    fun <E: GenericEvent> evt(event: KClass<E>, invoke: (E) -> Unit) {
        if (this.event::class.java === event.java) {
            invoke(this.event as E)
        }
    }
}