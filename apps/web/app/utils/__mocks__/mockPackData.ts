import { iCardRarity } from "../../../../../packages/shared/types/card";
import type { iPack } from "../../../../../packages/shared/types/pack";

export const mockPackData: iPack = {
    "cost": 250,
    "hiddenFromStore": false,
    "isEmergencyPack": false,
    "packId": "normal",
    "packName": "Grand Prix Pack",
    "slots": {
        "1": {
            "forcedRarity": iCardRarity.COMMON,
            "rarityChances": {
                "COMMON": 0,
                "UNCOMMON": 0,
                "RARE": 0,
                "LEGENDARY": 0
            }
        },
        "2": {
            "forcedRarity": iCardRarity.COMMON,
            "rarityChances": {
                "COMMON": 0,
                "UNCOMMON": 0,
                "RARE": 0,
                "LEGENDARY": 0
            }
        },
        "3": {
            "forcedRarity": iCardRarity.UNCOMMON,
            "rarityChances": {
                "COMMON": 0,
                "UNCOMMON": 0,
                "RARE": 0,
                "LEGENDARY": 0
            }
        },
        "4": {
            "forcedRarity": iCardRarity.UNCOMMON,
            "rarityChances": {
                "COMMON": 0,
                "UNCOMMON": 0,
                "RARE": 0,
                "LEGENDARY": 0
            }
        },
        "5": {
            "forcedRarity": null,
            "rarityChances": {
                "COMMON": 50,
                "UNCOMMON": 50,
                "RARE": 0,
                "LEGENDARY": 0
            }
        },
        "6": {
            "forcedRarity": null,
            "rarityChances": {
                "COMMON": 0,
                "UNCOMMON": 0,
                "RARE": 70,
                "LEGENDARY": 30
            }
        }
    },
    "cardsIncluded": 6
}