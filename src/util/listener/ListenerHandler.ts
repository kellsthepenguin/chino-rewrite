import {EventEmitter} from "events";
import Listener from "./Listener";
import ChinoClient from "../ChinoClient";
import chokidar from 'chokidar'
import path from "path";
import fs from 'fs/promises'

class ListenerHandler extends EventEmitter {
    listenerMap: Map<string, Listener> = new Map<string, Listener>()
    private watcher?: chokidar.FSWatcher
    private readonly dir: string
    client: ChinoClient
    emitters: Map<string, EventEmitter> = new Map()


    isEventEmitter(value: any) {
        return value
            && typeof value.on === 'function'
            && typeof value.emit === 'function';
    }


    setEmitters(emitters: any) {
        for (const [key, value] of Object.entries(emitters)) {
            if (!this.isEventEmitter(value)) throw new Error(`${key} is not an event emitter`);


            //@ts-ignore
            this.emitters.set(key, value);
        }


        return this;
    }
    addToEmitter(path: string) {
        const listener = this.listenerMap.get(path)
        if (!listener) throw new Error(`Listener with path ${path} not found.`)
        const emitter = this.isEventEmitter(listener.emitter) ? listener.emitter : this.emitters.get(listener.emitter)
        if (!this.isEventEmitter(emitter)) throw new Error(`Emitter ${listener.emitter} is not emitter`);
        (emitter as EventEmitter).on(listener.event, listener.execute.bind(listener));
        return listener;
    }


    removeFromEmitter(path: string) {
        const listener = this.listenerMap.get(path)
        if (!listener) throw new Error(`Listener with path ${path} not found.`)
        const emitter = (this.isEventEmitter(listener.emitter) ? listener.emitter : this.emitters.get(listener.emitter)) as EventEmitter
        if (!this.isEventEmitter(emitter)) throw new Error(`Emitter ${listener.emitter} is not an emitter`)
        emitter.removeListener(listener.event, listener.execute)
        return listener
    }


    constructor(client: ChinoClient, {
        watch,
        dir
    }: {
        watch: boolean
        dir: string
    }) {
        super()


        this.client = client


        this.emitters.set('client', client)


        this.emitters.set('utilClient', client)
        try {
            this.dir = path.resolve(dir)
        } catch (e) {
            throw new Error(`Path ${dir} not found.`)
        }


        this.loadAll().then(() => this.client.emit('log', 'Listeners load complete'))


        if (watch) {
            this.startWatch()
        }
    }


    load(path1: string) {
        let module = require(path1)
        if (module.default) {
            module = module.default
        }
        const listener = new module(this.client)


        if (!listener) throw new Error(`Listener not found on path ${path1}`)


        listener.__path = path1


        this.listenerMap.set(listener.__path, listener)


        this.addToEmitter(listener.__path)


        this.emit('load', listener)


        this.client.emit('log', `Loaded listener on path ${path1}`)
    }


    unload(path: string) {
        this.listenerMap.delete(path)
        this.removeFromEmitter(path)
        delete require.cache[require.resolve(path)]
    }


    reload(path: string) {
        this.client.emit('log', `Reloading listener on path ${path}`)
        try {
            this.unload(path)
        } catch (e) {
            // for not loaded listeners
        }
        this.load(path)
    }


    async loadAll(directory = this.dir) {
        const dir = await fs.readdir(directory)
        for (const value of dir) {
            if ((await fs.stat(path.join(directory, value))).isDirectory()) {
                await this.loadAll(path.join(directory, value))
            } else {
                try {
                    this.load(path.join(directory, value))
                } catch (e) {
                    this.client.emit('log', `Error while loading command with path ${value}: ${e.message}`)
                }
            }
        }
    }

    private startWatch() {
        this.watcher = chokidar.watch(this.dir)
        this.watcher.on('change', (path1) => {
            this.reload(path1)
        })
        this.client.emit('log', 'Watch started')
    }
}


export default ListenerHandler
