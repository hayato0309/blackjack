import { Deck } from "./Deck";
import { Player } from "./Player";

export class Table {
    gameType: string;
    betDenomination: number[];
    deck: object;
    players: object[];
    house: object;
    gamePhase: string;
    resultLog: string[];

    constructor(gameType: string, betDenomination: number[]) {
        this.gameType = gameType; // e.g. blackjack
        this.betDenomination = betDenomination; // e.g. [5, 20, 50, 100]
        this.deck = [];
        this.deck = new Deck(this.gameType);

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

    /**
     * Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新
     * 
     * @param player 
     * @return null
     */
    // evaluateMove(player: Player): void {
    //     // EX:
    //     // プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    //     const playerAction = player.promptPlayer();

    //     if (player.getHandScore() > 21) {

    //     } else {

    //     }
    // }

    // turnCounter(): number {

    // }
}