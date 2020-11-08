import config from '../../config.json'
import {Client, User} from "discord.js";
import path from "path";
import ListenerHandler from "./listener/ListenerHandler";
import CommandHandler from "./command/CommandHandler";
import I18NRegistry from "./i18n/I18NRegistry";
import Knex from "knex";
import AudioManager from "./audio/AudioManager";

export default class ChinoClient extends Client {
    owners: string[] = []
    listener: ListenerHandler
    cmdHandler: CommandHandler
    i18n: I18NRegistry
    db: Knex
    audio: AudioManager

    constructor() {
        super({
            disableMentions: 'everyone'
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
        this.listener = new ListenerHandler(this, {
            watch: true,
            dir: path.join(__dirname, '../listeners')
        })
        this.db = Knex(config.db)
    }

    async start() {
        await this.login(config.token)
        const data = await this.fetchApplication()
        if (data.owner) {
            if (data.owner instanceof User) {
                this.owners = [data.owner.id]
            } else {
                this.owners = data.owner.members.map(r=>r.user.id)
            }
        }
    }
}
