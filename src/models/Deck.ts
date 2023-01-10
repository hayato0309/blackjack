export class Deck {
    private gameType: string;
    private cards: string[];

    constructor(gameType: string) {
        this.gameType = gameType;
        this.cards = [];

        this.createCards(gameType);
    }

    // setter
    public setCards(cards: string[]): void {
        this.cards = cards;
    }

    // getter
    public getCards(): string[] {
        return this.cards;
    }

    // Deckにカードを一枚追加する
    private addAnotherCardToDeck(newCard: string): void {
        let cards = this.getCards();
        cards.push(newCard);
        this.setCards(cards);
    }

    // ゲームの種類に応じてカードを作成する
    private createCards(gameType: string) {
        if (gameType === "blackjack") {
            const suit = ["H", "D", "C", "S"];
            const rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

            for (let s = 0; s < suit.length; s++) {
                for (let r = 0; r < rank.length; r++) {
                    this.addAnotherCardToDeck(suit[s] + rank[r]);
                }
            }
        }
    }

    // カードをシャッフルする（Fisher-Yetesアルゴリズム）
    public shuffle() {
        const n = this.getCards().length;
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = tmp;
        }
    }

    // カードを一枚引く
    public drawOne(): string {
        return String(this.cards.shift());
    }
}