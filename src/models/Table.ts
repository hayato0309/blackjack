import { Deck } from "./Deck";
import { Player } from "./Player";
import type { GameDecision } from "./GameDecision";

export interface GameResultElement {
    hand: string[],
    winOrLose: string,
    devidend: number
}

export class Table {
    gameType: string;
    deck: Deck;
    players: Player[];
    gamePhase: string;
    resultLog: GameResultElement[];
    turnCounter: number;
    computerPlayerSpeed: string;

    constructor() {
        this.gameType = ""; // e.g. blackjack
        this.deck = new Deck(this.gameType);
        this.deck.shuffle();
        this.players = [];
        this.gamePhase = "betting"; // betting, acting, evaluatingWinner, roundOver
        this.resultLog = []; // 各ラウンドの結果をログに記録するための文字列の配列
        this.turnCounter = 0;
        this.computerPlayerSpeed = "";
    }

    // setter
    setGameType(gameType: string): void {
        this.gameType = gameType;
    }

    setPlayers(userName: string): void {
        let players: Player[] = [];

        if (this.gameType === "blackjack") {
            // blackjackの場合一般のプレイヤーは3人（house: 1, player(aiとuser): 3）
            players.push(new Player('HOUSE', 'house', 'blackjack'));
            players.push(new Player('Ninja🥷', 'ai', 'blackjack'));
            players.push(new Player(userName, 'user', 'blackjack'));
            players.push(new Player('Max🐶', 'ai', 'blackjack'));
        }

        this.players = players;
    }

    setComputerPlayerSpeed(computerPlayerSpeed: string): void {
        this.computerPlayerSpeed = computerPlayerSpeed;
    }

    setDeck(deck: Deck): void {
        this.deck = deck;
    }

    setGamePhase(gamePhase: string): void {
        this.gamePhase = gamePhase;
    }

    setTurnCounter(turnCounter: number): void {
        this.turnCounter = turnCounter;
    }

    setResultLog(resultLog: GameResultElement[]): void {
        this.resultLog = resultLog;
    }

    // getter
    getGameType(): string {
        return this.gameType;
    }

    getGamePhase(): string {
        return this.gamePhase;
    }

    getComputerPlayerSpeed(): string {
        return this.computerPlayerSpeed;
    }

    getTurnCounter(): number {
        return this.turnCounter;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getDeck(): Deck {
        return this.deck;
    }

    getResultLog(): GameResultElement[] {
        return this.resultLog;
    }

    // 別途終了後、各プレイヤーに2枚のカードを割り当てる
    blackjackAssignPlayerHands(): void {
        this.players.map((player) => {
            for (let i = 0; i < 2; i++) {
                player.addAnotherCardToHand(this.deck.drawOne());
            }
        });
    }

    // ラウンド開始時に手札と掛け金をリセットする
    blackjackClearPlayerHandsAndBets(): void {
        this.players.map((player) => {
            player.setHand([]);
            player.setGameDecision(<GameDecision>{});
        });
    }

    // ターンを1つ進める
    increaseTurnCounter(): void {
        let turnCounter = this.getTurnCounter();
        turnCounter++;
        this.setTurnCounter(turnCounter);
    }

    // 現在フォーカスしているプレイヤーを返す
    getTurnPlayer(): Player {
        const players = this.getPlayers();
        const playerIndex = this.getTurnCounter() % players.length;

        return players[playerIndex];
    }

    // houseの表向きになっているカードのrankを返す
    getUpCardRank(): string {
        return this.getPlayers()[0].getHand()[0].slice(1);
    }

    // gameDecisionに応じてプレイヤーの手札・playerStatus・チップを更新する
    // 全てのプレイヤーのplayerStatusがroundOverになるまで繰り返し実行される
    executeGameDecision(player: Player): void {
        const nextAction = player.getGameDecision().getAction();
        switch (nextAction) {
            case "blackjack":
            case "stand":
            case "surrender":
                // acting phaseを終了する
                player.setPlayerStatus("doneWithActing");
                break;
            case "hit":
                // もう一枚カードを引く
                player.addAnotherCardToHand(this.deck.drawOne());
                break;
            case "double":
                // 掛け金をもう一度chipsから引き（betting phaseと合わせてbet*2引かれる）、もう一枚カードを引く
                // ダブルを宣言すると1枚しかカードを追加できないので、そのままacting phaseを終了する
                this.updatePlayerChips(player, (-1) * player.getGameDecision().getAmount());
                player.addAnotherCardToHand(this.deck.drawOne());
                player.setPlayerStatus("doneWithActing");
                break;
            default:
                break;
        }
    }

    // 全てのプレイヤーがactingを終了しているか判定
    checkIfAllPlayersDoneWithActing(): boolean {
        let doneActingCounter: number = 0;
        this.getPlayers().map((player) => {
            if (player.checkIfPlayerDoneWithActingPhase()) doneActingCounter++;
        });

        return doneActingCounter === 3;
    }

    // 勝敗判定
    getWinner(house: Player, player: Player): string {
        let winner: string = ""; // houseかplayer

        if (player.getPlayerStatus() === "surrender") winner = "house";

        if (house.getPlayerStatus() === "bust" || player.getPlayerStatus() === "bust") {
            // 少なくともhouseかplayerのどちらかがbustの場合
            if (house.getPlayerStatus() === "bust" && player.getPlayerStatus() === "bust") {
                winner = "house"; // houseとplayerの両方がbustの時はhouseが勝利する
            } else if (house.getPlayerStatus() === "bust") {
                winner = "player";
            } else if (player.getPlayerStatus() === "bust") {
                winner = "house";
            }
        } else {
            // houseもplayerもbustしてない場合
            const houseScore: number = house.getHandScore();
            const playerScore: number = player.getHandScore();

            if (houseScore === playerScore ||
                (house.getGameDecision().getAction() === "blackjack" && player.getGameDecision().getAction() === "blackjack") ||
                (house.getGameDecision().getAction() === "blackjack" && this.checkIfUserIsBlackjack(player))) {
                winner = "no one"; // 引き分け
            } else {
                winner = houseScore > playerScore ? "house" : "player";
            }
        }

        return winner;
    }

    // 勝敗判定に応じてchipsの増減額を計算（勝てば正の数、負ければ負の数を返す）
    calcDevidend(house: Player, player: Player): number {
        let devidend: number = 0;
        const winner = this.getWinner(house, player);

        if (winner === "no one") {
            // do nothing
        } else if (winner === "house") {
            if (player.getGameDecision().getAction() === "surrender") devidend = player.getGameDecision().getAmount() * 0.5; // surrenderした場合、掛け金の半分が返ってくる
        } else if (winner === "player") {
            if (player.getGameDecision().getAction() === "blackjack") devidend = player.getGameDecision().getAmount() * 2.5; // blackjackの場合の配当は2.5倍（AIプレイヤーの場合）
            else if (this.checkIfUserIsBlackjack(player)) devidend = player.getGameDecision().getAmount() * 2.5; // blackjackの場合の配当は2.5倍（Userプレイヤーの場合、Actionにblackjackがないので手札の枚数とスコアから判断）
            else if (player.getGameDecision().getAction() === "double") devidend = player.getGameDecision().getAmount() * 2 * 2; // doubleを宣言して勝った場合の配当は4倍
            else if (player.getGameDecision().getAction() === "surrender") devidend = player.getGameDecision().getAmount() * 0.5; // surrenderした場合、掛け金の半分が返ってくる
            else devidend = player.getGameDecision().getAmount() * 2;
        }

        return devidend;
    }

    checkIfUserIsBlackjack(player: Player): boolean {
        if (player.getType() === "user") {
            const handLength = player.getHand().length;
            const handScore = player.getHandScore();

            return handLength === 2 && handScore === 21;
        } else {
            return false;
        }
    }

    // 金額を受け取りプレイヤーのchipsを更新する
    updatePlayerChips(player: Player, amount: number): void {
        const currChips = player.getChips();
        const newChips = currChips + amount;
        player.setChips(newChips);
    }

    // AIプレイヤーの1ターンにかかる時間を計算（ミリ秒で返す）
    calcAiThinkingTime(): number {
        const computerPlayerSpeed = this.getComputerPlayerSpeed();

        let thinkingTime: number = 0;
        switch (computerPlayerSpeed) {
            case "fast":
                thinkingTime = Math.random() * (2000 - 1500) + 1500;
                break;
            case "middle":
                thinkingTime = Math.random() * (3000 - 2500) + 2500;
                break;
            case "slow":
                thinkingTime = Math.random() * (4000 - 3500) + 3500;
                break;
            default:
                thinkingTime = 1000;
                break;
        }

        return Math.floor(thinkingTime);
    }
}