import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { IInfluxConfig } from '../configs/influx'
import { ITCPStatus } from '../parser'

export class InfluxDriver {
  private influxClient: InfluxDB

  constructor(private config: IInfluxConfig) {
    this.influxClient = new InfluxDB({ url: config.url, token: config.token })
  }

  public async writePoints(points: Array<Point>) {
    if (points.length === 0) return
    const writeApi = this.influxClient.getWriteApi(this.config.orgId, this.config.bucket)
    writeApi.writePoints(points)
    return await writeApi.close()
  }

  public async writePoint(point: Point) {
    const writeApi = this.influxClient.getWriteApi(this.config.orgId, this.config.bucket)
    writeApi.writePoint(point)
    return await writeApi.close()
  }

  public async writeTCPStatus(measurement: string, data: ITCPStatus, tag?: Array<ITag>) {
    const point = new Point(measurement)
    point.timestamp(data.time)

    if (tag?.length !== 0) {
      tag?.forEach(x => {
        Object.entries(x).forEach(([key, value]) => {
          point.tag(key, value)
        })
      })
    }

    Object.entries(data).forEach(([key, value]) => {
      switch (typeof value) {
        case 'string':
          point.stringField(key, value)
          break
        case 'number':
          Number.isInteger(value) ? point.intField(key, value) : point.floatField(key, value)
          break
      }
    })
    await this.writePoint(point)
    // console.log(point)
  }
}

interface ITag {
  tagName: string,
  tagValue: string
}