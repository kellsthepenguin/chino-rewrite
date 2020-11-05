package com.github.pikokr.chino

import com.github.pikokr.chino.backend.BackendServer
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder
import net.dv8tion.jda.api.sharding.ShardManager

object Chino {
    val config = ChinoConfigManager()
    val jda: ShardManager

    init {
        BackendServer.reload()

        jda = DefaultShardManagerBuilder.createDefault(config.token)
                .addEventListeners(ListenerRegistry)
                .build()
    }
}