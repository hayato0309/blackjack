import { GameDecision } from './GameDecision';

export class Player {
    name: string;
    type: string;
    gameType: string;
    chips: number;
    hand: string[];
    playerStatus: string;
    gameDecision: GameDecision;

    constructor(name: string, type: string, gameType: string, chips: number = 400, playerStatus: string = "betting") {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.playerStatus = playerStatus; // betting, readyForActing, bust, broke
        this.gameDecision = <GameDecision>{};
    }

    // getter
    public getChips(): number {
        return this.chips;
    }

    // setter
    public setChips(chips: number): void {
        this.chips = chips;
    }

    public setPlayerStatus(playerStatus: string): void {
        this.playerStatus = playerStatus;
    }

    // userの入力値に従ってgameDecisionを返す
    userPlayerGameDecision(actionParam: string, amountParam: number): void {
        const action: string = actionParam;
        const amount: number = amountParam;

        this.gameDecision = new GameDecision(action, amount);
    }

    // AIプレイヤーのgameDecisionを返す
    aiPlayerGameDecision(upCardRank: string, turnCounter: number): void {
        let action: string;
        let amount: number;

        action = this.aiPlayerNextAction(upCardRank);

        // 2周目以降（turnCouner > 4）の場合はすでに設定している
        if (turnCounter > 4) {
            amount = this.gameDecision.amount;
        } else {
            if (action === "double") {
                amount = this.aiPlayerDecideBetAmount() * 2;
            } else if (action === "surrender") {
                amount = this.aiPlayerDecideBetAmount() / 2;
            } else {
                amount = this.aiPlayerDecideBetAmount();
            }
        }

        this.gameDecision = new GameDecision(action, amount);
    }

    // AIプレイヤーの次の手を判断
    aiPlayerNextAction(upCardRank: string): string {
        let nextAction = "";
        const handLength: number = this.hand.length; // 手札の枚数
        const handScore: number = this.getHandScore(); // 手札のスコア
        const upCardScore: number | string = this.rankToScore(upCardRank); // houseの一枚だけ表向きのカードのスコア（Aの場合はAをstringとして持つ。A以外の場合はnumber）

        if (handLength === 2) {
            if (handScore === 21) {
                nextAction = "blackjack";
            } else {
                if (upCardScore === "A") {
                    // stand
                    if (handScore === 17) nextAction = "stand";
                    // surrender
                    if (handScore === 16) nextAction = "surrender";

                    // もしnextActionが空ストリングだったら、"hit"をアサイン
                    if (nextAction === "") nextAction = "hit";
                } else {
                    // stand
                    if (handScore >= 17) nextAction = "stand";
                    if (handScore >= 13 && handScore <= 16 && upCardScore <= 6) nextAction = "stand";
                    if (handScore === 12 && upCardScore >= 3 && upCardScore <= 6) nextAction = "stand";
                    // surrender
                    if (handScore === 16 && upCardScore === 10) nextAction = "surrender";
                    if (handScore === 15 && upCardScore >= 9) nextAction = "surrender";
                    // double
                    if (handScore === 11) nextAction = "double";
                    if (handScore === 10 && upCardScore >= 9) nextAction = "double";
                    if (handScore === 9 && upCardScore >= 3 && upCardScore <= 6) nextAction = "double";

                    // もしnextActionが空ストリングだったら、"hit"をアサイン
                    if (nextAction === "") nextAction = "hit";
                }
            }
        }

        if (handLength >= 3) {
            if (handScore < 17) nextAction = "hit";
            else nextAction = "stand";
        }

        return nextAction;
    }

    // ランクをスコアに変換する（Aが渡された場合はAをそのまま文字列として返す）
    rankToScore(rank: string): number | string {
        let score = 0;
        const face = ["J", "Q", "K"];

        if (rank === "A") return "A";
        else {
            if (face.includes(rank)) score = 10;
            else score = Number(rank);
        }

        return score;
    }

    // AIプレイヤーの掛け金を決める（5の倍数）
    aiPlayerDecideBetAmount(): number {
        if (this.playerStatus === "broke") return 0;

        let betAmount: number = 0;
        let budgetForOneRound = this.chips / 5; // 1ラウンドの掛け金上限
        betAmount = Math.floor((Math.random() * (budgetForOneRound / 5 - 5) + 5)) * 5;

        return betAmount;
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
            const rank = hand[i].slice(1);
            if (rank === "A") {
                sum += 11;
                aCounter++;
                continue;
            };
            if (face.includes(rank)) sum += 10;
            else sum += Number(rank);
        }

        // 合計が21を超える場合、21以下になるまでAの枚数を上限として10を引き続ける
        while (sum > 21 && aCounter > 0) {
            sum -= 10;
            aCounter -= 1;
        }

        console.log(sum);
        return sum;
    }
}