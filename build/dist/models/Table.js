import {Deck} from "./Deck.js";
import {Player} from "./Player.js";
export class Table {
  constructor(gameType = "", userName = "", betDenomination = [], computerPlayerSpeed = "") {
    this.gameType = gameType;
    this.betDenomination = betDenomination;
    this.deck = new Deck(this.gameType);
    this.deck.shuffle();
    this.players = [];
    this.gamePhase = "betting";
    this.resultLog = [];
    this.turnCounter = 0;
    this.computerPlayerSpeed = computerPlayerSpeed;
  }
  setGameType(gameType) {
    this.gameType = gameType;
  }
  setPlayers(userName) {
    this.players = [];
    if (this.gameType === "blackjack") {
      this.players.push(new Player("HOUSE", "house", "blackjack"));
      this.players.push(new Player("Ninja🥷", "ai", "blackjack"));
      this.players.push(new Player(userName, "user", "blackjack"));
      this.players.push(new Player("Max🐶", "ai", "blackjack"));
    }
  }
  setComputerPlayerSpeed(computerPlayerSpeed) {
    this.computerPlayerSpeed = computerPlayerSpeed;
  }
  setDeck(deck) {
    this.deck = deck;
  }
  setGamePhase(gamePhase) {
    this.gamePhase = gamePhase;
  }
  setTurnCounter(turnCounter) {
    this.turnCounter = turnCounter;
  }
  setResultLog(resultLog) {
    this.resultLog = resultLog;
  }
  getGameType() {
    return this.gameType;
  }
  getGamePhase() {
    return this.gamePhase;
  }
  getComputerPlayerSpeed() {
    return this.computerPlayerSpeed;
  }
  getTurnCounter() {
    return this.turnCounter;
  }
  getPlayers() {
    return this.players;
  }
  getDeck() {
    return this.deck;
  }
  getResultLog() {
    return this.resultLog;
  }
  blackjackAssignPlayerHands() {
    this.players.map((player) => {
      for (let i = 0; i < 2; i++) {
        player.hand.push(this.deck.drawOne());
      }
    });
  }
  blackjackClearPlayerHandsAndBets() {
    this.players.map((player) => {
      player.hand = [];
      player.gameDecision = {};
    });
  }
  increaseTurnCounter() {
    let turnCounter = this.getTurnCounter();
    turnCounter++;
    this.setTurnCounter(turnCounter);
  }
  getTurnPlayer() {
    const playerIndex = this.turnCounter % this.players.length;
    return this.players[playerIndex];
  }
  getUpCardRank() {
    return this.players[0].getHand()[0].slice(1);
  }
  executeGameDecision(player) {
    const nextAction = player.getGameDecision().getAction();
    switch (nextAction) {
      case "blackjack":
      case "stand":
      case "surrender":
        player.setPlayerStatus("doneWithActing");
        break;
      case "hit":
        player.hand.push(this.deck.drawOne());
        break;
      case "double":
        this.updatePlayerChips(player, -player.getGameDecision().getAmount());
        player.hand.push(this.deck.drawOne());
        player.setPlayerStatus("doneWithActing");
        break;
      default:
        break;
    }
  }
  checkIfAllPlayersDoneWithActing() {
    let doneActingCounter = 0;
    this.players.map((player) => {
      if (player.checkIfPlayerDoneWithActingPhase())
        doneActingCounter++;
    });
    return doneActingCounter === 3;
  }
  getWinner(house, player) {
    let winner = "";
    if (player.playerStatus === "surrender")
      winner = "house";
    if (house.playerStatus === "bust" || player.playerStatus === "bust") {
      if (house.playerStatus === "bust" && player.playerStatus === "bust") {
        winner = "house";
      } else if (house.playerStatus === "bust") {
        winner = "player";
      } else if (player.playerStatus === "bust") {
        winner = "house";
      }
    } else {
      const houseScore = house.getHandScore();
      const playerScore = player.getHandScore();
      if (houseScore === playerScore || house.gameDecision.action === "blackjack" && player.gameDecision.action === "blackjack" || house.gameDecision.action === "blackjack" && this.checkIfUserIsBlackjack(player)) {
        winner = "no one";
      } else {
        winner = houseScore > playerScore ? "house" : "player";
      }
    }
    console.log(winner);
    return winner;
  }
  calcDevidend(house, player) {
    let devidend = 0;
    const winner = this.getWinner(house, player);
    if (winner === "no one") {
    } else if (winner === "house") {
      if (player.gameDecision.action === "surrender")
        devidend = player.gameDecision.amount * 0.5;
    } else if (winner === "player") {
      if (player.gameDecision.action === "blackjack")
        devidend = player.gameDecision.amount * 2.5;
      else if (this.checkIfUserIsBlackjack(player))
        devidend = player.gameDecision.amount * 2.5;
      else if (player.gameDecision.action === "double")
        devidend = player.gameDecision.amount * 2 * 2;
      else if (player.gameDecision.action === "surrender")
        devidend = player.gameDecision.amount * 0.5;
      else
        devidend = player.gameDecision.amount * 2;
    }
    return devidend;
  }
  checkIfUserIsBlackjack(player) {
    if (player.getType() === "user") {
      const handLength = player.getHand().length;
      const handScore = player.getHandScore();
      return handLength === 2 && handScore === 21;
    } else {
      return false;
    }
  }
  updatePlayerChips(player, amount) {
    const currChips = player.getChips();
    const newChips = currChips + amount;
    player.setChips(newChips);
  }
  calcAiThinkingTime() {
    const computerPlayerSpeed = this.getComputerPlayerSpeed();
    let thinkingTime = 0;
    switch (computerPlayerSpeed) {
      case "fast":
        thinkingTime = Math.random() * (2e3 - 1500) + 1500;
        break;
      case "middle":
        thinkingTime = Math.random() * (3e3 - 2500) + 2500;
        break;
      case "slow":
        thinkingTime = Math.random() * (4e3 - 3500) + 3500;
        break;
      default:
        thinkingTime = 1e3;
        break;
    }
    return Math.floor(thinkingTime);
  }
}
