import ChinoClient from "../ChinoClient";
import path from 'path'
import {Message} from "discord.js";
import fs from "fs/promises";
import chokidar from "chokidar";

type optionsTyp = {
    dir: string
    getLang(msg: Message): string | Promise<string>
    watch: boolean
    fallback: string
}

export default class I18NRegistry {
    dir: string
    modules: any[]
    bot: ChinoClient
    getLang: (msg: Message) => string | Promise<string>
    watcher?: chokidar.FSWatcher
    fallback: string

    constructor(client: ChinoClient, {dir, getLang, watch, fallback}: optionsTyp) {
        this.dir = dir
        this.modules = []
        this.bot = client
        this.getLang = getLang
        this.fallback = fallback

        this.loadAll(dir).then(()=>this.loadAll(path.resolve(path.join(__dirname, '../../../.weblate/ko')))).then(() => console.log('Loaded locales.'))

        if (watch) {
            this.startWatching()
        }
    }

    async loadAll(directory: string) {
        const dir = await fs.readdir(directory)
        for (const value of dir) {
            if ((await fs.stat(path.join(directory, value))).isDirectory()) {
                await this.loadAll(path.join(directory, value))
            } else {
                this.load(path.join(directory, value))
            }
        }
    }

    load(path1: string) {
        try {
            delete require.cache[require.resolve(path1)]
            const module = require(path1)
            if (this.modules.find(r => r.__path === path1)) return true
            module.__path = path1
            const split = path1.replace(this.dir, '').split('/')
            module.lang = split[split.length-2]
            const fullPath = path1.split('.')[path1.split('.').length - 2].split('/')
            module.ns = fullPath[fullPath.length - 1]
            this.modules.push(module)
            console.log(`Loaded i18n namespace ${module.ns} on lng ${module.lang}`)
        } catch (e) {
            console.log(`Error on loading locale on path ${path1}: ${e.stack}`)
        }
    }

    getTFunc(lang: string): ((key: string, templates?: any) => string) {
        const mods = this.modules.filter(r => r.lang === lang)
        if (!mods[0] && this.fallback !== lang) return this.getTFunc(this.fallback)
        return (key, templates=[]) => {
            try {
                const ns = key.split(':')
                const full = ns.pop()?.split('.')

                if (!full) return key

                let current = mods.find(r => r.ns === ns[0]) as any

                full.forEach(p => {
                    current = current[p]
                    if (!current) return key
                })

                if (typeof current === 'string') {
                    for (const template in Array.from(templates)) {
                        current = current.split(`{{${template}}}`).join(templates[template])
                    }
                }
                return current || key
            } catch (e) {
                return key
            }
        }
    }

    async getT(lang?: string, msg?: Message): Promise<((key: string, templates?: any) => string)> {
        if (!lang && msg) lang = await this.getLang(msg)
        return this.getTFunc(lang!)
    }

    unload(path: string) {
        this.modules = this.modules.filter(r=>r.__path!==path)
        delete require.cache[require.resolve(path)]
    }

    reload(path: string) {
        console.log(`Reloading command on path ${path}`)
        this.unload(path)
        this.load(path)
    }

    startWatching() {
        this.watcher = chokidar.watch([this.dir, path.resolve(path.join(__dirname, '../../../.weblate/ko'))])
        this.watcher.on('change', (path1) => {
            this.reload(path1)
        })
        console.log('Locale watch started')
    }
}
