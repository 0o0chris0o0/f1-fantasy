export interface iJolpicaResult {
  number: string
  position: string
  positionText: string
  points: string
  Driver: Driver
  Constructor: Constructor
  grid: string
  laps: string
  status: string
  Time?: Time
  FastestLap?: FastestLap
}

interface Driver {
  driverId: string
  permanentNumber: string
  code: string
  url: string
  givenName: string
  familyName: string
  dateOfBirth: string
  nationality: string
}

interface Constructor {
  constructorId: string
  url: string
  name: string
  nationality: string
}

interface Time {
  millis: string
  time: string
}

interface FastestLap {
  rank: string
  lap: string
  Time: Time2
}

interface Time2 {
  time: string
}
