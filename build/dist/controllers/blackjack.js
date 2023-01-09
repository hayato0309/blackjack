import {Deck} from "../models/Deck.js";
import {CONTAINER} from "../config/config.js";
import {Table} from "../models/Table.js";
import {GameSettingPage} from "../views/blackjack/pages/gameSetting.js";
import {GameBoardPage} from "../views/blackjack/pages/gameBoard.js";
import {RoundResultModal} from "../views/blackjack/modals/roundResult.js";
import {GameResultModal} from "../views/blackjack/modals/gameResult.js";
import {GameDecision} from "../models/GameDecision.js";
import {sleep} from "../utils/sleep.js";
import {INITIAL_CHIPS} from "../config/config.js";
export class Controller {
  static displayGameSettingPage() {
    GameSettingPage.createGameSettingPage(new Table());
  }
  static startBlackjack(table) {
    const userName = document.querySelector("#userName").value;
    const gameType = document.querySelector("#gameType").value;
    const computerPlayerSpeed = document.querySelector("#computerPlayerSpeed").value;
    table.setGameType(gameType);
    table.setPlayers(userName);
    table.setComputerPlayerSpeed(computerPlayerSpeed);
    const deck = new Deck(table.getGameType());
    deck.shuffle();
    table.setDeck(deck);
    table.blackjackAssignPlayerHands();
    GameBoardPage.createGameBoardPage(table);
  }
  static bettingPhase(table) {
    table.players.map((player) => {
      if (player.type === "house") {
      } else if (player.type === "ai") {
        player.setGameDecision(new GameDecision("bet", player.aiPlayerDecideBetAmount()));
        player.setChips(player.getChips() - player.gameDecision.amount);
      } else if (player.type === "user") {
        const userBetAmount = Number(document.querySelector("#betAmountInput").value);
        player.setGameDecision(new GameDecision("bet", userBetAmount));
        player.setChips(player.getChips() - player.gameDecision.amount);
      }
    });
    this.setActingPhase(table);
  }
  static setActingPhase(table) {
    const notHousePlayers = table.getPlayers().filter((player) => player.getType() !== "house");
    notHousePlayers.map((player) => {
      player.getGameDecision().setAction("");
    });
    table.setGamePhase("acting");
    this.actingPhase(table);
  }
  static async actingPhase(table) {
    while (table.getGamePhase() === "acting") {
      table.increaseTurnCounter();
      let turnPlayer = table.getTurnPlayer();
      GameBoardPage.createGameBoardPage(table);
      if (table.checkIfAllPlayersDoneWithActing()) {
        await sleep(1500);
        GameBoardPage.createGameBoardPage(table);
        const house = table.getPlayers()[0];
        while (house.getHandScore() < 17) {
          await sleep(1500);
          house.getHand().push(table.getDeck().drawOne());
          GameBoardPage.createGameBoardPage(table);
        }
        if (house.checkIfPlayerIsBust())
          house.setPlayerStatus("bust");
        else
          house.setPlayerStatus("doneWithActing");
        table.setGamePhase("evaluatingWinner");
        await sleep(1500);
        this.displayRoundResultModal(table);
      }
      if (turnPlayer.checkIfPlayerIsBust())
        turnPlayer.setPlayerStatus("bust");
      if (turnPlayer.checkIfPlayerDoneWithActingPhase())
        continue;
      if (turnPlayer.getType() === "house") {
      } else if (turnPlayer.getType() === "ai") {
        const thinkingTime = table.calcAiThinkingTime();
        await sleep(thinkingTime);
        let aiPlayerGameDecision = turnPlayer.getGameDecision();
        aiPlayerGameDecision.setAction(turnPlayer.aiPlayerNextAction(table.getUpCardRank()));
        table.executeGameDecision(turnPlayer);
      } else if (turnPlayer.getType() === "user") {
        this.userAction(table, turnPlayer);
        break;
      }
    }
  }
  static userAction(table, turnPlayer) {
    const nextActionButtons = Array.from(document.querySelectorAll(".action-button"));
    nextActionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target;
        turnPlayer.userPlayerGameDecision(target.value);
        table.executeGameDecision(turnPlayer);
        this.actingPhase(table);
      });
    });
  }
  static displayRoundResultModal(table) {
    const house = table.getPlayers()[0];
    const notHousePlayers = table.getPlayers().filter((player) => player.getType() !== "house");
    let roundResult = [];
    notHousePlayers.map((player) => {
      let winner = table.getWinner(house, player);
      let winOrLose = "";
      switch (winner) {
        case "player":
          winOrLose = "WIN";
          break;
        case "house":
          winOrLose = "LOSE";
          break;
        case "no one":
          winOrLose = "DRAW";
          break;
        default:
          break;
      }
      let devidend = table.calcDevidend(house, player);
      roundResult.push({name: player.getName(), winOrLose, devidend});
      const currentChips = player.getChips();
      const newChips = currentChips + devidend;
      player.setChips(newChips);
    });
    const user = table.getPlayers()[2];
    let resultLog = table.getResultLog();
    resultLog.push({hand: user.getHand(), winOrLose: roundResult[1]["winOrLose"], devidend: roundResult[1]["devidend"]});
    table.setResultLog(resultLog);
    CONTAINER.appendChild(RoundResultModal.createRoundResultModal(roundResult, table));
    RoundResultModal.setPlayAnotherRoundButtonEvent(table);
    RoundResultModal.setDisplayGameResultModalEvent(table);
  }
  static playAnotherRound(table) {
    table.setGamePhase("betting");
    table.setTurnCounter(0);
    table.setDeck(new Deck(table.getGameType()));
    table.getDeck().shuffle();
    table.getPlayers().map((player) => {
      player.setHand([]);
      player.setPlayerStatus("betting");
      player.setGameDecision(new GameDecision("", 0));
    });
    table.blackjackAssignPlayerHands();
    GameBoardPage.createGameBoardPage(table);
  }
  static displayGameResultModal(table) {
    const userChips = table.getPlayers()[2].getChips();
    CONTAINER.appendChild(GameResultModal.createGameResultModal(table.getResultLog(), userChips));
    GameResultModal.createResultLogTableRow(table.getResultLog());
    GameResultModal.setHomeButtonEvent();
    GameResultModal.setNewGameButtonEvent(table);
  }
  static goHome() {
    this.displayGameSettingPage();
  }
  static playNewGame(table) {
    table.setGamePhase("betting");
    table.setTurnCounter(0);
    table.setResultLog([]);
    table.setDeck(new Deck(table.getGameType()));
    table.getDeck().shuffle();
    table.getPlayers().map((player) => {
      player.setHand([]);
      player.setChips(INITIAL_CHIPS);
      player.setPlayerStatus("betting");
      player.setGameDecision(new GameDecision("", 0));
    });
    table.blackjackAssignPlayerHands();
    GameBoardPage.createGameBoardPage(table);
  }
}
