export interface JolpicaScheduleResponse {
    MRData: Mrdata;
}
interface Mrdata {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: RaceTable;
}
interface RaceTable {
    season: string;
    Races: JolpicaRace[];
}
export interface JolpicaRace {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    FirstPractice: FirstPractice;
    SecondPractice?: SecondPractice;
    ThirdPractice?: ThirdPractice;
    Qualifying: Qualifying;
    Sprint?: Sprint;
    SprintQualifying?: SprintQualifying;
}
interface Circuit {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: Location;
}
interface Location {
    lat: string;
    long: string;
    locality: string;
    country: string;
}
interface FirstPractice {
    date: string;
    time: string;
}
interface SecondPractice {
    date: string;
    time: string;
}
interface ThirdPractice {
    date: string;
    time: string;
}
interface Qualifying {
    date: string;
    time: string;
}
interface Sprint {
    date: string;
    time: string;
}
interface SprintQualifying {
    date: string;
    time: string;
}
export {};
