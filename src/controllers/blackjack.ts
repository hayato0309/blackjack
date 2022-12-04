import { Table } from '../models/Table';
import type { Player } from '../models/Player';
import { GameSettingPage } from '../views/blackjack/pages/gameSetting';
import { GameBoardPage } from '../views/blackjack/pages/gameBoard';
import { CardView } from '../views/card';
import { GameResultModal } from '../views/blackjack/modals/gameResult';

export class Controller {
    static CONTAINER = document.querySelector("#container")!;

    static displayGameSettingPage() {
        this.CONTAINER.innerHTML = GameSettingPage.createGameSettingPage();
    }

    static startBlackjack() {
        // gameSettingページでの入力値を取得
        const userName = (<HTMLInputElement>document.querySelector("#userName")).value;
        const gameType = (<HTMLSelectElement>document.querySelector("#gameType")).value;
        const computerPlayerSpeed = (<HTMLInputElement>document.querySelector("#computerPlayerSpeed")).value;

        // Tableインスタンス作成
        const table = new Table(gameType, userName, [1, 5, 20, 50, 100], computerPlayerSpeed);
        // 手札2枚ずつを配る
        table.blackjackAssignPlayerHands();
        // ページのUI作成
        this.CONTAINER.innerHTML = GameBoardPage.createGameBoardPage(table.players);
        // カードのUI作成
        const cardContainers = Array.from(document.querySelectorAll(".card-container"));
        for (let i = 0; i < cardContainers.length; i++) {
            let cards: string = "";
            table.players[i].hand.map((card, index) => {
                if (i === 0 && index !== 0) cards += CardView.createReversedCard();
                else cards += CardView.createCard(card);
            });

            cardContainers[i].innerHTML = cards;
        }
    }

    static displayGameResultModal() {
        this.CONTAINER.appendChild(GameResultModal.createGameResultModal());
    }
}