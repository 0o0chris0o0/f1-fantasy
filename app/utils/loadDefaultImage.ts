import { CardType } from "~/types/card";

export default function loadDefaultImage(e: Event, cardType: CardType, rarity: string = 'common') {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = `/img/${cardType === CardType.CONSTRUCTOR ? 'constructors' : 'drivers'}/generic-${rarity}.png`;
  imgElement.classList.add("broken-img");
};

export function loadFallbackPackImage(e: Event) {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = '/img/pack.png';
}