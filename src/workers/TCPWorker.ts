import * as net from 'net'
import { checkSum, doFromStatus } from '../parser'
import MQTTDriver from '../providers/mqtt'
import GateController from '../controllers/GateController'

export class TCPClientWorker {
  private gateController : GateController

  constructor(public data: Buffer, public client: net.Socket, public mqtt: MQTTDriver) { 
    this.gateController = new GateController(this.client)
  }

  handleMessage() {
    this.mqtt.publish(this.data.toString('hex'))
    
    const csFromCheckSumm = checkSum(this.data.subarray(0, this.data.length - 2))
    const csFromData = Buffer.from(this.data[this.data.length - 2].toString(16), 'hex')

    if (csFromCheckSumm.compare(csFromData) !== 0) return

    const command = this.data[2]

    switch (command) {
      // 0x56 hearbit command
      case 86:
        this.onStatusHandler()
        break
      // 0x53 card event command  
      case 83:
        this.onEventCardHandler()
        break
      // 0x54 alarm event command
      case 84:
        this.onEventAlarmEvent()
        break
    }
  }

  onStatusHandler() {
    const heartData = doFromStatus(this.data)
    // const influx = new InfluxDriver(InfluxConfig)
    // influx.writeTCPStatus('gate', heartData, [{tagName: 'IPAddress', tagValue: this.client.remoteAddress!}])

    const responseStatus = Buffer.from([0x02, 0x00, 0x56, 0xFF, 0x00, 0x08, 0x00, 0x5B, 0xA0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x58, 0x03])
    this.client.write(responseStatus)
  }

  onEventCardHandler() {
    const card = this.data.subarray(7, 12)
    console.log('Card Scanned', card.readUInt32LE(0))

    const numberOfRecord = this.data[20]
    this.eventResponse(83, numberOfRecord)

    // Need to check from third party
    if ([7799944, 6947976].includes(card.readUInt32LE(0))) this.gateController.openDoor1()
  }

  onEventAlarmEvent() {
    const numberOfRecord = this.data[16]
    this.eventResponse(84, numberOfRecord)
  }

  eventResponse(event: number, numberOfRecord: number) {
    const response = Buffer.from([0x02, 0x00, event, 0xFF, 0x00, 0x01, 0x00, numberOfRecord])
    const checkSumValue = checkSum(response)
    const etx = Buffer.from([0x03])
    const responseToDevice = Buffer.concat([response, checkSumValue, etx])

    this.client.write(responseToDevice)
  }
}
