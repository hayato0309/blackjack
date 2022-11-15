import { Card } from './models/Card';
import { Deck } from './models/Deck';
import { Player } from './models/Player';
import { GameDecision } from './models/GameDecision';


// player作成の確認
let players = [];

players.push(new Player('hayato', 'house', 'blackjack'));
players.push(new Player('henry', 'ai', 'blackjack'));
players.push(new Player('nancy', 'ai', 'blackjack'));
players.push(new Player('lindy', 'ai', 'blackjack'));

// console.log(players);


// card作成とシャッフルの確認
let deck = new Deck('blackjack');
deck.shuffle();
// console.log(deck);


// playerに2枚ずつカードを配布
players.map((player) => {
    for (let i = 0; i < 2; i++) {
        player.hand.push(deck.drawOne());
    }
    // console.log(player.hand);
});

// players.map((player) => console.log(player));


// playerのターンを回す
// let currPlayerIndex = 0;

players.map((player) => {
    while (player.gameStatus === "betting") {
        player.hand.push(deck.drawOne());
        if (player.getHandScore() > 21) {
            player.gameStatus = "bust";
        }
    }
});

// playerの手札の合計計算メソッドの確認
players.map((player) => {
    console.log(player.getHandScore());
    console.log(player.hand);
}
);