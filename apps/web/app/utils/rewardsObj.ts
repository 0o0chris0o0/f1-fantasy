import { iCardRarity, RewardType } from "@f1pick6/shared/types";
import type { iReward } from "@f1pick6/shared/types";

export const rewardObj: Record<string, iReward> = {
  "1": {
    rewardType: RewardType.COINS,
    key: 100,
  },
  "2": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.UNCOMMON,
  },
  "3": {
    rewardType: RewardType.COINS,
    key: 150,
  },
  "4": {
    rewardType: RewardType.PACK,
    key: "normal",
    rewardName: "Grand Prix",
  },
  "5": {
    rewardType: RewardType.COINS,
    key: 250,
  },
  "6": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.UNCOMMON,
  },
  "7": {
    rewardType: RewardType.COINS,
    key: 300,
  },
  "8": {
    rewardType: RewardType.PACK,
    key: "premium",
    rewardName: "Gold",
  },
  "9": {
    rewardType: RewardType.COINS,
    key: 350,
  },
  "10": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.RARE,
  },
  "11": {
    rewardType: RewardType.COINS,
    key: 400,
  },
  "12": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.RARE,
  },
  "13": {
    rewardType: RewardType.PACK,
    key: "premium",
    rewardName: "Gold",
  },
  "14": {
    rewardType: RewardType.COINS,
    key: 450,
  },
  "15": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.RARE,
  },
  "16": {
    rewardType: RewardType.COINS,
    key: 500,
  },
  "17": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.RARE,
  },
  "18": {
    rewardType: RewardType.PACK,
    key: "premium",
    rewardName: "Gold",
  },
  "19": {
    rewardType: RewardType.COINS,
    key: 500,
  },
  "20": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.RARE,
  },
  "21": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.LEGENDARY,
  },
  "22": {
    rewardType: RewardType.CARDS,
    key: iCardRarity.LEGENDARY,
  },
  "23": {
    rewardType: RewardType.PACK,
    key: "premium",
    rewardName: "collector",
  },
};
