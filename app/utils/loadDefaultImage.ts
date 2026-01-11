export default function loadDefaultImage(e: Event, cardType: string) {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = `/img/${cardType}-black.svg`;
  imgElement.classList.add("broken-img");
};

export function loadFallbackPackImage(e: Event) {
  const imgElement = e.target as HTMLImageElement;
  imgElement.src = '/img/pack.png';
}