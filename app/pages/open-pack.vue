<template>
  <div class="pt-24 overflow-visible open-pack-container">
    <div class="absolute left-0 w-full -translate-y-20 checked-line" />
    <Loader v-if="isLoading" />
    <div :class="[
      'grid grid-cols-2 gap-x-2 md:gap-x-8 gap-y-20 card-grid', 
      loot.length % 2 === 0 && 'pb-40'
    ]">
      <div v-for="(card, i) in loot" class="relative px-3 pt-2 card">
        <div class="relative">
          <button class="block w-full">
            <UserCard :card="card.cardData" :rarity="card.rarity" :level="card.level" :quantity="card.quantity" />
          </button>
          <div v-if="!revealStatus[i]" class="absolute inset-0 z-10">
            <div class="relative top-0 h-full grid grid-flow-col gap-6">
              <button
                :key="i"
                class="bg-gray-200 rounded-md transition-opacity ease-in-out duration-300 bg-cover bg-center card-cover"
                :class="[
                  {
                    'opacity-0': revealStatus[i],
                  },
                  `cover-shadow-${enumToText(iCardRarity, card.rarity)}`,
                ]"
                @click="revealCard(i)"
              >
                <div class="absolute rounded-md inset-0 grid items-center pointer-events-none text-white reveal-text">
                  Click to reveal
                </div>
              </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Timestamp } from 'firebase/firestore';
  import type { iCardInUsersCards } from '~/types/card';
  import { CardType, iCardRarity } from '~/types/card';

  definePageMeta({
    middleware: "auth",
  });

  const route = useRoute();

  const packId = route.query.packId as string;
  const isLoading = ref(true);
  const loot = ref<iCardInUsersCards[]>([]);
  const revealStatus = ref<Record<string, boolean>>({});

  loot.value = [
    {
        "cardData": {
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
        "quantity": 1,
        "rarity": iCardRarity.COMMON,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        "quantity": 2,
        "rarity": iCardRarity.COMMON,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        },
        "quantity": 3,
        "rarity": iCardRarity.COMMON,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        },
        "quantity": 1,
        "rarity": iCardRarity.COMMON,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        "quantity": 1,
        "rarity": iCardRarity.UNCOMMON,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
            "homeRaces": [],
            "cardId": "bottas",
            "cardName": "Valtteri Bottas",
            "enabled": true,
            "teamId": "",
            "teamName": "",
            "type": CardType.DRIVER,
            "nationality": "Finland",
            "nationalityCode": "FI",
            "homeRaceLocationId": null,
            "stats": {
                "currentFantasyPoints": 0,
                "averageQualifyingPosition": 0,
                "averageRacePosition": 0,
                "numberOfDNFs": 0
            }
        },
        "quantity": 2,
        "rarity": iCardRarity.UNCOMMON,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
            "cardId": "bortoleto",
            "cardName": "Gabriel Bortoleto",
            "enabled": true,
            "teamId": "sauber",
            "teamName": "Sauber",
            "type": CardType.DRIVER,
            "nationality": "Brazil",
            "nationalityCode": "BR",
            "homeRaceLocationId": "brazil",
            "homeRaces": [
                {
                    "raceName": "São Paulo Grand Prix",
                    "round": 21,
                    "raceStart": Timestamp.fromDate(new Date('2026-12-01')),
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
        "quantity": 2,
        "rarity": iCardRarity.UNCOMMON,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        "quantity": 1,
        "rarity": iCardRarity.RARE,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
            "homeRaces": [],
            "cardId": "perez",
            "cardName": "Sergio Pérez",
            "enabled": true,
            "teamId": "",
            "teamName": "",
            "type": CardType.DRIVER,
            "nationality": "Mexico",
            "nationalityCode": "MX",
            "homeRaceLocationId": null,
            "stats": {
                "currentFantasyPoints": 0,
                "averageQualifyingPosition": 0,
                "averageRacePosition": 0,
                "numberOfDNFs": 0
            }
        },
        "quantity": 2,
        "rarity": iCardRarity.RARE,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        "quantity": 2,
        "rarity": iCardRarity.RARE,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        "quantity": 1,
        "rarity": iCardRarity.LEGENDARY,
        "level": 1,
        "xp": 0
    },
    {
        "cardData": {
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
        },
        "quantity": 1,
        "rarity": iCardRarity.LEGENDARY,
        "level": 1,
        "xp": 0
    }
  ]

  onMounted(async () => {
    try {
      // loot.value = await openPack(packId);
    } catch (error) {
      navigateTo('/packs');
    } finally {
      isLoading.value = false;
    }
  })

  const revealCard = (cardId: number) => {
    revealStatus.value[cardId] = !revealStatus.value[cardId];
  };
</script>

<style lang="scss" scoped>
.checked-line {
  background: url('/img/line-text.png');
  background-size: auto 102%;
  background-repeat: repeat;
  height: 50px;
  border-top: 5px solid white;
  border-bottom: 5px solid white;
}

.card-grid .card:nth-child(even) {
  @apply translate-y-40;
}

.card {
  border-top: 5px solid white;
} 

.card:before,
.card:after {
  content: '';
  width: 5px;
  background: white;
  height: 30px;
  position: absolute;
  top: 0;
}

.card:before {
  left: 0;
}

.card:after {
  right: 0;
}

.card-cover {
  width: 104%;
  height: 104%;
  transform: translate(-2%, -2%);
  background-image: url('/img/card-back.jpg');
}

.cover-shadow-uncommon {
  box-shadow: 0 0 15px rgba(4, 101, 109, 0.7);
}

.cover-shadow-rare {
  box-shadow: 0 0 15px rgba(146, 59, 168, 0.4)
}

.cover-shadow-legendary {
  box-shadow: 0 0 15px rgba(184, 134, 11, 0.4);
}

@keyframes fadeInOut {
  15% {
    opacity: 0%;
  }

  50% {
    opacity: 100%;
  }

  85% {
    opacity: 0%;
  }
}

.reveal-text {
  opacity: 0;
  background: rgba(25,25,25,0.8);
  animation-name: fadeInOut;
  animation-duration: 2.2s;
  animation-delay: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
