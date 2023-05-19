import * as net from 'net'
import { TCPClientWorker } from './workers/TCPWorker'
import MQTTDriver from './providers/mqtt'
import MqttWorker from './workers/MqttWorker'

export class TCPServerFactory {
  public sockets: Array<net.Socket> = []
  public server: net.Server

  constructor(host: string, port: number) {
    const server = net.createServer()

    server.listen(port, host, async () => {
      console.log(new Date().toISOString() + ' TCP Server is running on port ' + port + '.')
    })

    this.server = server
  }

  listen(mqtt: MQTTDriver) {
    this.server.on('connection', (sock) => {
      console.log(new Date().toISOString() + ' CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

      this.sockets.push(sock)

      sock.on('data', (data: Buffer) => {
        const worker = new TCPClientWorker(data, sock, mqtt)
        worker.handleMessage()
      })

      sock.on('close', async () => {
        let index = this.sockets.findIndex((o: net.Socket) => {
          return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) this.sockets.splice(index, 1)
        console.log(new Date().toISOString() + ' CLOSED: ' + sock.remoteAddress + ':' + sock.remotePort)
      })

      sock.on('error', (err) => {
        console.log(new Date().toISOString() + ' Caught flash policy server socket error: ' + err.stack)
      })
    })

    mqtt.MQTT.on('message', (_, payload) => {
      const worker = new MqttWorker(payload, this.sockets)
      worker.handleMessage()
    })
  }
}


