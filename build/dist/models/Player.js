import {GameDecision} from "./GameDecision.js";
import {INITIAL_CHIPS} from "../config/config.js";
export class Player {
  constructor(name, type, gameType, chips = INITIAL_CHIPS, playerStatus = "betting") {
    this.name = name;
    this.type = type;
    this.gameType = gameType;
    this.chips = chips;
    this.hand = [];
    this.playerStatus = playerStatus;
    this.gameDecision = {};
  }
  setChips(chips) {
    this.chips = chips;
  }
  setPlayerStatus(playerStatus) {
    this.playerStatus = playerStatus;
  }
  setGameDecision(gameDecision) {
    this.gameDecision = gameDecision;
  }
  setHand(hand) {
    this.hand = hand;
  }
  getName() {
    return this.name;
  }
  getType() {
    return this.type;
  }
  getGameType() {
    return this.gameType;
  }
  getChips() {
    return this.chips;
  }
  getGameDecision() {
    return this.gameDecision;
  }
  getHand() {
    return this.hand;
  }
  getPlayerStatus() {
    return this.playerStatus;
  }
  userPlayerGameDecision(actionParam) {
    const action = actionParam;
    const amount = this.getGameDecision().getAmount();
    this.setGameDecision(new GameDecision(action, amount));
  }
  aiPlayerNextAction(upCardRank) {
    let nextAction = "";
    const handLength = this.hand.length;
    const handScore = this.getHandScore();
    const upCardScore = this.rankToScore(upCardRank);
    if (handLength === 2) {
      if (handScore === 21) {
        nextAction = "blackjack";
      } else {
        if (upCardScore === "A") {
          if (handScore === 17)
            nextAction = "stand";
          if (handScore === 16)
            nextAction = "surrender";
          if (nextAction === "")
            nextAction = "hit";
        } else {
          if (handScore >= 17)
            nextAction = "stand";
          if (handScore >= 13 && handScore <= 16 && upCardScore <= 6)
            nextAction = "stand";
          if (handScore === 12 && upCardScore >= 3 && upCardScore <= 6)
            nextAction = "stand";
          if (handScore === 16 && upCardScore === 10)
            nextAction = "surrender";
          if (handScore === 15 && upCardScore >= 9)
            nextAction = "surrender";
          if (handScore === 11)
            nextAction = "double";
          if (handScore === 10 && upCardScore >= 9)
            nextAction = "double";
          if (handScore === 9 && upCardScore >= 3 && upCardScore <= 6)
            nextAction = "double";
          if (nextAction === "")
            nextAction = "hit";
        }
      }
    }
    if (handLength >= 3) {
      if (handScore < 17)
        nextAction = "hit";
      else
        nextAction = "stand";
    }
    return nextAction;
  }
  checkIfPlayerIsBust() {
    if (this.getHandScore() > 21)
      return true;
    else
      return false;
  }
  checkIfPlayerDoneWithActingPhase() {
    if (["doneWithActing", "bust", "broke"].includes(this.getPlayerStatus()))
      return true;
    else
      return false;
  }
  rankToScore(rank) {
    let score = 0;
    const face = ["J", "Q", "K"];
    if (rank === "A")
      return "A";
    else {
      if (face.includes(rank))
        score = 10;
      else
        score = Number(rank);
    }
    return score;
  }
  aiPlayerDecideBetAmount() {
    if (this.playerStatus === "broke")
      return 0;
    let betAmount = 0;
    let budgetForOneRound = this.chips / 5;
    betAmount = Math.floor(Math.random() * (budgetForOneRound / 5 - 5) + 5) * 5;
    return betAmount;
  }
  aiPlayerSurrender() {
    let willSurrender = false;
    const randomNum = Math.floor(Math.random() * 2);
    willSurrender = randomNum === 0;
    return willSurrender;
  }
  winAmount() {
    return 123;
  }
  getHandScore() {
    const hand = this.hand;
    const face = ["J", "Q", "K"];
    let sum = 0;
    let aCounter = 0;
    for (let i = 0; i < hand.length; i++) {
      const rank = hand[i].slice(1);
      if (rank === "A") {
        sum += 11;
        aCounter++;
        continue;
      }
      ;
      if (face.includes(rank))
        sum += 10;
      else
        sum += Number(rank);
    }
    while (sum > 21 && aCounter > 0) {
      sum -= 10;
      aCounter -= 1;
    }
    return sum;
  }
}
