package com.github.pikokr.chino

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder
import net.dv8tion.jda.api.sharding.ShardManager
import java.util.concurrent.TimeUnit

object Chino {
    val config = ChinoConfigManager()
    val jda: ShardManager
    var server: NettyApplicationEngine? = null

    fun replaceServer() {
        server = embeddedServer(Netty, port = 8080) {
            routing {
                get("/") {
                    call.respondText { "테스트" }
                }
            }
        }
    }

    fun stopServer() {
        server?.stop(1,5,TimeUnit.SECONDS)
    }

    fun reloadServer() {
        stopServer()
        replaceServer()
        startServer()
    }

    fun startServer() {
        if (server != null) replaceServer()
        server?.start(wait = true)
    }

    init {
        startServer()

        jda = DefaultShardManagerBuilder.createDefault(config.token)
                .addEventListeners(ListenerRegistry)
                .build()
    }
}