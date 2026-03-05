export interface JolpicaConstructorsResponse {
    MRData: Mrdata;
}
interface Mrdata {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    ConstructorTable: ConstructorTable;
}
interface ConstructorTable {
    season: string;
    Constructors: JolpicaConstructor[];
}
export interface JolpicaConstructor {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
}
export {};
