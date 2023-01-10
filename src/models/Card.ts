export class Card {
    private suit: string;
    private rank: string;

    constructor(suit: string, rank: string) {
        this.suit = suit;
        this.rank = rank;
    }

    // getter
    public getRank(): string {
        return this.rank;
    }

    public getRankNumber() {
        const faces = ["J", "Q", "K"];

        if (faces.includes(this.getRank())) return 10;
        if (this.getRank() === "A") return 11;
        return parseInt(this.getRank());
    }
}