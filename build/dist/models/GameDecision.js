export class GameDecision {
  constructor(action, amount) {
    this.action = action;
    this.amount = amount;
  }
  setAction(action) {
    this.action = action;
  }
  setAmount(amount) {
    this.amount = amount;
  }
  getAction() {
    return this.action;
  }
  getAmount() {
    return this.amount;
  }
}
