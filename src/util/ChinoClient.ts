import config from '../../config.json'
import {Client, User} from "discord.js";
import path from "path";
import CommandHandler from "./command/CommandHandler";
import I18NRegistry from "./i18n/I18NRegistry";
import Knex from "knex";
import AudioManager from "./audio/AudioManager";
import sio from 'socket.io-client'

export default class ChinoClient extends Client {
    owners: string[] = []
    cmdHandler: CommandHandler
    i18n: I18NRegistry
    db: Knex
    audio: AudioManager
    socket: SocketIOClient.Socket

    constructor() {
        super({
            disableMentions: 'everyone',
            restTimeOffset: 0,
        })

        this.socket = sio(`http://127.0.0.1:${config.internal.back.port}/internal/bot`)

        this.socket.on('connect', () => {
            console.log('Backend Socket connected')
        })
        
        this.i18n = new I18NRegistry(this, {
            watch: true,
            dir: path.join(__dirname, '../../locales'),
            getLang: async (msg) => {
                const u = (await this.db('users').where({id: msg.author.id}))[0]
                return u?.locale || 'ko'
            },
            fallback: 'ko'
        })
        this.audio = new AudioManager(this)
        this.cmdHandler = new CommandHandler(this, {
            prefix: config.prefix,
            watch: true,
            dir: path.join(__dirname, '../commands')
        })
        this.db = Knex(config.db)
        this.on('ready', () => require('../listeners/common/Ready').default(this))

        this.on('ready', async () => {
            const guilds = this.guilds.cache.map(r => r.id)
            const guildData = await this.db('guilds')
            for (const guild of guilds) {
                if (!guildData.find(r => r.id === guild)) {
                    await this.db('guilds').insert({id: guild})
                    console.log(`joined guild ${guild}`)
                }
            }
        })
        this.on('guildCreate', async (guild) => {
            const guildData = await this.db('guilds')
            if (!guildData.find(r => r.id === guild.id)) {
                await this.db('guilds').insert({id: guild.id})
                console.log(`joined guild ${guild.id}`)
            }
        })
        this.on('guildDelete', async (guild) => {
            const guildData = await this.db('guilds')
            if (guildData.find(r => r.id === guild)) {
                await this.db('guilds').delete().where({id: guild.id})
                console.log(`left guild ${guild.id}`)
            }
        })
    }

    async start() {
        await this.login(config.token)
        const data = await this.fetchApplication()
        if (data.owner) {
            if (data.owner instanceof User) {
                this.owners = [data.owner.id]
            } else {
                this.owners = data.owner.members.map(r => r.user.id)
            }
        }
    }
}
