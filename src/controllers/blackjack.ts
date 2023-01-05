import { Deck } from './../models/Deck';
import { CONTAINER } from '../config/config';
import { Table } from '../models/Table';
import type { Player } from '../models/Player';
import { GameSettingPage } from '../views/blackjack/pages/gameSetting';
import { GameBoardPage } from '../views/blackjack/pages/gameBoard';
import { RoundResultModal } from '../views/blackjack/modals/roundResult';
import { GameResultModal } from '../views/blackjack/modals/gameResult';
import { GameDecision } from '../models/GameDecision';
import { sleep } from "../utils/sleep";
import type { RoundResultElement } from '../views/blackjack/modals/roundResult';

export class Controller {
    static displayGameSettingPage() {
        GameSettingPage.createGameSettingPage(new Table());
    }

    static startBlackjack(table: Table) {
        // gameSettingページでの入力値を取得
        const userName = (<HTMLInputElement>document.querySelector("#userName")).value;
        const gameType = (<HTMLSelectElement>document.querySelector("#gameType")).value;
        const computerPlayerSpeed = (<HTMLInputElement>document.querySelector("#computerPlayerSpeed")).value;

        // gameSettingページでの入力値を設定
        table.setGameType(gameType);
        table.setPlayers(userName);
        table.setComputerPlayerSpeed(computerPlayerSpeed);

        // deckを作成
        const deck = new Deck(table.getGameType());
        deck.shuffle();
        table.setDeck(deck);

        // 手札2枚ずつを配る
        table.blackjackAssignPlayerHands();
        // GameBoardページのUI作成
        GameBoardPage.createGameBoardPage(table);
    }

    static bettingPhase(table: Table) {
        table.players.map((player) => {
            if (player.type === "house") {
                // houseは賭ける必要が無いので何もしない
            } else if (player.type === "ai") {
                player.setGameDecision(new GameDecision("bet", player.aiPlayerDecideBetAmount()));
                player.setChips(player.getChips() - player.gameDecision.amount);
            } else if (player.type === "user") {
                const userBetAmount = Number((<HTMLInputElement>document.querySelector("#betAmountInput")).value);
                player.setGameDecision(new GameDecision("bet", userBetAmount));
                player.setChips(player.getChips() - player.gameDecision.amount);
            }
        });

        this.setActingPhase(table);
    }

    // acting phaseの準備
    static setActingPhase(table: Table) {
        // 各プレイヤーのActionをリセット
        const notHousePlayers = table.getPlayers().filter(player => player.getType() !== "house");
        notHousePlayers.map(player => {
            player.getGameDecision().setAction("");
        });

        table.setGamePhase("acting");
        this.actingPhase(table);
    }

    static async actingPhase(table: Table) {
        while (table.getGamePhase() === "acting") {
            table.increaseTurnCounter();
            let turnPlayer = table.getTurnPlayer();

            // ターン毎にViewを更新
            GameBoardPage.createGameBoardPage(table);

            // 全てのプレイヤーがactingを終了した後の、houseの処理
            if (table.checkIfAllPlayersDoneWithActing()) {
                await sleep(1500);

                // 全てのカードを表向きにする
                GameBoardPage.createGameBoardPage(table);

                const house = table.getPlayers()[0];
                // 手札のスコアが17以上になるまで引き続ける
                while (house.getHandScore() < 17) {
                    await sleep(1500);
                    house.getHand().push(table.getDeck().drawOne());
                    GameBoardPage.createGameBoardPage(table);
                }

                if (house.checkIfPlayerIsBust()) house.setPlayerStatus("bust");
                else house.setPlayerStatus("doneWithActing");

                table.setGamePhase("evaluatingWinner");

                await sleep(1500);
                this.displayRoundResultModal(table);
            }

            // 【ターンスキップ判定】
            // turnPlayerの手札が21より大きい場合、playerStatusを"bust"に変更
            if (turnPlayer.checkIfPlayerIsBust()) turnPlayer.setPlayerStatus("bust");
            // turnPlayerのplayerStatusが"doneWithActing"か"bust"か"broke"の場合スキップ
            if (turnPlayer.checkIfPlayerDoneWithActingPhase()) continue;

            if (turnPlayer.getType() === "house") {
                // 他のプレイヤーがactingを完了するまでハウスはカードを引かない（全てのプレイヤー（AI, User）がカードを引き終えたら、evaluatingWinner phaseで17以上になるまでカードを引く）
                // acting phaseでは、playerStatusを"doneWithActing"に変更するのみ

            } else if (turnPlayer.getType() === "ai") {
                const thinkingTime = table.calcAiThinkingTime();
                await sleep(thinkingTime);

                // gameDecisionを作成しプレイヤーに設定
                let aiPlayerGameDecision = turnPlayer.getGameDecision();
                aiPlayerGameDecision.setAction(turnPlayer.aiPlayerNextAction(table.getUpCardRank()));

                // gameDecisionの実行
                table.executeGameDecision(turnPlayer);

            } else if (turnPlayer.getType() === "user") {
                // userActionに移行し、一旦ループを止める
                this.userAction(table, turnPlayer);
                break;

            }
        }
    }

    static userAction(table: Table, turnPlayer: Player) {
        const nextActionButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".action-button"));
        nextActionButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const target = e.target as HTMLButtonElement;
                turnPlayer.userPlayerGameDecision(target.value);
                table.executeGameDecision(turnPlayer);

                // acting phaseのループに戻る
                this.actingPhase(table);
            })
        });
    }

    static displayRoundResultModal(table: Table) {
        const house = table.getPlayers()[0];
        const notHousePlayers = table.getPlayers().filter(player => player.getType() !== "house");

        // roundResultモーダルに表示するラウンドの結果（名前・勝敗・配当）
        let roundResult: RoundResultElement[] = [];
        notHousePlayers.map(player => {
            let winner: string = table.getWinner(house, player);
            let winOrLose: string = "";
            switch (winner) {
                case "player":
                    winOrLose = "WIN";
                    break;
                case "house":
                    winOrLose = "LOSE";
                    break;
                case "no one":
                    winOrLose = "DRAW";
                    break;
                default:
                    break;
            }
            let devidend: number = table.calcDevidend(house, player);

            // roundResultモーダルの表示内容配列に追加
            roundResult.push({ "name": player.getName(), "winOrLose": winOrLose, "devidend": devidend });

            // 配当を各プレイヤーのchipsに反映
            const currentChips = player.getChips();
            const newChips = currentChips + devidend;
            player.setChips(newChips);
        })

        // userプレイヤーの結果をtableのresultLogに追加
        const user = table.getPlayers()[2];
        let resultLog = table.getResultLog();
        resultLog.push({ hand: user.getHand(), winOrLose: roundResult[1]["winOrLose"], devidend: roundResult[1]["devidend"] });
        table.setResultLog(resultLog);

        // ラウンドの結果を表示するモーダルの表示
        CONTAINER.appendChild(RoundResultModal.createRoundResultModal(roundResult, table));
        // 次のラウンドをプレイするボタンのイベントを設定
        RoundResultModal.setPlayAnotherRoundButtonEvent(table);
        // ゲームのresultLogモーダルを表示するボタンのイベントを設定
        RoundResultModal.setDisplayGameResultModalEvent(table);

    }

    static playAnotherRound(table: Table) {
        // テーブルの初期化
        table.setGamePhase("betting");
        table.setTurnCounter(0);

        // デッキの初期化
        table.setDeck(new Deck(table.getGameType()));
        table.getDeck().shuffle();

        // プレイヤーの初期化（name, type, gameType, chipsは引き継ぐ）
        table.getPlayers().map(player => {
            player.setHand([]);
            player.setPlayerStatus("betting");
            player.setGameDecision(new GameDecision("", 0));
        })

        // 手札2枚ずつを配る
        table.blackjackAssignPlayerHands();
        // GameBoardページのUI作成
        GameBoardPage.createGameBoardPage(table);
    }

    static displayGameResultModal(table: Table) {
        CONTAINER.appendChild(GameResultModal.createGameResultModal(table.getResultLog()));
        GameResultModal.createResultLogTableRow(table.getResultLog());
        GameResultModal.setHomeButtonEvent();
        GameResultModal.setNewGameButtonEvent(table);
    }

    static goHome() {
        this.displayGameSettingPage();
    }

    static playNewGame(table: Table) {
        // テーブルの初期化
        table.setGamePhase("betting");
        table.setTurnCounter(0);
        table.setResultLog([]);

        // デッキの初期化
        table.setDeck(new Deck(table.getGameType()));
        table.getDeck().shuffle();

        // プレイヤーの初期化（name, type, gameTypeは引き継ぐ）
        table.getPlayers().map(player => {
            player.setHand([]);
            player.setChips(400);
            player.setPlayerStatus("betting");
            player.setGameDecision(new GameDecision("", 0));
        })

        // 手札2枚ずつを配る
        table.blackjackAssignPlayerHands();

        // GameBoardページのUI作成
        GameBoardPage.createGameBoardPage(table);
    }
}