import { Card } from './models/Card';
import { Deck } from './models/Deck';
import { Player } from './models/Player';
import { GameDecision } from './models/GameDecision';

// player作成の確認
let players = [];

players.push(new Player('hayato', 'house', 'blackjack'));
players.push(new Player('henry', 'user', 'blackjack'));
players.push(new Player('nancy', 'ai', 'blackjack'));
players.push(new Player('lindy', 'ai', 'blackjack'));

// card作成とシャッフルの確認
let deck = new Deck('blackjack');
deck.shuffle();

// playerに2枚ずつカードを配布
players.map((player) => {
    for (let i = 0; i < 2; i++) {
        player.hand.push(deck.drawOne());
    }
});

const houseUpcardRank = players[0].hand[0][1];
console.log(houseUpcardRank);

players.map((player) => {
    while (player.gameStatus === "betting") {
        if (player.type === "ai") {
            const nextAction = player.aiPlayerNextAction(houseUpcardRank);
            const betAmount = player.aiPlayerDecideBetAmount();

            const [action, amount] = [nextAction, betAmount];
            const gameDecision = new GameDecision(action, amount);
            console.log(gameDecision);

        } else if (player.type === "user") {
            console.log(`Since ${player.name} is not AI, he/she should decide the next action by yourself😤`);
        }

        player.hand.push(deck.drawOne());
        if (player.getHandScore() > 21) {
            player.gameStatus = "bust";
        }
    }
});

// playerの手札の合計計算メソッドの確認
players.map((player) => {
}
);