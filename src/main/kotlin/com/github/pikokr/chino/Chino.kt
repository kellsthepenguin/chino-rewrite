package com.github.pikokr.chino

import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder
import net.dv8tion.jda.api.sharding.ShardManager

object Chino {
    val config = ChinoConfigManager()
    val jda: ShardManager

    init {
        jda = DefaultShardManagerBuilder.createDefault(config.token)
                .addEventListeners(ListenerRegistry)
                .build()
    }
}