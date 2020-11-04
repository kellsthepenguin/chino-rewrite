package com.github.pikokr.chino.commands.general

import com.github.pikokr.chino.listeners.Command
import com.github.pikokr.chino.listeners.CommandContext
import com.github.pikokr.chino.listeners.CommandInfo
import com.github.pikokr.chino.listeners.commandList
import net.dv8tion.jda.api.entities.MessageEmbed

object Help : Command() {
    override fun getInfo(): CommandInfo {
        return CommandInfo(name = "도움말", aliases = arrayListOf("도움", "help", "명령어"))
    }

    override fun execute(ctx: CommandContext) {
        val embed = ctx.embed()
        embed.setTitle("치노 도움말!")
        val commands = commandList()
        val categories = HashSet<String>(commands.map { it.getInfo().category })
        for (category in categories) {
            embed.addField(MessageEmbed.Field(category, commands.filter { it.getInfo().category === category }.map { "`${it.getInfo().name}`" }.joinToString(" "), false))
        }
        ctx reply embed.build()
    }
}