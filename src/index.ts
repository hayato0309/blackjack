import { Table } from './models/Table';
import { Controller } from './controllers/blackjack';
import { GameSettingPage } from './views/blackjack/pages/gameSetting';


const table = new Table("blackjack", "test123", [1, 5, 20, 50, 100], "fast");

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


// gameSettingページを表示
Controller.displayGameSettingPage();

// gameSettinページの入力値をもとにゲームを開始
const gameSettingForm = <HTMLFormElement>document.querySelector("#gameSettingForm");
gameSettingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  Controller.startBlackjack();
});


// Controller.displayGameResultModal();