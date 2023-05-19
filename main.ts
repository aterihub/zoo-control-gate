import MQTTDriver from "./src/providers/mqtt"
import { TCPServerFactory } from "./src/server"

async function boostrap() {
	const tcpServer = new TCPServerFactory('192.168.8.201', 1337)
	const mqtt = new MQTTDriver()
	tcpServer.listen(mqtt)
}

boostrap()