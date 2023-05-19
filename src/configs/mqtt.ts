import * as MQTT from 'mqtt'
import * as dotenv from 'dotenv'
dotenv.config()

export const MqttConfig: MQTT.IClientOptions = {
  host : process.env.MQTT_HOST,
  username : process.env.MQTT_USERNAME,
  password : process.env.MQTT_PASSWORD,
  clientId: 'zoo-control-gate-' + Math.random().toString(16).substring(3),
  port: parseInt(process.env.MQTT_PORT!),
  rejectUnauthorized: false,
}