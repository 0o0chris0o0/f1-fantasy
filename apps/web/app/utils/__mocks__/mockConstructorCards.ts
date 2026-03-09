import { Timestamp } from "firebase/firestore";
import { CardType, type iConstructorCard } from "@f1pick6/shared/types";

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
        "homeRaces": [
            {
                "raceName": "British Grand Prix",
                "round": 12,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
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
        "homeRaces": [
            {
                "raceName": "United States Grand Prix",
                "round": 19,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "usa"
            },
            {
                "raceName": "Las Vegas Grand Prix",
                "round": 22,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "usa"
            },
            {
                "raceName": "Miami Grand Prix",
                "round": 6,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
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