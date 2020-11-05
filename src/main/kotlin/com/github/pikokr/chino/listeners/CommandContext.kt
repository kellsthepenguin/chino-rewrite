package com.github.pikokr.chino.listeners

import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.entities.PrivateChannel
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.requests.restaction.MessageAction
import java.awt.Color
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

private suspend fun send(action: MessageAction): Message {
    return suspendCoroutine {
        action.queue { msg -> it.resume(msg) }
    }
}

private suspend fun getDM(action: User): PrivateChannel {
    return suspendCoroutine {
        action.openPrivateChannel().queue { channel -> it.resume(channel) }
    }
}

class CommandContext(val cmd: Command, val evt: MessageReceivedEvent, val args: List<String>) {
    val msg = evt.message
    val author = evt.author
    suspend infix fun reply(msg: String) = send(evt.channel.sendMessage(msg))
    suspend infix fun reply(msg: Message) = send(evt.channel.sendMessage(msg))
    suspend infix fun reply(msg: MessageEmbed) = send(evt.channel.sendMessage(msg))

    suspend infix fun dm(msg: String) = send(getDM(evt.author).sendMessage(msg))
    suspend infix fun dm(msg: Message) = send(getDM(evt.author).sendMessage(msg))
    suspend infix fun dm(msg: MessageEmbed) = send(getDM(evt.author).sendMessage(msg))

    fun embed() = EmbedBuilder().setFooter(msg.author.asTag, msg.author.avatarUrl).setColor(Color.BLUE)
}