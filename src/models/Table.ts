import { Deck } from "./Deck";
import { Player } from "./Player";

export class Table {
    gameType: string;
    betDenomination: number[];
    deck: Deck;
    players: Player[];
    house: object;
    gamePhase: string;
    resultLog: string[];

    constructor(gameType: string, betDenomination: number[]) {
        this.gameType = gameType; // e.g. blackjack
        this.betDenomination = betDenomination; // e.g. [5, 20, 50, 100]
        this.deck = new Deck(this.gameType);
        this.deck.shuffle();

        // プレイヤーの初期化（※一旦全員AIで実装）
        this.players = [];
        if (this.gameType === "blackjack") {
            // blackjackの場合一般のプレイヤーは3人（house: 1, player: 3）
            this.players.push(new Player('AI1', 'ai', 'blackjack'));
            this.players.push(new Player('AI2', 'ai', 'blackjack'));
            this.players.push(new Player('AI3', 'ai', 'blackjack'));
        }

        this.house = new Player('HOUSE', 'house', 'blackjack');
        this.gamePhase = "betting";

        // 各ラウンドの結果をログに記録するための文字列の配列
        this.resultLog = [];
    }

    // 別途終了後、各プレイヤーに2枚のカードを割り当てる
    blackjackAssignPlayerHands(): void {
        this.players.map((player) => {
            for (let i = 0; i < 2; i++) {
                player.hand.push(this.deck.drawOne());
                console.log(player.hand);
            }
        });
    }
}