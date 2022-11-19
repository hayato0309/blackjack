export class Deck {
    gameType: string;
    cards: string[];

    constructor(gameType: string) {
        this.gameType = gameType;
        this.cards = [];

        this.createCards(gameType);
    }

    // ゲームの種類に応じてカードを作成する
    createCards(gameType: string) {
        if (gameType === "blackjack") {
            const suit = ["H", "D", "C", "S"];
            const rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

            for (let s = 0; s < suit.length; s++) {
                for (let r = 0; r < rank.length; r++) {
                    this.cards.push(suit[s] + rank[r]);
                }
            }
        }
    }

    // カードをシャッフルする（Fisher-Yetesアルゴリズム）
    shuffle() {
        const n = this.cards.length;
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = tmp;
        }
    }

    // デッキをリセットする
    resetDeck(gameType: string) {
        this.createCards(gameType);
    }

    // カードを一枚引く
    drawOne(): string {
        return String(this.cards.shift());
    }
}