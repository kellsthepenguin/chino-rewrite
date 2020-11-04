import org.jetbrains.kotlin.android.synthetic.androidIdToName

plugins {
    java
    kotlin("jvm") version "1.4.10"
}

group = "com.github.pikokr"
version = "1.0-SNAPSHOT"

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
    testCompile("junit", "junit", "4.12")
}

tasks {
    compileKotlin {
        kotlinOptions {
            jvmTarget = "1.8"
        }
    }
}
