export var CardType;
(function (CardType) {
    CardType["DRIVER"] = "driver";
    CardType["CONSTRUCTOR"] = "constructor";
})(CardType || (CardType = {}));
export var iCardRarity;
(function (iCardRarity) {
    iCardRarity["COMMON"] = "COMMON";
    iCardRarity["UNCOMMON"] = "UNCOMMON";
    iCardRarity["RARE"] = "RARE";
    iCardRarity["LEGENDARY"] = "LEGENDARY";
    iCardRarity["MYTHIC"] = "MYTHIC";
})(iCardRarity || (iCardRarity = {}));
// export interface iCardWithQuantity extends iCard {
//   quantity: number;
//   tyres: number;
// }
// export interface iCardWithIsNew extends iCard {
//   isNew: boolean;
// }
// export interface iCardWithCollected extends iCardWithQuantity {
//   collectedOn: false | Timestamp;
// }
// export interface iCollectionGroup {
//   teamId: string;
//   teamName: string;
//   car: iCardWithCollected;
//   teamPrinciple: iCardWithCollected[];
//   drivers: iCardWithCollected[];
//   cardsCollected: number;
//   totalCards: number;
// }
//# sourceMappingURL=card.js.map