export class GameDecision {
    action: string;
    amount: number;

    constructor(action: string, amount: number) {
        this.action = action; // {'bet', 'surrender', 'stand', 'hit', 'double'}
        this.amount = amount;
    }

    // setter
    setAction(action: string): void {
        this.action = action;
    }

    setAmount(amount: number): void {
        this.amount = amount;
    }

    // getter
    getAction(): string {
        return this.action;
    }

    getAmount(): number {
        return this.amount;
    }
}