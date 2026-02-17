import { CardType } from "~/types/card";

export function loadFallbackPackImage(e: Event) {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = '/img/pack.png';
}