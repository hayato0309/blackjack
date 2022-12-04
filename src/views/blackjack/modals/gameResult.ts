export class GameResultModal {
    static createGameResultModal(): HTMLDivElement {
        const gameResultModal = document.createElement("div");
        gameResultModal.innerHTML = `
            <div class="flex justify-center items-center fixed top-0 left-0 h-screen w-screen bg-slate-500/50">
                <div class="bg-white shadow-lg rounded-3xl w-1/2 h-3/4 p-8">
                    <div class="text-3xl font-bold tracking-wider text-center mb-5">Game Result</div>
                    <div class="text-center mb-3 tracking-wider">
                        <div class="inline-block text-xl font-bold mx-4">7 rounds</div>
                        <div class="inline-block text-xl font-bold mx-4">+ $300</div>
                    </div>

                    <table class="w-full h-3/4 mb-4">
                        <thead class="flex w-full rounded-t-xl bg-zinc-100">
                            <tr class="flex w-full border-b-2">
                                <th class="py-4 w-2/12">ROUND</th>
                                <th class="py-4 w-4/12">HAND</th>
                                <th class="py-4 w-3/12">WIN / LOSE</th>
                                <th class="py-4 w-3/12">CHIPS ⇅</th>
                            </tr>
                        </thead>
                        <tbody class="flex flex-col items-center justify-between overflow-y-scroll w-full h-5/6 shadow-xl shadow-inner rounded-b-xl">
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-2/12">1</td>
                                <td class="text-center py-4 w-4/12">HA, S10</td>
                                <td class="text-center py-4 w-3/12">WIN</td>
                                <td class="text-center py-4 w-3/12">+ $50</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-2/12">1</td>
                                <td class="text-center py-4 w-4/12">HA, S10</td>
                                <td class="text-center py-4 w-3/12">WIN</td>
                                <td class="text-center py-4 w-3/12">+ $50</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-2/12">1</td>
                                <td class="text-center py-4 w-4/12">HA, S10</td>
                                <td class="text-center py-4 w-3/12">WIN</td>
                                <td class="text-center py-4 w-3/12">+ $50</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-2/12">1</td>
                                <td class="text-center py-4 w-4/12">HA, S10</td>
                                <td class="text-center py-4 w-3/12">WIN</td>
                                <td class="text-center py-4 w-3/12">+ $50</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-2/12">1</td>
                                <td class="text-center py-4 w-4/12">HA, S10</td>
                                <td class="text-center py-4 w-3/12">WIN</td>
                                <td class="text-center py-4 w-3/12">+ $50</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-2/12">1</td>
                                <td class="text-center py-4 w-4/12">HA, S10</td>
                                <td class="text-center py-4 w-3/12">WIN</td>
                                <td class="text-center py-4 w-3/12">+ $50</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-2/12">1</td>
                                <td class="text-center py-4 w-4/12">HA, S10</td>
                                <td class="text-center py-4 w-3/12">WIN</td>
                                <td class="text-center py-4 w-3/12">+ $50</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex justify-center">
                        <button class="bg-zinc-800 hover:bg-teal-500 text-white font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Home</button>
                        <button class="bg-zinc-800 hover:bg-teal-500 text-white font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">New Game</button>
                    </div>
                </div>
            </div>
        `;

        return gameResultModal;
    }
}