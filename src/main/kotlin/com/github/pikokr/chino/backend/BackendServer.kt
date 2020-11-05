package com.github.pikokr.chino.backend

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.jackson.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import java.util.concurrent.TimeUnit

object BackendServer {
    var server: NettyApplicationEngine? = null

    fun replace() {
        server = embeddedServer(Netty, port = 8080) {
            install(ContentNegotiation) {
                jackson {}
            }
            routing {
                get("/") {
                    call.respond(object {
                        val hello = "world"
                    })
                }
            }
        }

    }

    fun stop() {
        server?.stop(20, 20, TimeUnit.MILLISECONDS)
    }

    fun reload() {
        stop()
        replace()
        start()
    }

    fun start() {
        if (server != null) replace()
        server?.start(wait = false)
    }
}