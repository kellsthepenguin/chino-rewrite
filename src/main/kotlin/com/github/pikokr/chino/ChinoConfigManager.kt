package com.github.pikokr.chino

import com.natpryce.konfig.ConfigurationProperties
import com.natpryce.konfig.Key
import com.natpryce.konfig.stringType
import java.io.File

class ChinoConfigManager {
    val config = ConfigurationProperties.fromFile(File("chino.properties"))
    val token = config[Key("token", stringType)]
    val commandPrefix = config[Key("commandPrefix", stringType)]
}