export class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
  getRankNumber() {
    const faces = ["J", "Q", "K"];
    if (faces.includes(this.rank))
      return 10;
    if (this.rank === "A")
      return 11;
    return parseInt(this.rank);
  }
}
