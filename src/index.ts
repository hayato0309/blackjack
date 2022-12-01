import { Table } from './models/Table';
import { Controller } from './controllers/blackjack';
import { GameSelectPage } from './views/blackjack/pages/gameSelect';


const table = new Table("blackjack", [1, 5, 20, 50, 100]);

table.blackjackAssignPlayerHands();

const house = table.players[0];

const houseUpCardRank = table.players[0].hand[0].slice(1);

while (table.gamePhase === "betting") {
  const currPlayer = table.getTurnPlayer();

  if (currPlayer.playerStatus === "betting") {
    table.promptNextAiActionAndBet(currPlayer, houseUpCardRank, table.turnCounter);
    table.executeGameDecision(currPlayer);
  }

  table.checkIfPlayerIsBust(currPlayer);

  table.checkIfAllPlayersReadyForActing();
}

table.players.map((player) => {
  if (player.type !== "house") {
    const devidends = table.calcDevidend(house, player);
    table.updatePlayerChips(house, devidends.house);
    table.updatePlayerChips(player, devidends.player);
  }
})

table.players.map((player) => {
  console.log(player);
})

// table.blackjackClearPlayerHandsAndBets();

// Controller.displayGameSelectPage();
Controller.displayGamePage(table.players);

// Controller.displayGameResultModal();