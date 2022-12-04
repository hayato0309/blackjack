import type { Player } from "../../../models/Player";
export class GameBoardPage {
    static createGameBoardPage(players: Player[]): string {
        return (`
            <div class="h-screen w-screen">
                <div class="flex justify-center items-center h-1/3 card-container">
                    
                </div>
                <div class="flex h-1/3 p-2">
                    <div class="scale-75" style="width: 30%">
                        <div class="text-center text-xl font-bold tracking-wider">${players[1].name}</div>
                        <div class="text-center text-xl font-bold">$${players[1].chips}-</div>
                        <div class="flex justify-center items-center h-full card-container"></div>
                    </div>
                    <div class="rounded-lg bg-white/60 p-3"style="width: 40%">
                        <div class="text-center text-xl font-bold tracking-wider">${players[2].name}</div>
                        <div class="flex justify-center items-center h-full card-container">
                        </div>
                    </div>
                    <div class="scale-75 p-0" style="width: 30%">
                        <div class="text-center text-xl font-bold tracking-wider">${players[3].name}</div>
                        <div class="text-center text-xl font-bold">$${players[3].chips}-</div>
                        <div class="flex justify-center items-center h-full card-container"> 
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-center h-1/3">
                    <div>
                        <div class="flex">
                            <div class="w-1/2 text-center mb-6">
                                <div class="text-xl font-bold tracking-wider">
                                    <div>Chips</div>
                                    <div>$400-</div>
                                </div>
                            </div>
                            <div>
                                <label class="text-xl font-bold tracking-wider">Bet</label> 
                                <div><input type="number" class="w-50 h-8 px-2 rounded-xl focus:outline-teal-500"></div>
                            </div>
                        </div>
                        <div class="mb-10">
                            <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Stand</button>
                            <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Double</button>
                            <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Hit</button>
                            <button class="bg-zinc-800 hover:bg-teal-500 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Surrender</button>
                        </div>
                        <div class="text-center">
                            <a class="inline-block mx-4 underline underline-offset-2 hover:text-teal-500 cursor-pointer">Exit Game Room</a>
                            <a class="inline-block mx-4 underline underline-offset-2 hover:text-teal-500 cursor-pointer">Reset Game</a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}