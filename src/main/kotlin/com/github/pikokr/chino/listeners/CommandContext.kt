package com.github.pikokr.chino.listeners

import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

class CommandContext(val cmd: Command, val evt: MessageReceivedEvent) {
    val msg = evt.message
    val author = evt.author
    infix fun reply(msg: String) = evt.channel.sendMessage(msg).queue()
    infix fun reply(msg: Message) = evt.channel.sendMessage(msg).queue()
    infix fun reply(msg: MessageEmbed) = evt.channel.sendMessage(msg).queue()

    infix fun dm(msg: String) = evt.author.openPrivateChannel().queue { it.sendMessage(msg).queue() }
    infix fun dm(msg: Message) = evt.author.openPrivateChannel().queue { it.sendMessage(msg).queue() }
    infix fun dm(msg: MessageEmbed) = evt.author.openPrivateChannel().queue { it.sendMessage(msg).queue() }
}