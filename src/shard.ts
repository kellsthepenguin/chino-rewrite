import ChinoClient from "./util/ChinoClient"

const client = new ChinoClient()

client.start()

process.on('uncaughtException', error => console.error(error.stack))
process.on('unhandledRejection', error => console.error(error))
