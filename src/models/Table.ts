import { Deck } from "./Deck";
import { Player } from "./Player";
import { GameDecision } from "./GameDecision";

export class Table {
    gameType: string;
    betDenomination: number[];
    deck: Deck;
    players: Player[];
    gamePhase: string;
    resultLog: string[];
    turnCounter: number;

    constructor(gameType: string, betDenomination: number[]) {
        this.gameType = gameType; // e.g. blackjack
        this.betDenomination = betDenomination; // e.g. [5, 20, 50, 100]
        this.deck = new Deck(this.gameType);
        this.deck.shuffle();

        // プレイヤーの初期化（※一旦全員AIで実装）
        this.players = [];
        if (this.gameType === "blackjack") {
            // blackjackの場合一般のプレイヤーは3人（house: 1, player: 3）
            this.players.push(new Player('HOUSE', 'house', 'blackjack'));
            this.players.push(new Player('AI1', 'ai', 'blackjack'));
            this.players.push(new Player('AI2', 'ai', 'blackjack'));
            this.players.push(new Player('AI3', 'ai', 'blackjack'));
        }

        this.gamePhase = "betting"; // betting, acting, roundOver
        this.resultLog = []; // 各ラウンドの結果をログに記録するための文字列の配列
        this.turnCounter = 0;
    }

    // 別途終了後、各プレイヤーに2枚のカードを割り当てる
    blackjackAssignPlayerHands(): void {
        this.players.map((player) => {
            for (let i = 0; i < 2; i++) {
                player.hand.push(this.deck.drawOne());
            }
        });
    }

    // ラウンド開始時に手札と掛け金をリセットする
    blackjackClearPlayerHandsAndBets(): void {
        this.players.map((player) => {
            player.hand = [];
            player.gameDecision = <GameDecision>{};
        });
    }

    // 現在フォーカスしているプレイヤーを返す
    getTurnPlayer(): Player {
        this.turnCounter++;
        const playerIndex = this.turnCounter % this.players.length;

        return this.players[playerIndex];
    }

    // Userプレイヤーに次のアクションと掛け金の決定を促す
    promptNextUserActionAndBet(player: Player, actionParam: string, amountParam: number): void {
        player.userPlayerGameDecision(actionParam, amountParam);
    }

    // AIプレイヤーに次のアクションと掛け金の決定を促す
    promptNextAiActionAndBet(player: Player, upCardRank: string, turnCounter: number): void {
        player.aiPlayerGameDecision(upCardRank, turnCounter);
    }

    // gameDecisionに応じてプレイヤーの手札・playerStatus・チップを更新する
    // 全てのプレイヤーのplayerStatusがroundOverになるまで繰り返し実行される
    executeGameDecision(player: Player): void {
        if (player.gameDecision.action === "stand") {
            // 掛け金をchipsから引き、ラウンドを終了する
            player.chips -= player.gameDecision.amount;
            player.playerStatus = "readyForActing";
        } else if (player.gameDecision.action === "hit") {
            // 掛け金をchipsから引き、もう一枚カードを引く
            player.chips -= player.gameDecision.amount;
            player.hand.push(this.deck.drawOne());
        } else if (player.gameDecision.action === "double") {
            // 掛け金の2倍をchipsから引き、もう一枚カードを引く
            player.chips -= (player.gameDecision.amount * 2);
            player.hand.push(this.deck.drawOne());
        } else if (player.gameDecision.action === "surrender") {
            // 掛け金の半分をchipsから引き、ラウンドを終了する
            player.chips -= (player.gameDecision.amount / 2);
            player.playerStatus = "readyForActing";
        }
    }

    // プレイヤーがbustか判定
    checkIfPlayerIsBust(player: Player): void {
        if (player.getHandScore() > 21) player.playerStatus = "bust";
    }

    // 全てのプレイヤーがbettingを終了しているか判定
    checkIfReadyForActing(): void {
        let doneBettingCounter = 0;
        this.players.map((player) => {
            if (player.playerStatus !== "betting") doneBettingCounter++;
        });

        if (doneBettingCounter === 4) this.gamePhase = "acting";
    }
}