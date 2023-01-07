import { CardView } from "../../card";
import { Controller } from "../../../controllers/blackjack";
import type { Table, GameResultElement } from "../../../models/Table";
import { INITIAL_CHIPS } from "../../../config/config";

export class GameResultModal {
    static createGameResultModal(resultLog: GameResultElement[], chips: number): HTMLDivElement {

        const numOfRounds: number = resultLog.length;
        let chipsDelta: number = chips - INITIAL_CHIPS;
        let plusMinusSymbol: string = chipsDelta >= 0 ? "+" : "-";

        const gameResultModal = document.createElement("div");
        gameResultModal.innerHTML = `
            <div class="flex justify-center items-center fixed top-0 left-0 h-screen w-screen bg-slate-500/50">
                <div class="bg-white shadow-lg rounded-3xl w-1/2 max-h-3/4 p-8">
                    <div class="text-3xl font-bold tracking-wider text-center mb-5">Game Result</div>
                    <div class="text-center mb-3 tracking-wider">
                        <div class="inline-block text-xl font-bold mx-4">${numOfRounds} rounds</div>
                        <div class="inline-block text-xl font-bold mx-4">$${chips} (${plusMinusSymbol}$${Math.abs(chipsDelta)})</div>
                    </div>
                    <table class="w-full max-h-3/4 mb-4">
                        <thead class="flex w-full rounded-t-xl bg-zinc-100">
                            <tr class="flex w-full border-b-2">
                                <th class="py-4 w-2/12">ROUND</th>
                                <th class="py-4 w-4/12">HAND</th>
                                <th class="py-4 w-3/12">WIN / LOSE</th>
                                <th class="py-4 w-3/12">EARNINGS</th>
                            </tr>
                        </thead>
                        <tbody id="tbody" class="flex flex-col items-center justify-between overflow-y-scroll w-full h-5/6 shadow-xl shadow-inner rounded-b-xl">
                        </tbody>
                    </table>
                    <div class="flex justify-center">
                        <button id="homeButton" class="bg-zinc-800 hover:bg-teal-500 text-white font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Home</button>
                        <button id="newGameButton" class="bg-zinc-800 hover:bg-teal-500 text-white font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">New Game</button>
                    </div>
                </div>
            </div>
        `;

        return gameResultModal;
    }

    static createResultLogTableRow(resultLog: GameResultElement[]): void {
        const tbody = <HTMLTableElement>document.querySelector("#tbody");
        for (let i = 0; i < resultLog.length; i++) {
            const hand = resultLog[i]["hand"];
            const winOrLose = resultLog[i]["winOrLose"];
            const devidend = resultLog[i]["devidend"];

            let handWithSymbol: string[] = [];
            hand.map(card => {
                handWithSymbol.push(CardView.getSuitSymbol(card[0]) + card.slice(1));
            })

            tbody.innerHTML += `
            <tr class="flex w-full border-b">
                <td class="text-center py-4 w-2/12">${i + 1}</td>
                <td class="text-center py-4 w-4/12">${handWithSymbol}</td>
                <td class="text-center py-4 w-3/12">${winOrLose}</td>
                <td class="text-center py-4 w-3/12">$${devidend}</td>
            </tr>`
        }
    }

    static setHomeButtonEvent(): void {
        const homeButton = <HTMLButtonElement>document.querySelector("#homeButton");
        homeButton.addEventListener("click", () => {
            Controller.goHome();
        });
    }

    static setNewGameButtonEvent(table: Table): void {
        const homeButton = <HTMLButtonElement>document.querySelector("#newGameButton");
        homeButton.addEventListener("click", () => {
            Controller.playNewGame(table);
        });
    }
}