package com.github.pikokr.chino

import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder

object Chino {
    val config = ChinoConfigManager()
    val jda: JDA
    init {
        jda = JDABuilder.createDefault(config.token).build()
    }
}