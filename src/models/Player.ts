import { GameDecision } from './GameDecision';

export class Player {
    name: string;
    type: string;
    gameType: string;
    chips: number;
    hand: string[];
    gameStatus: string;

    constructor(name: string, type: string, gameType: string, chips: number = 400, gameStatus: string = "betting") {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.gameStatus = gameStatus; // "betting", "bet", "surrender", "stand", "hit", "double", "blackjack", "bust", "broke"
    }

    // Userのデータを受け取り、次にどのようなアクションをとるべきか判断
    promptPlayer(userData?: number): GameDecision {

        return new GameDecision(action, amount);
    }

    // AIプレイヤーが次の手を判断する処理
    AiPlayerNextAction(player: Player) {

    }

    // 各ラウンド終了時の勝ち負けの金額を計算
    winAmount(): number {
        return 123;
    }

    // プレイヤーの手札にあるカードの値の合計を返す
    getHandScore(): number {
        const hand = this.hand;
        const face = ["J", "Q", "K"];
        let sum = 0;
        let aCounter = 0; // 手札にあるAの枚数をカウント
        for (let i = 0; i < hand.length; i++) {
            if (hand[i][1] == "A") {
                sum += 11;
                aCounter++;
                continue;
            };
            if (face.includes(hand[i][1])) sum += 10;
            else sum += Number(hand[i][1]);
        }

        // 合計が21を超える場合、21以下になるまでAの枚数を上限として10を引き続ける
        while (sum > 21 && aCounter > 0) {
            sum -= 10;
            aCounter -= 1;
        }

        return sum;
    }
}