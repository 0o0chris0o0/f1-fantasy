import type { iCardRarity } from "./card";

export enum RewardType {
  COINS,
  CARDS,
  PACK
}

export interface iReward {
  rewardType: RewardType,
  key: string | number | iCardRarity;
  rewardName?: string;
}