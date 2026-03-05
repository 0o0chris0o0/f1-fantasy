export interface JolpicaDriversResponse {
  MRData: Mrdata
}

interface Mrdata {
  xmlns: string
  series: string
  url: string
  limit: string
  offset: string
  total: string
  DriverTable: DriverTable
}

interface DriverTable {
  season: string
  Drivers: JolpicaDriver[]
}

export interface JolpicaDriver {
  driverId: string
  permanentNumber?: string
  code: string
  url?: string
  givenName: string
  familyName: string
  dateOfBirth: string
  nationality: string
}
