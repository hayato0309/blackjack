import { Table } from './models/Table';
import { Controller } from './controllers/blackjack';
import { GameSettingPage } from './views/blackjack/pages/gameSetting';
import { GameDecision } from './models/GameDecision';


// const table = new Table("blackjack", "test123", [1, 5, 20, 50, 100], "fast");

// table.blackjackAssignPlayerHands();

// const house = table.players[0];

// const houseUpCardRank = table.players[0].hand[0].slice(1);

// while (table.gamePhase === "betting") {
//   const currPlayer = table.getTurnPlayer();

//   if (currPlayer.playerStatus === "betting") {
//     table.promptNextAiActionAndBet(currPlayer, houseUpCardRank, table.turnCounter);
//     table.executeGameDecision(currPlayer);
//   }

//   table.checkIfPlayerIsBust(currPlayer);

//   table.checkIfAllPlayersReadyForActing();
// }

// table.players.map((player) => {
//   if (player.type !== "house") {
//     const devidends = table.calcDevidend(house, player);
//     table.updatePlayerChips(house, devidends.house);
//     table.updatePlayerChips(player, devidends.player);
//   }
// })

// table.players.map((player) => {
//   console.log(player);
// })

// table.blackjackClearPlayerHandsAndBets();


// gameSettingページを表示
Controller.displayGameSettingPage();

// Tableインスタンス作成
let table = new Table();

// ゲーム開始
const gameSettingForm = <HTMLFormElement>document.querySelector("#gameSettingForm");
gameSettingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  Controller.startBlackjack(table);
});

// // betting：掛け金がSubmitされたら以下を実行
// const betAmountForm = <HTMLFormElement>document.querySelector("#betAmountForm");
// betAmountForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   table.players.map((player) => {
//     if (player.type === "house") {
//       // houseは賭ける必要が無いので何もしない
//     } else if (player.type === "ai") {
//       player.setGameDecision(new GameDecision("bet", player.aiPlayerDecideBetAmount()));
//     } else if (player.type === "user") {
//       const userBetAmount = Number((<HTMLInputElement>document.querySelector("#betAmountInput")).value);
//       player.setGameDecision(new GameDecision("bet", userBetAmount));
//     }
//   })
// });


// Controller.displayGameResultModal();