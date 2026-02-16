import { iCardRarity } from "~/types/card"
import { RewardType, type iReward } from "~/types/reward"

export const rewardObj: Record<string, iReward> = {
  '1': {
    rewardType: RewardType.COINS,
    key: 100
  },
  '2': {
    rewardType: RewardType.CARDS,
    key: iCardRarity.UNCOMMON
  },
  '3': {
    rewardType: RewardType.PACK,
    key: 'normal'
  },
  '4': {
    rewardType: RewardType.COINS,
    key: 500
  },
  '5': {
    rewardType: RewardType.CARDS,
    key: iCardRarity.RARE
  },
  '6': {
    rewardType: RewardType.PACK,
    key: 'gold'
  },
  '7': {
    rewardType: RewardType.COINS,
    key: 750
  },
  '8': {
    rewardType: RewardType.CARDS,
    key: iCardRarity.LEGENDARY
  },
  '9': {
    rewardType: RewardType.PACK,
    key: 'collector'
  },
  '10': {
    rewardType: RewardType.CARDS,
    key: iCardRarity.MYTHIC
  }
}
