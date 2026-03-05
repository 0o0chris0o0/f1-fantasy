import { CardType } from "@f1pick6/shared";

export function loadFallbackPackImage(e: Event) {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = '/img/pack.png';
}