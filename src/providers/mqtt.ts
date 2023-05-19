import * as MQTT from 'mqtt'
import { MqttConfig } from '../configs/mqtt'

export default class MQTTDriver {
  public MQTT: MQTT.Client

  constructor() {
    this.MQTT = MQTT.connect(MqttConfig)
    this.MQTT.on('connect', () => {
      console.log(`MQTT : connected with host ${MqttConfig.host}`)
    })
    this.MQTT.subscribe('topic-control')
  }

  publish(data: any) {
    this.MQTT.publish('topic', data.toString())
  }

  subscribe(topic: string) {
    this.MQTT.subscribe(topic)
  }
}

