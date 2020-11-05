package com.github.pikokr.chino.backend

import com.github.pikokr.chino.Chino
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import java.util.concurrent.TimeUnit

object BackendServer {
    var server: NettyApplicationEngine? = null

    fun replace() {
        server = embeddedServer(Netty, port = 8080) {
            routing {
                get("/") {
                    call.respondText { "테스트" }
                }
            }
        }

    }

    fun stop() {
        server?.stop(1,5, TimeUnit.SECONDS)
    }

    fun reload() {
        stop()
        replace()
        start()
    }

    fun start() {
        if (server != null) replace()
        server?.start(wait = true)
    }
}