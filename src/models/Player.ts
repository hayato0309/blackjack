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

    // 次にどのようなアクションをとるべきか返す
    promptPlayer(): GameDecision {
        let action = "";
        let amount = 0;
        if (this.type === "ai") {
        }
        return new GameDecision(action, amount);
    }

    // AIプレイヤーの次の手を判断
    aiPlayerNextAction(upCardRank: string): string {
        let nextAction = "";
        const handLength = this.hand.length; // 手札の枚数
        const handScore = this.getHandScore(); // 手札のスコア
        const upCardScore = this.rankToScore(upCardRank); // houseの一枚だけ表向きのカード

        if (handLength === 2) {
            // stand
            if (handScore >= 17) nextAction = "stand";
            if (handScore >= 13 && upCardScore <= 6) nextAction = "stand";
            if (handScore === 12 && upCardScore >= 3 && upCardScore <= 6) nextAction = "stand";
            // surrender
            if (handScore === 16 && upCardScore === 10) nextAction = "surrender";
            if (handScore === 15 && (upCardScore >= 9 || upCardRank === "A")) nextAction = "surrender";
            // double
            if (handScore === 11 && upCardRank !== "A") nextAction = "double";
            if (handScore === 10 && upCardScore >= 9) nextAction = "double";
            if (handScore === 9 && upCardScore >= 3 && upCardScore <= 6) nextAction = "double";

            // もしnextActionが空ストリングだったら、"hit"をアサイン
            if (nextAction === "") nextAction = "hit";
        } else if (handLength >= 3) {
            if (handScore < 17) nextAction = "hit";
            else nextAction = "stand";
        }

        return nextAction;
    }

    // AIプレイヤーがサレンダーする確率の計算（現状5％の確率でサレンダーする）
    aiPlayerSurrender(): boolean {
        let willSurrender = false;
        const randomNum = Math.floor(Math.random() * 2); // 0〜19の20個の整数のうちランダムで作成
        willSurrender = randomNum === 0;

        return willSurrender;
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

    // ランクをスコアに変換する（Aが渡された場合は例外としてエラーを返す）
    rankToScore(rank: string): number {
        let score = 0;
        const face = ["J", "Q", "K"];

        if (rank === "A") throw new Error("'A' cannot be converted to score(number) with rankToScore()!");
        else {
            if (face.includes(rank)) score = 10;
            else score = Number(rank);
        }

        return score;
    }
}