import * as net from 'net'
import GateController from '../controllers/GateController'


interface ICommandMessage {
  ipAddress: string,
  command: string
}

export default class MqttWorker {
  constructor(public data: Buffer, public clients: Array<net.Socket>) { }

  handleMessage() {
    const payload: ICommandMessage = JSON.parse(this.data.toString())
    const client = this.clients.find((element) => element.remoteAddress === payload.ipAddress)

    if (client === undefined) return
    switch (payload.command) {
      case 'openDoor1':
        this.openDoor1(client)
        break
      case 'openDoor2':
        this.openDoor2(client)
        break
      case 'setAlarm':
        this.setAlarm(client)
        break
      case 'closeAlarm':
        this.closeAlarm(client)
        break
    }
  }

  openDoor1(client: net.Socket) {
    const gateController = new GateController(client)
    gateController.openDoor1()
  }

  openDoor2(client: net.Socket) {
    const gateController = new GateController(client)
    gateController.openDoor2()
  }

  setAlarm(client: net.Socket) {
    const gateController = new GateController(client)
    gateController.setAlarm()
  }


  closeAlarm(client: net.Socket) {
    const gateController = new GateController(client)
    gateController.closeAlarm()
  }
}
