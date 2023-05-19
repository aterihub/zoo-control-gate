import * as net from 'net'
import { checkSum } from '../parser'

export default class GateController {
  constructor(public client: net.Socket) { }

  openDoor1() {
    const command = Buffer.from([0x02, 0x00, 0x2C, 0xFF, 0x01, 0x00, 0x00])
    const checkSumValue = checkSum(command)
    const etx = Buffer.from([0x03])

    const commandToDevice = Buffer.concat([command, checkSumValue, etx])
    this.client.write(commandToDevice)
  }

  openDoor2() {
    const command = Buffer.from([0x02, 0x00, 0x2C, 0xFF, 0x02, 0x00, 0x00])
    const checkSumValue = checkSum(command)
    const etx = Buffer.from([0x03])

    const commandToDevice = Buffer.concat([command, checkSumValue, etx])
    this.client.write(commandToDevice)
  }

  setAlarm() {
    const command = Buffer.from([0x02, 0x00, 0x19, 0xFF, 0x00, 0x02, 0x00, 0x00, 0x00])
    const checkSumValue = checkSum(command)
    const etx = Buffer.from([0x03])

    const commandToDevice = Buffer.concat([command, checkSumValue, etx])
    console.log(commandToDevice)
    this.client.write(commandToDevice)
  }


  closeAlarm() {
    const command = Buffer.from([0x02, 0x00, 0x19, 0xFF, 0x00, 0x02, 0x01, 0x00, 0x00])
    const checkSumValue = checkSum(command)
    const etx = Buffer.from([0x03])

    const commandToDevice = Buffer.concat([command, checkSumValue, etx])
    this.client.write(commandToDevice)
  }
}