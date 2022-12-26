import { Deck } from "./Deck";
import { Player } from "./Player";
import type { GameDecision } from "./GameDecision";

export class Table {
    gameType: string;
    betDenomination: number[];
    deck: Deck;
    players: Player[];
    gamePhase: string;
    resultLog: string[];
    turnCounter: number;
    computerPlayerSpeed: string;

    constructor(gameType: string = "", userName: string = "", betDenomination: number[] = [], computerPlayerSpeed: string = "") {
        this.gameType = gameType; // e.g. blackjack
        this.betDenomination = betDenomination; // e.g. [1, 5, 20, 50, 100]
        this.deck = new Deck(this.gameType);
        this.deck.shuffle();
        this.players = [];
        this.gamePhase = "betting"; // betting, acting, evaluatingWinner, roundOver
        this.resultLog = []; // 各ラウンドの結果をログに記録するための文字列の配列
        this.turnCounter = 0;
        this.computerPlayerSpeed = computerPlayerSpeed;
    }

    // setter
    setGameType(gameType: string): void {
        this.gameType = gameType;
    }

    setPlayers(userName: string): void {
        this.players = [];
        if (this.gameType === "blackjack") {
            // blackjackの場合一般のプレイヤーは3人（house: 1, player: 3）
            this.players.push(new Player('HOUSE', 'house', 'blackjack'));
            this.players.push(new Player('Ninja🥷', 'ai', 'blackjack'));
            this.players.push(new Player(userName, 'user', 'blackjack'));
            this.players.push(new Player('Max🐶', 'ai', 'blackjack'));
        }
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

    // houseの表向きになっているカードのrankを返す
    getUpCardRank(): string {
        return this.players[0].getHand()[0].slice(1);
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
                player.hand.push(this.deck.drawOne());
                break;
            case "double":
                // 掛け金をもう一度chipsから引き（betting phaseと合わせてbet*2引かれる）、もう一枚カードを引く
                // ダブルを宣言すると1枚しかカードを追加できないので、そのままacting phaseを終了する
                this.updatePlayerChips(player, -player.getGameDecision().getAmount());
                player.hand.push(this.deck.drawOne());
                player.setPlayerStatus("doneWithActing");
                break;
            default:
                break;
        }
    }

    // 全てのプレイヤーがbettingを終了しているか判定
    // ！！！要リファクタリング！！！
    // !== "betting"ではなく、==="acting"に変える
    // gameSettingをactingに変更する責務は切り出す（あくまで確認だけにとどめる）
    checkIfAllPlayersReadyForActing(): void {
        let doneBettingCounter = 0;
        this.players.map((player) => {
            if (player.playerStatus !== "betting") doneBettingCounter++;
        });

        if (doneBettingCounter === 4) this.gamePhase = "acting";
    }

    // 全てのプレイヤーがactingを終了しているか判定
    checkIfAllPlayersDoneWithActing(): boolean {
        let doneActingCounter: number = 0;
        this.players.map((player) => {
            if (player.checkIfPlayerDoneWithActingPhase()) doneActingCounter++;
        });

        return doneActingCounter === 3;
    }

    // 勝敗判定
    getWinner(house: Player, player: Player): string {
        let winner: string = ""; // houseかplayer

        if (player.playerStatus === "surrender") winner = "house";

        if (house.playerStatus === "bust" || player.playerStatus === "bust") {
            // 少なくともhouseかplayerのどちらかがbustの場合
            if (house.playerStatus === "bust") {
                winner = "player";
            } else if (player.playerStatus === "bust") {
                winner = "house";
            } else if (house.playerStatus === "bust" && player.playerStatus === "bust") {
                winner = "house"; // houseとplayerの両方がbustの時はhouseが勝利する
            }
        } else {
            // houseもplayerもbustしてない場合
            const houseScore: number = house.getHandScore();
            const playerScore: number = player.getHandScore();

            if (houseScore === playerScore ||
                (house.gameDecision.action === "blackjack" && player.gameDecision.action === "blackjack")) winner = "no one"; // 引き分け
            else winner = houseScore > playerScore ? "house" : "player";
        }

        return winner;
    }

    // 勝敗判定に応じてchipsの増減額を計算（勝てば正の数、負ければ負の数を返す）
    calcDevidend(house: Player, player: Player) {
        let houseDevidend: number = 0;
        let playerDevidend: number = 0;

        const winner = this.getWinner(house, player);

        if (winner === "no one") {
            // do nothing
        } else if (winner === "house") {
            if (house.gameDecision.action === "blackjack") {
                houseDevidend = house.gameDecision.amount * 2.5;
            } else {
                houseDevidend = house.gameDecision.amount * 2;
            }
        } else if (winner === "player") {
            if (player.gameDecision.action === "blackjack") {
                playerDevidend = player.gameDecision.amount * 2.5; // blackjackの場合の配当は2.5倍
            } else if (player.gameDecision.action === "double") {
                playerDevidend = player.gameDecision.amount * 2 * 2; // ダブルを宣言して勝った場合の配当は4倍
            } else {
                playerDevidend = player.gameDecision.amount * 2;
            }
        }

        return { house: houseDevidend, player: playerDevidend };
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