package com.github.pikokr.chino.listeners

import com.github.pikokr.chino.util.sendAsync
import net.dv8tion.jda.api.EmbedBuilder
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.entities.PrivateChannel
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import java.awt.Color
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

private suspend fun getDM(action: User): PrivateChannel {
    return suspendCoroutine {
        action.openPrivateChannel().queue { channel -> it.resume(channel) }
    }
}

class CommandContext(val cmd: Command, val evt: MessageReceivedEvent, val args: List<String>) {
    val msg = evt.message
    val author = evt.author
    suspend infix fun reply(msg: String) = sendAsync(evt.channel.sendMessage(msg))
    suspend infix fun reply(msg: Message) = sendAsync(evt.channel.sendMessage(msg))
    suspend infix fun reply(msg: MessageEmbed) = sendAsync(evt.channel.sendMessage(msg))

    suspend infix fun dm(msg: String) = sendAsync(getDM(evt.author).sendMessage(msg))
    suspend infix fun dm(msg: Message) = sendAsync(getDM(evt.author).sendMessage(msg))
    suspend infix fun dm(msg: MessageEmbed) = sendAsync(getDM(evt.author).sendMessage(msg))

    fun embed() = EmbedBuilder().setFooter(msg.author.asTag, msg.author.avatarUrl).setColor(Color.BLUE)
}