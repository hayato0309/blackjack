import { Card } from './models/Card';
import { Deck } from './models/Deck';
import { Player } from './models/Player';
import { GameDecision } from './models/GameDecision';
import { Table } from './models/Table';


const table = new Table("blackjack", [5, 20, 50, 100]);

table.blackjackAssignPlayerHands();

const houseUpCardRank = table.players[0].hand[0][1];
console.log(houseUpCardRank);

// table.players.map((player) => {
//     while (!(player.playerStatus === "roundOver" || player.playerStatus === "bust")) {
//         if (player.type === "ai") {
//             // const nextAction = player.aiPlayerNextAction(houseUpCardRank);
//             // const betAmount = player.aiPlayerDecideBetAmount();

//             // const [action, amount] = [nextAction, betAmount];
//             // const gameDecision = new GameDecision(action, amount);
//             // console.log(gameDecision);
//             const currPlayer = table.getTurnPlayer();
//             table.promptNextAiActionAndBet(currPlayer, houseUpCardRank);
//             table.executeGameDecision(currPlayer);

//         } else if (player.type === "user") {
//             console.log(`Since ${player.name} is not AI, he/she should decide the next action by yourself😤`);
//         }

//         // player.hand.push(table.deck.drawOne());
//         if (player.getHandScore() > 21) {
//             player.playerStatus = "bust";
//         }
//     }
// });

while (table.gamePhase === "betting") {
    const currPlayer = table.getTurnPlayer();
    table.promptNextAiActionAndBet(currPlayer, houseUpCardRank, table.turnCounter);
    table.executeGameDecision(currPlayer);

    table.checkIfPlayerIsBust(currPlayer);

    table.checkIfReadyForActing();
}

table.players.map((player) => {
    console.log(player);
})

table.blackjackClearPlayerHandsAndBets();