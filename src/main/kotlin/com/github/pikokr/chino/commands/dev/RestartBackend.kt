package com.github.pikokr.chino.commands.dev

import com.github.pikokr.chino.Chino
import com.github.pikokr.chino.listeners.Command
import com.github.pikokr.chino.listeners.CommandContext
import com.github.pikokr.chino.listeners.CommandInfo
import com.github.pikokr.chino.util.edit

object RestartBackend : Command() {
    override fun getInfo(): CommandInfo {
        return CommandInfo("백엔드재시작", ownerOnly = true, category = "dev")
    }
    override suspend fun execute(ctx: CommandContext) {
        val msg = ctx reply "재시작중..."
        Chino.reloadServer()
        ctx reply "재시작 완료!"
    }
}

