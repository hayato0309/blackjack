import { Table } from './../models/Table';
import { Deck } from './../models/Deck';
import { CONTAINER } from '../config/config';
import type { Table } from '../models/Table';
import type { Player } from '../models/Player';
import { GameSettingPage } from '../views/blackjack/pages/gameSetting';
import { GameBoardPage } from '../views/blackjack/pages/gameBoard';
import { CardView } from '../views/card';
import { GameResultModal } from '../views/blackjack/modals/gameResult';
import { GameDecision } from '../models/GameDecision';

export class Controller {
    static displayGameSettingPage(table: Table) {
        GameSettingPage.createGameSettingPage(table);
    }

    static startBlackjack(table: Table) {
        // gameSettingページでの入力値を取得
        const userName = (<HTMLInputElement>document.querySelector("#userName")).value;
        const gameType = (<HTMLSelectElement>document.querySelector("#gameType")).value;
        const computerPlayerSpeed = (<HTMLInputElement>document.querySelector("#computerPlayerSpeed")).value;

        // gameSettingページでの入力値を設定
        table.setGameType(gameType);
        table.setPlayers(userName);
        table.setComputerPlayerSpeed(computerPlayerSpeed);

        // deckを作成
        const deck = new Deck(table.getGameType());
        deck.shuffle();
        table.setDeck(deck);

        // 手札2枚ずつを配る
        table.blackjackAssignPlayerHands();
        // GameBoardページのUI作成
        GameBoardPage.createGameBoardPage(table);
    }

    static bettingPhase(table: Table) {
        table.players.map((player) => {
            if (player.type === "house") {
                // houseは賭ける必要が無いので何もしない
            } else if (player.type === "ai") {
                player.setGameDecision(new GameDecision("bet", player.aiPlayerDecideBetAmount()));
                // chipsから引く処理が必要
                player.setChips(player.getChips() - player.gameDecision.amount);
            } else if (player.type === "user") {
                const userBetAmount = Number((<HTMLInputElement>document.querySelector("#betAmountInput")).value);
                player.setGameDecision(new GameDecision("bet", userBetAmount));
                // chipsから引く処理が必要
                player.setChips(player.getChips() - player.gameDecision.amount);
            }
        });

        this.setActingPhase(table);
    }

    static setActingPhase(table: Table) {
        table.setGamePhase("acting");
        this.actingPhase(table);
    }

    static actingPhase(table: Table): void {
        GameBoardPage.createGameBoardPage(table);
    }

    static displayGameResultModal() {
        // this.CONTAINER.appendChild(GameResultModal.createGameResultModal());
    }
}