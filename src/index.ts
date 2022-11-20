import { Card } from './models/Card';
import { Deck } from './models/Deck';
import { Player } from './models/Player';
import { GameDecision } from './models/GameDecision';
import { Table } from './models/Table';


const table = new Table("blackjack", [5, 20, 50, 100]);

table.blackjackAssignPlayerHands();

const houseUpcardRank = table.players[0].hand[0][1];
console.log(houseUpcardRank);

table.players.map((player) => {
    while (player.gameStatus === "betting") {
        if (player.type === "ai") {
            const nextAction = player.aiPlayerNextAction(houseUpcardRank);
            const betAmount = player.aiPlayerDecideBetAmount();

            const [action, amount] = [nextAction, betAmount];
            const gameDecision = new GameDecision(action, amount);
            console.log(gameDecision);

        } else if (player.type === "user") {
            console.log(`Since ${player.name} is not AI, he/she should decide the next action by yourself😤`);
        }

        player.hand.push(table.deck.drawOne());
        if (player.getHandScore() > 21) {
            player.gameStatus = "bust";
        }
    }
});

table.blackjackClearPlayerHandsAndBets();