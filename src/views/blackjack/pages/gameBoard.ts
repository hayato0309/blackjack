import { CONTAINER } from "../../../config/config";
import type { Table } from "../../../models/Table";
import { Controller } from "../../../controllers/blackjack";
import { CardView } from "../../../views/card";

export class GameBoardPage {
    static createGameBoardPage(table: Table): void {
        CONTAINER.innerHTML = `
            <div class="h-screen w-screen">
                <div class="flex justify-center items-center h-2/5 card-container"></div>
                <div class="flex h-2/5 p-2">
                    <div class="scale-75" style="width: 30%">
                        <div class="mb-2">
                            <div class="flex justify-center text-xl font-bold tracking-wider mb-1">
                                <div class="mx-2">${table.players[1].name}</div>
                                <div class="mx-2">$${table.players[1].chips}</div>
                            </div>
                            <div class="flex justify-center text-xl font-bold ${table.gamePhase === 'betting' ? 'hidden' : ''}">
                                <div class="flex mx-2">
                                    <div class="rounded-lg bg-slate-200 mx-1 py-1 px-2">Action</div>
                                    <div class="mx-1 py-1">${table.players[1].gameDecision.action}</div>                                
                                </div>
                                <div class="flex mx-2">
                                    <div class="rounded-lg bg-slate-200 mx-1 py-1 px-2">Bet</div>
                                    <div class="mx-1 py-1">${table.players[1].gameDecision.amount}</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center items-center h-5/6 card-container"></div>
                    </div>
                    <div class="rounded-lg bg-white/60 p-3" style="width: 40%">
                        <div class="mb-2">
                            <div class="flex justify-center text-xl font-bold tracking-wider mb-1">
                                <div class="mx-2">${table.players[2].name}</div>
                                <div class="mx-2">$${table.players[2].chips}</div>
                            </div>
                            <div class="flex justify-center text-xl font-bold ${table.gamePhase === 'betting' ? 'hidden' : ''}">
                                <div class="flex mx-2">
                                    <div class="rounded-lg bg-slate-100 mx-1 py-1 px-2">Action</div>
                                    <div class="mx-1 py-1">${table.players[2].gameDecision.action}</div>                                
                                </div>
                                <div class="flex mx-2">
                                    <div class="rounded-lg bg-slate-100 mx-1 py-1 px-2">Bet</div>
                                    <div class="mx-1 py-1">${table.players[2].gameDecision.amount}</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center items-center h-5/6 card-container"></div>
                    </div>
                    <div class="scale-75" style="width: 30%">
                        <div class="mb-2">
                            <div class="flex justify-center text-xl font-bold tracking-wider mb-1">
                                <div class="mx-2">${table.players[3].name}</div>
                                <div class="mx-2">$${table.players[3].chips}</div>
                            </div>
                            <div class="flex justify-center text-xl font-bold ${table.gamePhase === 'betting' ? 'hidden' : ''}">
                                <div class="flex mx-2">
                                    <div class="rounded-lg bg-slate-200 mx-1 py-1 px-2">Action</div>
                                    <div class="mx-1 py-1">${table.players[3].gameDecision.action}</div>                                
                                </div>
                                <div class="flex mx-2">
                                    <div class="rounded-lg bg-slate-200 mx-1 py-1 px-2">Bet</div>
                                    <div class="mx-1 py-1">${table.players[3].gameDecision.amount}</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center items-center h-5/6 card-container"></div>
                    </div>
                </div>
                <div class="flex justify-center items-center h-1/5">
                    <div class="block w-2/5">
                        <div class="flex justify-center mb-10 ${table.gamePhase !== 'betting' ? 'hidden' : ''}">
                            <form id="betAmountForm" class="block">
                                <label class="inline-block mr-2 text-xl font-bold tracking-wider">Bet</label>
                                <input id="betAmountInput" type="number" class="inline-block shadow-sm w-50 h-8 px-2 rounded-xl focus:outline-teal-500">
                                <button type="submit" class="inline-block bg-zinc-800 hover:bg-teal-500 text-white font-bold tracking-wider shadow rounded-xl py-1 px-3 ml-1">Submit</button>
                            </form>
                        </div>
                        <div id="action-buttons" class="flex justify-center mb-10 ${table.getTurnPlayer().getType() !== 'user' ? 'hidden' : ''}">
                            <button type="submit" value="stand" class="action-button bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Stand</button>
                            <button type="submit" value="double" class="action-button bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Double</button>
                            <button type="submit" value="hit" class="action-button bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Hit</button>
                            <button type="submit" value="surrender" class="action-button bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Surrender</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // カードのUI作成
        const cardContainers = Array.from(document.querySelectorAll(".card-container"));
        for (let i = 0; i < cardContainers.length; i++) {
            let cards: string = "";
            table.players[i].hand.map((card, index) => {
                if (table.getGamePhase() === "betting") {
                    // gamePhaseがbettingの時は全てのカードは伏せた状態
                    cards += CardView.createReversedCard();

                } else if (table.getGamePhase() === "acting" && !table.checkIfAllPlayersDoneWithActing()) {
                    // bettingが終わるとhouseは1枚だけ表向き。その他playerは全てのカードが表向き
                    if (i === 0 && index !== 0) cards += CardView.createReversedCard();
                    else cards += CardView.createCard(card);

                } else if (table.getGamePhase() === "acting" && table.checkIfAllPlayersDoneWithActing()) {
                    // ai, userのactingが終了し、houseがカードを引く番になったら全てのカードを表向きにする
                    cards += CardView.createCard(card);
                }
            });

            cardContainers[i].innerHTML = cards;
        }

        // 掛け金がSubmitされたときのイベント
        const betAmountForm = <HTMLFormElement>document.querySelector("#betAmountForm");
        betAmountForm.addEventListener("submit", (e) => {
            e.preventDefault();
            Controller.bettingPhase(table);
        });
    }
}