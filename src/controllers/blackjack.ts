import { CONTAINER } from '../config/config';
import type { Table } from '../models/Table';
import type { Player } from '../models/Player';
import { GameSettingPage } from '../views/blackjack/pages/gameSetting';
import { GameBoardPage } from '../views/blackjack/pages/gameBoard';
import { CardView } from '../views/card';
import { GameResultModal } from '../views/blackjack/modals/gameResult';
import { GameDecision } from '../models/GameDecision';

export class Controller {
    static displayGameSettingPage() {
        CONTAINER.innerHTML = GameSettingPage.createGameSettingPage();
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

        // 手札2枚ずつを配る
        table.blackjackAssignPlayerHands();
        // GameBoardページのUI作成
        GameBoardPage.createGameBoardPage(table);
        // カードのUI作成
        const cardContainers = Array.from(document.querySelectorAll(".card-container"));
        for (let i = 0; i < cardContainers.length; i++) {
            let cards: string = "";
            table.players[i].hand.map((card, index) => {
                // gamePhaseがbettingの時は全てのカードは伏せた状態
                if (table.gamePhase === "betting") cards += CardView.createReversedCard();
                // else {
                //     // bettingが終わるとhouseは1枚だけ表向き。その他playerは全てのカードが表向き
                //     if (i === 0 && index !== 0) cards += CardView.createReversedCard();
                //     else cards += CardView.createCard(card);
                // }
            });

            cardContainers[i].innerHTML = cards;
        }
    }

    static bettingPhase(table: Table) {
        table.players.map((player) => {
            if (player.type === "house") {
                // houseは賭ける必要が無いので何もしない
            } else if (player.type === "ai") {
                player.setGameDecision(new GameDecision("bet", player.aiPlayerDecideBetAmount()));
                // chipsから引く処理が必要
                player.setChips(player.getChips() - player.gameDecision.amount);
            } else if (player.type === "user") {
                const userBetAmount = Number((<HTMLInputElement>document.querySelector("#betAmountInput")).value);
                player.setGameDecision(new GameDecision("bet", userBetAmount));
                // chipsから引く処理が必要
                player.setChips(player.getChips() - player.gameDecision.amount);
            }
        });
    }

    static displayGameResultModal() {
        // this.CONTAINER.appendChild(GameResultModal.createGameResultModal());
    }
}