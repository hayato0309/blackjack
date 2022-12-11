import { CONTAINER } from "../../../config/config";
import type { Table } from "../../../models/Table";
import { Controller } from "../../../controllers/blackjack";

export class GameBoardPage {
    static createGameBoardPage(table: Table): void {
        CONTAINER.innerHTML = `
            <div class="h-screen w-screen">
                <div class="flex justify-center items-center h-2/5 card-container"></div>
                <div class="flex h-2/5 p-2">
                    <div class="scale-75" style="width: 30%">
                        <div class="text-center text-xl font-bold tracking-wider">${table.players[1].name}</div>
                        <div class="text-center text-xl font-bold">$${table.players[1].chips}-</div>
                        <div class="flex justify-center items-center h-5/6 card-container"></div>
                    </div>
                    <div class="rounded-lg bg-white/60 p-3" style="width: 40%">
                        <div class="text-center text-xl font-bold tracking-wider">${table.players[2].name}</div>
                        <div class="text-center text-xl font-bold">$${table.players[2].chips}-</div>
                        <div class="flex justify-center items-center h-5/6 card-container"></div>
                    </div>
                    <div class="scale-75 p-0" style="width: 30%">
                        <div class="text-center text-xl font-bold tracking-wider">${table.players[3].name}</div>
                        <div class="text-center text-xl font-bold">$${table.players[3].chips}-</div>
                        <div class="flex justify-center items-center h-5/6 card-container"></div>
                    </div>
                </div>
                <div class="flex justify-center items-center h-1/5">
                    <div class="block w-2/5">
                        <div class="flex justify-center mb-10 ${table.gamePhase !== 'betting' ? 'hidden' : ''}">
                            <form id="betAmountForm" class="block">
                                <label class="inline-block mr-2 text-xl font-bold tracking-wider">Bet</label>
                                <input id="betAmountInput" type="number" class="inline-block shadow-sm w-50 h-8 px-2 rounded-xl focus:outline-teal-500">
                                <button type="submit" class="inline-block shadow-sm bg-teal-500 hover:bg-teal-400 text-white font-bold tracking-wider shadow rounded-xl py-1 px-3 ml-1">Submit</button>
                            </form>
                        </div>
                        <div class="flex justify-center mb-10 ${table.gamePhase === 'betting' ? 'hidden' : ''}">
                            <div>
                                <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Stand</button>
                                <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Double</button>
                                <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Hit</button>
                                <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Surrender</button>
                                </div>
                            </div>
                        <div class="text-center">
                            <a class="inline-block mx-4 underline underline-offset-2 hover:text-teal-500 cursor-pointer">Exit Game Room</a>
                            <a class="inline-block mx-4 underline underline-offset-2 hover:text-teal-500 cursor-pointer">Reset Game</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 掛け金がSubmitされたら以下を実行
        const betAmountForm = <HTMLFormElement>document.querySelector("#betAmountForm");
        betAmountForm.addEventListener("submit", (e) => {
            e.preventDefault();
            Controller.bettingPhase(table);
        });
    }
}