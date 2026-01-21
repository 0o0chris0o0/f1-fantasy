export default function loadDefaultImage(e: Event, rarity: string = 'common') {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = `/img/drivers/generic-${rarity}.png`;
  imgElement.classList.add("broken-img");
};

export function loadFallbackPackImage(e: Event) {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = '/img/pack.png';
}