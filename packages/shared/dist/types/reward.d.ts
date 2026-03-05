import type { iCardRarity } from "./card.ts";
export declare enum RewardType {
    COINS = 0,
    CARDS = 1,
    PACK = 2
}
export interface iReward {
    rewardType: RewardType;
    key: string | number | iCardRarity;
    rewardName?: string;
}
