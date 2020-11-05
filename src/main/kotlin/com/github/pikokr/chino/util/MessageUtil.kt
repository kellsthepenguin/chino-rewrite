package com.github.pikokr.chino.util

import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.MessageEmbed
import net.dv8tion.jda.api.requests.restaction.MessageAction
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

suspend fun sendAsync(action: MessageAction): Message {
    return suspendCoroutine {
        action.queue { msg -> it.resume(msg) }
    }
}

suspend infix fun Message.edit(msg: String) = sendAsync(this.editMessage(msg))
suspend infix fun Message.edit(msg: Message) = sendAsync(this.editMessage(msg))
suspend infix fun Message.edit(msg: MessageEmbed) = sendAsync(this.editMessage(msg))
