export class CardView {
  static createCard(card) {
    const suit = card[0];
    const rank = card.slice(1);
    const redSuit = ["H", "D"];
    const color = redSuit.includes(suit) ? "text-red-500" : "";
    const suitSymbol = this.getSuitSymbol(suit);
    return `
            <div class="rounded shadow h-36 w-28 mx-1 bg-white relative flex justify-center items-center ${color}">
                <div class="w-4 text-center absolute top-1 left-1">
                    <div class="h-4 text-lg">${rank}</div>
                    <div class="h-4">${suitSymbol}</div>
                </div>
                <div class="text-2xl">${suitSymbol}</div>
                <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
                    <div class="h-4 text-lg">${rank}</div>
                    <div class="h-4">${suitSymbol}</div>
                </div>
            </div>
        `;
  }
  static createReversedCard() {
    return `
            <div class="rounded shadow h-36 w-28 mx-1 bg-zinc-800 border-4 border-zinc-400 flex justify-center items-center">
                <div class="text-3xl text-zinc-400">✪</div>
            </div>
        `;
  }
  static getSuitSymbol(suit) {
    let suitSymbol = "";
    switch (suit) {
      case "H":
        suitSymbol = "♥";
        break;
      case "D":
        suitSymbol = "♦︎";
        break;
      case "C":
        suitSymbol = "♣︎";
        break;
      case "S":
        suitSymbol = "♠︎";
        break;
    }
    return suitSymbol;
  }
}
