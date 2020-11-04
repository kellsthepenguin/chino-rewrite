package com.github.pikokr.chino.structs

import net.dv8tion.jda.api.events.GenericEvent
import kotlin.reflect.KClass

abstract class Listener<T: GenericEvent> {
    val type: KClass<T>

    constructor(type: KClass<T>) {
        this.type = type
    }

    open fun execute(event: T) {}
}