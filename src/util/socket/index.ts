import ChinoClient from "../ChinoClient";

export default (client: ChinoClient) => {
    client.socket.on('eval', async (data: any) => {
        console.log(data)
        let res
        try {
            res = await eval(data.code)
        } catch (e) {
            res = {error: true, message: e.message}
        }
        client.socket.emit('response', {
            id: data.id,
            response: res
        })
    })
}