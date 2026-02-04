import { Timestamp } from "firebase/firestore";
import { CardType, type iConstructorCard, type iDriverCard } from "../../types/card";

export const mockConstructorCards: iConstructorCard[] = [
    {
        "homeRaces": [],
        "cardId": "alpine",
        "cardName": "Alpine F1 Team",
        "enabled": true,
        "teamId": "alpine",
        "teamName": "Alpine F1 Team",
        "type": CardType.CONSTRUCTOR,
        "nationality": "France",
        "nationalityCode": "FR",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "colapinto",
                "cardName": "Franco Colapinto",
                "enabled": true,
                "teamId": "alpine",
                "teamName": "Alpine F1 Team",
                "type": CardType.DRIVER,
                "nationality": "",
                "nationalityCode": "",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "gasly",
                "cardName": "Pierre Gasly",
                "enabled": true,
                "teamId": "alpine",
                "teamName": "Alpine F1 Team",
                "type": CardType.DRIVER,
                "nationality": "France",
                "nationalityCode": "FR",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "cardId": "aston_martin",
        "cardName": "Aston Martin",
        "enabled": true,
        "teamId": "aston_martin",
        "teamName": "Aston Martin",
        "type": CardType.CONSTRUCTOR,
        "nationality": "United Kingdom",
        "nationalityCode": "GB",
        "homeRaceLocationId": "uk",
        "homeRaces": [
            {
                "raceName": "British Grand Prix",
                "round": 12,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "uk"
            }
        ],
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "alonso",
                "cardName": "Fernando Alonso",
                "enabled": true,
                "teamId": "aston_martin",
                "teamName": "Aston Martin",
                "type": CardType.DRIVER,
                "nationality": "Spain",
                "nationalityCode": "ES",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "stroll",
                "cardName": "Lance Stroll",
                "enabled": true,
                "teamId": "aston_martin",
                "teamName": "Aston Martin",
                "type": CardType.DRIVER,
                "nationality": "Canada",
                "nationalityCode": "CA",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "drivers": [],
        "cardId": "audi",
        "cardName": "Audi",
        "enabled": true,
        "teamId": "audi",
        "teamName": "Audi",
        "type": CardType.CONSTRUCTOR,
        "nationality": "Germany",
        "nationalityCode": "DE",
        "homeRaceLocationId": null,
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "drivers": [],
        "cardId": "cadillac",
        "cardName": "Cadillac F1 Team",
        "enabled": true,
        "teamId": "cadillac",
        "teamName": "Cadillac F1 Team",
        "type": CardType.CONSTRUCTOR,
        "nationality": "United States",
        "nationalityCode": "US",
        "homeRaceLocationId": "usa",
        "homeRaces": [
            {
                "raceName": "United States Grand Prix",
                "round": 19,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "usa"
            },
            {
                "raceName": "Las Vegas Grand Prix",
                "round": 22,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "usa"
            },
            {
                "raceName": "Miami Grand Prix",
                "round": 6,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "usa"
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "cardId": "ferrari",
        "cardName": "Ferrari",
        "enabled": true,
        "teamId": "ferrari",
        "teamName": "Ferrari",
        "type": CardType.CONSTRUCTOR,
        "nationality": "Italy",
        "nationalityCode": "IT",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "hamilton",
                "cardName": "Lewis Hamilton",
                "enabled": true,
                "teamId": "ferrari",
                "teamName": "Ferrari",
                "type": CardType.DRIVER,
                "nationality": "United Kingdom",
                "nationalityCode": "GB",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "leclerc",
                "cardName": "Charles Leclerc",
                "enabled": true,
                "teamId": "ferrari",
                "teamName": "Ferrari",
                "type": CardType.DRIVER,
                "nationality": "",
                "nationalityCode": "",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "cardId": "haas",
        "cardName": "Haas F1 Team",
        "enabled": true,
        "teamId": "haas",
        "teamName": "Haas F1 Team",
        "type": CardType.CONSTRUCTOR,
        "nationality": "United States",
        "nationalityCode": "US",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "bearman",
                "cardName": "Oliver Bearman",
                "enabled": true,
                "teamId": "haas",
                "teamName": "Haas F1 Team",
                "type": CardType.DRIVER,
                "nationality": "United Kingdom",
                "nationalityCode": "GB",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "ocon",
                "cardName": "Esteban Ocon",
                "enabled": true,
                "teamId": "haas",
                "teamName": "Haas F1 Team",
                "type": CardType.DRIVER,
                "nationality": "France",
                "nationalityCode": "FR",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "cardId": "mclaren",
        "cardName": "McLaren",
        "enabled": true,
        "teamId": "mclaren",
        "teamName": "McLaren",
        "type": CardType.CONSTRUCTOR,
        "nationality": "United Kingdom",
        "nationalityCode": "GB",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "norris",
                "cardName": "Lando Norris",
                "enabled": true,
                "teamId": "mclaren",
                "teamName": "McLaren",
                "type": CardType.DRIVER,
                "nationality": "United Kingdom",
                "nationalityCode": "GB",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "piastri",
                "cardName": "Oscar Piastri",
                "enabled": true,
                "teamId": "mclaren",
                "teamName": "McLaren",
                "type": CardType.DRIVER,
                "nationality": "Australia",
                "nationalityCode": "AU",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "cardId": "mercedes",
        "cardName": "Mercedes",
        "enabled": true,
        "teamId": "mercedes",
        "teamName": "Mercedes",
        "type": CardType.CONSTRUCTOR,
        "nationality": "Germany",
        "nationalityCode": "DE",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "antonelli",
                "cardName": "Andrea Kimi Antonelli",
                "enabled": true,
                "teamId": "mercedes",
                "teamName": "Mercedes",
                "type": CardType.DRIVER,
                "nationality": "Italy",
                "nationalityCode": "IT",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "russell",
                "cardName": "George Russell",
                "enabled": true,
                "teamId": "mercedes",
                "teamName": "Mercedes",
                "type": CardType.DRIVER,
                "nationality": "United Kingdom",
                "nationalityCode": "GB",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "cardId": "rb",
        "cardName": "RB F1 Team",
        "enabled": true,
        "teamId": "rb",
        "teamName": "RB F1 Team",
        "type": CardType.CONSTRUCTOR,
        "nationality": "Italy",
        "nationalityCode": "IT",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "hadjar",
                "cardName": "Isack Hadjar",
                "enabled": true,
                "teamId": "rb",
                "teamName": "RB F1 Team",
                "type": CardType.DRIVER,
                "nationality": "France",
                "nationalityCode": "FR",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "cardId": "red_bull",
        "cardName": "Red Bull",
        "enabled": true,
        "teamId": "red_bull",
        "teamName": "Red Bull",
        "type": CardType.CONSTRUCTOR,
        "nationality": "Austria",
        "nationalityCode": "AT",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "lawson",
                "cardName": "Liam Lawson",
                "enabled": true,
                "teamId": "red_bull",
                "teamName": "Red Bull",
                "type": CardType.DRIVER,
                "nationality": "New Zealand",
                "nationalityCode": "NZ",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "max_verstappen",
                "cardName": "Max Verstappen",
                "enabled": true,
                "teamId": "red_bull",
                "teamName": "Red Bull",
                "type": CardType.DRIVER,
                "nationality": "Netherlands",
                "nationalityCode": "NL",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "homeRaces": [],
        "cardId": "williams",
        "cardName": "Williams",
        "enabled": true,
        "teamId": "williams",
        "teamName": "Williams",
        "type": CardType.CONSTRUCTOR,
        "nationality": "United Kingdom",
        "nationalityCode": "GB",
        "homeRaceLocationId": null,
        "drivers": [
            {
                "homeRaces": [],
                "cardId": "albon",
                "cardName": "Alexander Albon",
                "enabled": true,
                "teamId": "williams",
                "teamName": "Williams",
                "type": CardType.DRIVER,
                "nationality": "Thailand",
                "nationalityCode": "TH",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            },
            {
                "homeRaces": [],
                "cardId": "sainz",
                "cardName": "Carlos Sainz",
                "enabled": true,
                "teamId": "williams",
                "teamName": "Williams",
                "type": CardType.DRIVER,
                "nationality": "Spain",
                "nationalityCode": "ES",
                "homeRaceLocationId": null,
                "stats": {
                    "currentFantasyPoints": 0,
                    "averageQualifyingPosition": 0,
                    "averageRacePosition": 0,
                    "numberOfDNFs": 0
                }
            }
        ],
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    }
]