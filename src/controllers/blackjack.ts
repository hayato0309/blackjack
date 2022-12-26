import { Deck } from './../models/Deck';
import { CONTAINER } from '../config/config';
import type { Table } from '../models/Table';
import type { Player } from '../models/Player';
import { GameSettingPage } from '../views/blackjack/pages/gameSetting';
import { GameBoardPage } from '../views/blackjack/pages/gameBoard';
import { CardView } from '../views/card';
import { GameResultModal } from '../views/blackjack/modals/gameResult';
import { GameDecision } from '../models/GameDecision';
import { sleep } from "../utils/sleep";

export class Controller {
    static displayGameSettingPage(table: Table) {
        GameSettingPage.createGameSettingPage(table);
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
        const notHousePlayer = table.getPlayers().filter(player => player.getType() !== "house");
        notHousePlayer.map(player => {
            player.getGameDecision().setAction("");
        });

        table.setGamePhase("acting");
        GameBoardPage.createGameBoardPage(table);
        this.actingPhase(table);
    }

    static async actingPhase(table: Table) {
        while (table.getGamePhase() === "acting") {
            let turnPlayer = table.getTurnPlayer();

            // 全てのプレイヤーがactingを終了していれば、houseがカードを引き、game phaseを"evaluatingWinner"に変更
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

                // houseのStatusを"doneWithActing"に設定してacting phaseを終了
                house.setPlayerStatus("doneWithActing");
                table.setGamePhase("evaluatingWinner");
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
                // const aiPlayerGameDecision = turnPlayer.aiPlayerGameDecision(table.getUpCardRank(), table.getTurnCounter());
                let aiPlayerGameDecision = turnPlayer.getGameDecision();
                aiPlayerGameDecision.setAction(turnPlayer.aiPlayerNextAction(table.getUpCardRank()));

                // gameDecisionの実行
                table.executeGameDecision(turnPlayer);

                // GameBoardページのViewを更新
                GameBoardPage.createGameBoardPage(table);

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

                GameBoardPage.createGameBoardPage(table);

                // acting phaseのループに戻る
                this.actingPhase(table);
            })
        });
    }

    static displayGameResultModal() {
        // this.CONTAINER.appendChild(GameResultModal.createGameResultModal());
    }
}