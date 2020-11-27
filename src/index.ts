import figlet from 'figlet'
import {ShardingManager} from 'discord.js'
import path from "path";
import config from '../config.json'

const figletBotName = figlet.textSync('CHINOBOT', {
    font: 'Soft'
})

console.log(`${figletBotName}\nChinoBOT is starting...`)

const manager = new ShardingManager(path.join(__dirname, 'shard.ts'), {
    execArgv: ['-r', 'ts-node/register'],
    token: config.token
})

manager.spawn()
