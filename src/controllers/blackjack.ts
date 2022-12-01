import type { Player } from '../models/Player';
import { GameSelectPage } from '../views/blackjack/pages/gameSelect';
import { GameBoard } from '../views/blackjack/pages/gameBoard';
import { CardView } from '../views/card';
import { GameResultModal } from '../views/blackjack/gameResult';

export class Controller {
    static CONTAINER = document.getElementById("container")!;

    static displayGameSelectPage() {
        this.CONTAINER.innerHTML = GameSelectPage.createGameSelectPage();
    }

    static displayGamePage(players: Player[]) {
        this.CONTAINER.innerHTML = GameBoard.createGameBoardPage("Hayato");

        const cardContainers = Array.from(document.querySelectorAll(".card-container"));

        for (let i = 0; i < cardContainers.length; i++) {
            let cards: string = "";
            players[i].hand.map((card, index) => {
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