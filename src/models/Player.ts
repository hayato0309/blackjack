import { GameDecision } from './GameDecision';
import { INITIAL_CHIPS } from "../config/config";

export class Player {
    private name: string;
    private type: string;
    private gameType: string;
    private chips: number;
    private hand: string[];
    private playerStatus: string;
    private gameDecision: GameDecision;

    constructor(name: string, type: string, gameType: string, chips: number = INITIAL_CHIPS, playerStatus: string = "betting") {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.playerStatus = playerStatus; // betting, readyForActing, doneWithActing, bust, broke
        this.gameDecision = new GameDecision("", 0);
    }

    // setter
    public setChips(chips: number): void {
        this.chips = chips;
    }

    public setPlayerStatus(playerStatus: string): void {
        this.playerStatus = playerStatus;
    }

    public setGameDecision(gameDecision: GameDecision): void {
        this.gameDecision = gameDecision;
    }

    public setHand(hand: string[]): void {
        this.hand = hand;
    }

    // getter
    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }

    public getGameType(): string {
        return this.gameType;
    }

    public getChips(): number {
        return this.chips;
    }

    public getGameDecision(): GameDecision {
        return this.gameDecision;
    }

    public getHand(): string[] {
        return this.hand;
    }

    public getPlayerStatus(): string {
        return this.playerStatus;
    }

    // 手札を1枚追加する
    public addAnotherCardToHand(newCard: string): void {
        let hand = this.getHand();
        hand.push(newCard);
        this.setHand(hand);
    }

    // userの入力値に従ってgameDecisionを返す
    public userPlayerGameDecision(actionParam: string): void {
        const action: string = actionParam;
        const amount: number = this.getGameDecision().getAmount();

        this.setGameDecision(new GameDecision(action, amount));
    }

    // AIプレイヤーの次の手を判断
    public aiPlayerNextAction(upCardRank: string): string {
        let nextAction = "";
        const handLength: number = this.getHand().length; // 手札の枚数
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

    // プレイヤーがbustか判定
    public checkIfPlayerIsBust(): boolean {
        if (this.getHandScore() > 21) return true;
        else return false;
    }

    // プレイヤーがそのターンのacting phaseを終了しているか判定
    public checkIfPlayerDoneWithActingPhase(): boolean {
        if (["doneWithActing", "bust", "broke"].includes(this.getPlayerStatus())) return true;
        else return false;
    }

    // ランクをスコアに変換する（Aが渡された場合はAをそのまま文字列として返す）
    private rankToScore(rank: string): number | string {
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
    public aiPlayerDecideBetAmount(): number {
        if (this.getPlayerStatus() === "broke") return 0;

        let betAmount: number = 0;
        let budgetForOneRound = this.getChips() / 5; // 1ラウンドの掛け金上限
        betAmount = Math.floor((Math.random() * (budgetForOneRound / 5 - 5) + 5)) * 5;

        return betAmount;
    }

    // プレイヤーの手札にあるカードの値の合計を返す
    public getHandScore(): number {
        const hand = this.getHand();
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

        return sum;
    }
}