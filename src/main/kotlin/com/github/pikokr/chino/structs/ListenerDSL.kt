package com.github.pikokr.chino.structs

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import net.dv8tion.jda.api.events.GenericEvent
import kotlin.reflect.KClass

class ListenerDSL(private val event: GenericEvent) {
    fun <E: GenericEvent> evt(e: KClass<E>, invoke: suspend (E) -> Unit) {
        if (this.event::class.java === e.java) {
            GlobalScope.launch {
                invoke(event as E)
            }
        }
    }
}