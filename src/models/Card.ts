export class Card {
    suit: string;
    rank: string;

    constructor(suit: string, rank: string) {
        this.suit = suit;
        this.rank = rank;
    }

    // getter
    getRank(): string {
        return this.rank;
    }

    getRankNumber() {
        const faces = ["J", "Q", "K"];

        if (faces.includes(this.getRank())) return 10;
        if (this.getRank() === "A") return 11;
        return parseInt(this.getRank());
    }
}