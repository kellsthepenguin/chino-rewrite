package com.github.pikokr.chino.listeners

import com.github.pikokr.chino.Chino
import com.github.pikokr.chino.structs.Listener
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.events.ReadyEvent

object Ready : Listener() {
    override fun execute(e: GenericEvent) {
        handler(e) {
            evt(ReadyEvent::class) {
                it.jda.shardManager!!.setActivity(Activity.listening("${Chino.config.commandPrefix}도움말"))
            }
        }
    }
}