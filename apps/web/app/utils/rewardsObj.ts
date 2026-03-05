import { iCardRarity, RewardType } from "@f1pick6/shared"
import type { iReward } from "@f1pick6/shared"

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
    key: 'normal',
    rewardName: 'Grand Prix'
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
    key: 'premium',
    rewardName: 'Gold'
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
    key: 'collector',
    rewardName: 'Collector'
  },
  '10': {
    rewardType: RewardType.CARDS,
    key: iCardRarity.MYTHIC
  }
}
