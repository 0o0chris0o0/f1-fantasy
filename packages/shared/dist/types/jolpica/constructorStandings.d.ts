export interface JolpicaConstructorStandingsResponse {
    MRData: Mrdata;
}
interface Mrdata {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable: StandingsTable;
}
interface StandingsTable {
    season: string;
    round: string;
    StandingsLists: StandingsList[];
}
interface StandingsList {
    season: string;
    round: string;
    ConstructorStandings: JolpicaConstructorStanding[];
}
export interface JolpicaConstructorStanding {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: Constructor;
}
interface Constructor {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
}
export {};
