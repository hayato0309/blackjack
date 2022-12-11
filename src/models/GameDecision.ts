export class GameDecision {
    action: string;
    amount: number;

    constructor(action: string, amount: number) {
        this.action = action; // {'bet', 'surrender', 'stand', 'hit', 'double'}
        this.amount = amount;
    }

    // setter
    setAmount(amount: number): void {
        this.amount = amount;
    }
}