package com.github.pikokr.chino.listeners

class Command(val name: String, val aliases: Array<String> = arrayOf(), val ownerOnly: Boolean = false, val guildOnly: Boolean = false) {
    open fun execute() {
    }
}