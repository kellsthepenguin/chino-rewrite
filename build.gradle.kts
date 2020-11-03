plugins {
    java
    kotlin("jvm") version "1.4.10"
}

group = "com.github.pikokr"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("com.natpryce:konfig:1.6.10.0")
    testCompile("junit", "junit", "4.12")
}
