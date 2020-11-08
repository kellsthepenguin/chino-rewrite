import ChinoClient from "../../util/ChinoClient";

export default (client: ChinoClient) => {
    if (!client.shard) {
        console.error('shard only')
        process.exit(0)
        return
    }
    console.log(`Shard #${client.shard.ids.reduce((acc,cur)=>acc+cur)} ready.`)
    client.audio.init(client.user!.id)
}
