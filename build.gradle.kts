import org.jetbrains.kotlin.android.synthetic.androidIdToName

plugins {
    java
    kotlin("jvm") version "1.4.10"
}

group = "com.github.pikokr"
version = "1.0-SNAPSHOT"

val ktorVersion = "1.4.0"

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.4.1")
    implementation(kotlin("stdlib"))
    implementation(kotlin("reflect"))
    implementation("com.natpryce:konfig:1.6.10.0")
    implementation("net.dv8tion:JDA:4.2.0_168")
    implementation(kotlin("script-util"))
    implementation(kotlin("compiler"))
    implementation(kotlin("script-runtime"))
    implementation(kotlin("scripting-compiler"))
    runtimeOnly(kotlin("compiler-embeddable"))
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.11.+")
    implementation("io.ktor:ktor-jackson:$ktorVersion")
    testCompile("junit", "junit", "4.12")
}

tasks {
    compileKotlin {
        kotlinOptions {
            jvmTarget = "1.8"
        }
    }
}
