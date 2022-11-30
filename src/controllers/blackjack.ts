import { Card } from './../models/Card';
import type { Player } from '../models/Player';
import { PageView } from '../views/blackjack';
import { CardView } from '../views/card';

export class Controller {
    static CONTAINER = document.getElementById("container")!;

    static displayGameSelectPage() {
        this.CONTAINER.innerHTML = PageView.createGameSelectPage();
    }

    static displayGamePage(players: Player[]) {
        this.CONTAINER.innerHTML = PageView.createGamePage("Hayato");

        const cardContainers = Array.from(document.querySelectorAll(".card-container"));

        for (let i = 0; i < cardContainers.length; i++) {
            let cards: string = "";
            players[i].hand.map((card, index) => {
                if (i === 0 && index !== 0) cards += CardView.createReversedCard();
                else cards += CardView.createCard(card);
            });
            // for (let j = 0; j < players[i].hand.length; j++) {
            //     console.log(i);
            //     console.log(j);

            //     if (i === 0 && j !== 0) cards += CardView.createCard(players[i].hand[j], true);
            //     else cards += CardView.createCard(players[i].hand[j]);
            // }

            cardContainers[i].innerHTML = cards;
        }
    }
}