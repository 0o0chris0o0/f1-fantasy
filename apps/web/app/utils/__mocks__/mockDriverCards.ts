import { Timestamp } from "firebase/firestore";
import { CardType, type iDriverCard } from "@f1pick6/shared";

export const mockDriverCards: iDriverCard[] = [
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
        "cardId": "alonso",
        "cardName": "Fernando Alonso",
        "enabled": true,
        "teamId": "aston_martin",
        "teamName": "Aston Martin",
        "type": CardType.DRIVER,
        "nationality": "Spain",
        "nationalityCode": "ES",
        "homeRaces": [
            {
                "raceName": "Spanish Grand Prix",
                "round": 9,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "spain"
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
        "cardId": "antonelli",
        "cardName": "Andrea Kimi Antonelli",
        "enabled": true,
        "teamId": "mercedes",
        "teamName": "Mercedes",
        "type": CardType.DRIVER,
        "nationality": "Italy",
        "nationalityCode": "IT",
        "homeRaces": [
            {
                "raceName": "Italian Grand Prix",
                "round": 16,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "italy"
            },
            {
                "raceName": "Emilia Romagna Grand Prix",
                "round": 7,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "italy"
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
        "cardId": "bearman",
        "cardName": "Oliver Bearman",
        "enabled": true,
        "teamId": "haas",
        "teamName": "Haas F1 Team",
        "type": CardType.DRIVER,
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
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
    {
        "cardId": "bortoleto",
        "cardName": "Gabriel Bortoleto",
        "enabled": true,
        "teamId": "sauber",
        "teamName": "Sauber",
        "type": CardType.DRIVER,
        "nationality": "Brazil",
        "nationalityCode": "BR",
        "homeRaces": [
            {
                "raceName": "São Paulo Grand Prix",
                "round": 21,
                "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
                "firstPractice": Timestamp.fromDate(new Date('2026-12-01')),
                "locationCountry": "brazil"
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
        "cardId": "bottas",
        "cardName": "Valtteri Bottas",
        "enabled": true,
        "teamId": "",
        "teamName": "",
        "type": CardType.DRIVER,
        "nationality": "Finland",
        "nationalityCode": "FI",
        "stats": {
            "currentFantasyPoints": 0,
            "averageQualifyingPosition": 0,
            "averageRacePosition": 0,
            "numberOfDNFs": 0
        }
    },
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
    },
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
    },
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
        "cardId": "hulkenberg",
        "cardName": "Nico Hülkenberg",
        "enabled": true,
        "teamId": "sauber",
        "teamName": "Sauber",
        "type": CardType.DRIVER,
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
    },
    {
        "homeRaces": [],
        "cardId": "lindblad",
        "cardName": "Arvid Lindblad",
        "enabled": true,
        "teamId": "",
        "teamName": "",
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
    },
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
    },
    {
        "homeRaces": [],
        "cardId": "perez",
        "cardName": "Sergio Pérez",
        "enabled": true,
        "teamId": "",
        "teamName": "",
        "type": CardType.DRIVER,
        "nationality": "Mexico",
        "nationalityCode": "MX",
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
]