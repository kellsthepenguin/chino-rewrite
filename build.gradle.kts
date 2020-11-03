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
    implementation(kotlin("stdlib"))
    implementation("com.natpryce:konfig:1.6.10.0")
    implementation("net.dv8tion:JDA:4.2.0_168")
    testCompile("junit", "junit", "4.12")
}
