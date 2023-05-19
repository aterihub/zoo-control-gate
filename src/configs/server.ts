import * as dotenv from 'dotenv'
import * as MQTT from 'mqtt'
dotenv.config()


export interface IServerConfig {
    host: string,
    port: number
}

export const ServerConfig: IServerConfig = {
    port: parseInt(process.env.SERVER_PORT || '8877'),
    host: process.env.SERVER_URL || '127.0.0.1'
}

// export const BackedConfig = {
//     url : process.env.BACKEND_URL
// }

