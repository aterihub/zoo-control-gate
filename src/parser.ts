export function checkSum(data: Buffer): Buffer {
  const checkSumValue = data.reduce(bitwise, 0)
  return Buffer.from(checkSumValue.toString(16), 'hex')
}

function bitwise(accumulator: number, a: number) {
  return accumulator ^ a;
}

export interface ITCPStatus {
  stx?: number | undefined
  temp: number | undefined
  cmd: number | undefined
  address: number | undefined
  door: number | undefined
  length: number | undefined
  time: Date
  doorStatus: number | undefined
  cardNumInPack: number | undefined
  dirPass: number | undefined
  systemOption: number | undefined
  controlType: number | undefined
  relayOut: number | undefined
  output: number | undefined
  version: number | undefined
  OEMCODE: number | undefined
  serial: string
  input: number | undefined
  indexCmd?: number | undefined
  cmdOK?: number | undefined
}

export function doFromStatus(data : Buffer): ITCPStatus {
  return {
    // stx : data.at(0),
    temp : data.at(1),
    cmd : data.at(2),
    address : data.at(3),
    door : data.at(4),
    length : data.subarray(5,7).readInt16BE(),
    time : parseTime(data.subarray(8,14)),
    doorStatus : data.at(14),
    cardNumInPack : data.at(15),
    dirPass : data.at(16),
    systemOption : data.at(17),
    controlType : data.at(18),
    relayOut : data.at(19),
    output : data.at(24),
    version : data.at(25),
    OEMCODE : data.subarray(26,28).readInt16BE(),
    serial : data.subarray(28,34).toString(),
    input : data.subarray(34,36).readInt16BE()
  }
}

function parseTime(data : Buffer) : Date {
  const year = data[0] + 2000
  const month = data[1] - 1
  const date = data[2]
  const hours = data[3]
  const minute = data[4]
  const second = data[5]
  return new Date(year, month, date, hours, minute, second)
}