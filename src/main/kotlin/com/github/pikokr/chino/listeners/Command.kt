package com.github.pikokr.chino.listeners

data class CommandInfo(val name: String="", val aliases: ArrayList<String> = arrayListOf(), val ownerOnly: Boolean = false, val guildOnly: Boolean = false, val category: String = "default")

open class Command {
    open fun getInfo(): CommandInfo = CommandInfo()
    open fun execute(ctx: CommandContext) {}
}