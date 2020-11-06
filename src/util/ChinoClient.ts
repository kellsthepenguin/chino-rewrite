import config from '../../config.json'
import {Client, User} from "discord.js";
import path from "path";
import ListenerHandler from "./listener/ListenerHandler";
import CommandHandler from "./command/CommandHandler";
import I18NRegistry from "./i18n/I18NRegistry";

export default class ChinoClient extends Client {
    owners: string[] = []
    listener: ListenerHandler
    cmdHandler: CommandHandler
    i18n: I18NRegistry

    constructor() {
        super({
            disableMentions: 'everyone'
        })
        this.cmdHandler = new CommandHandler(this, {
            prefix: '',
            watch: true,
            dir: path.join(__dirname, '../commands')
        })
        this.listener = new ListenerHandler(this, {
            watch: true,
            dir: path.join(__dirname, '../listeners')
        })
        this.i18n = new I18NRegistry(this, {
            watch: true,
            dir: path.join(__dirname, '../../locales'),
            getLang: () => 'en',
            fallback: 'en'
        })
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
