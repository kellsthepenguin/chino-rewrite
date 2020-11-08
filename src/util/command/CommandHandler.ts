import {EventEmitter} from "events";
import Command from "./Command";
import ChinoClient from "../ChinoClient";
import chokidar from 'chokidar'
import path from "path";
import fs from 'fs/promises'
import {Collection, Message, MessageEmbed} from "discord.js";
import CommandContext from "./CommandContext";

class CommandHandler extends EventEmitter {
    commandMap: Collection<string, Command> = new Collection<string, Command>()
    private watcher?: chokidar.FSWatcher
    private readonly dir: string
    prefix: string | ((msg: Message) => (Promise<string> | string))
    client: ChinoClient

    constructor(client: ChinoClient, {
        watch,
        dir,
        prefix
    }: {
        watch: boolean
        dir: string
        prefix: string
    }) {
        super()

        this.prefix = prefix

        this.client = client

        this.client.on('message', async msg => {
            let prefix: string
            if (typeof this.prefix === 'string') prefix = this.prefix
            else {
                prefix = await this.prefix(msg)
            }
            if (!msg.content.startsWith(prefix)) return
            const args = msg.content.slice(prefix.length).split(/ +/g)
            const lang = await this.client.i18n.getLang(msg)
            const command = args.shift()!
            for (const cmd of this.commandMap.values()) {
                const contents = (await fs.readdir(this.client.i18n.dir)).filter(r=>!r.endsWith('.json'))

                const aliases: any = {}

                try {
                    aliases['ko'] = require('../../../.weblate/ko/commands.json')[cmd.options.id].split(';')
                } catch (e) {}

                for (const c of contents) {
                    try {
                        aliases[c] = require(`../../../locales/${c}/commands.json`)[cmd.options.id].split(';')
                    } catch (e) {
                    } finally {
                        aliases[c] = aliases[c] || []
                    }
                }

                cmd.options.aliases = aliases
            }
            const cmd = Array.from(this.commandMap.values()).find(r => r.options.id === command || (r.options.aliases[lang] || [r.options.id]).includes(command))
            if (!cmd) return this.emit('commandNotFound', msg)
            const u = (await this.client.db('users').where({id:msg.author.id}).limit(1))[0]
            const t = await this.client.i18n.getT(undefined, msg)
            const ctx = new CommandContext(this.client, msg, Array.from(args), cmd, t, prefix)
            if (!u) {
                const reg = await require('../registration/register').default(ctx)
                if (!reg) return
            }
            if (cmd.options.ownerOnly) {
                if (!this.client.owners.includes(msg.author.id)) {
                    return msg.reply(new MessageEmbed().setColor('RED').setTitle(t('errors:permissions.owner.title')).setDescription(t('errors:permissions.owner.desc')))
                }
            }
            if (cmd.options.guildOnly && !msg.guild) {
                return msg.reply(new MessageEmbed().setColor('RED').setTitle(t('errors:only.guild.title')).setDescription(t('errors:only.guild.desc')))
            }
            if (cmd.options.audio) {
                if (cmd.options.audio.join) {
                    const player = this.client.audio.players.get(msg.guild!.id)
                    if (player) {
                        if (player.voiceChannel !== msg.member!.voice.channelID) {
                            return msg.reply(new MessageEmbed().setColor('RED').setTitle(t('errors:audio.join.already.title')).setDescription(t('errors:audio.join.already.desc')))
                        }
                    } else {
                        if (!msg.member!.voice.channelID) {
                            return msg.reply(new MessageEmbed().setColor('RED').setTitle(t('errors:audio.join.title')).setDescription(t('errors:audio.join.desc')))
                        }
                    }
                }
            }
            try {
                await cmd.execute(ctx)
            } catch (e) {
                this.emit('error', ctx, e)
            }
        })

        try {
            this.dir = path.resolve(dir)
        } catch (e) {
            throw new Error(`Path ${dir} not found.`)
        }

        this.loadAll().then(() => console.log('Listeners load complete'))

        if (watch) {
            this.startWatch()
        }
    }

    async load(path1: string) {
        let module = require(path1)
        if (module.default) {
            module = module.default
        }
        const command = new module(this.client)

        if (!command) throw new Error(`Command not found on path ${path1}`)

        command.__path = path1

        this.commandMap.set(command.__path, command)

        this.emit('load', command)

        console.log(`Loaded command on path ${path1}`)
    }

    unload(path: string) {
        this.commandMap.delete(path)
        delete require.cache[require.resolve(path)]
    }

    async reload(path: string) {
        console.log(`Reloading command on path ${path}`)
        try {
            this.unload(path)
        } catch (e) {
            // for not loaded commands
        }
        await this.load(path)
    }

    async loadAll(directory = this.dir) {
        const dir = await fs.readdir(directory)
        for (const value of dir) {
            if ((await fs.stat(path.join(directory, value))).isDirectory()) {
                await this.loadAll(path.join(directory, value))
            } else {
                try {
                    await this.load(path.join(directory, value))
                } catch (e) {
                    console.log(`Error while loading command with path ${value}: ${e.message}`)
                }
            }
        }
    }

    private startWatch() {
        this.watcher = chokidar.watch(this.dir)
        this.watcher.on('change', async (path1) => {
            await this.reload(path1)
        })
        console.log('Commands watch started')
    }
}

export default CommandHandler
