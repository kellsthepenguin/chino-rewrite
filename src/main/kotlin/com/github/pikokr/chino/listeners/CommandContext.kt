package com.github.pikokr.chino.listeners

import net.dv8tion.jda.api.events.message.MessageReceivedEvent

class CommandContext(val cmd: Command, val evt: MessageReceivedEvent) {
    val msg = evt.message
    val author = evt.author
}