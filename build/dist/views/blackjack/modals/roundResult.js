import {Controller} from "../../../controllers/blackjack.js";
export class RoundResultModal {
  static createRoundResultModal(roundResult, table) {
    const roundResultModal = document.createElement("div");
    roundResultModal.setAttribute("id", "roundResultModal");
    roundResultModal.innerHTML = `
            <div class="flex justify-center items-center fixed top-0 left-0 h-screen w-screen bg-slate-500/50">
                <div class="bg-white shadow-lg rounded-3xl w-1/2 p-8">
                    <div class="text-3xl font-bold tracking-wider text-center mb-5">Round ${table.getResultLog().length}</div>
                    <table class="w-full mb-8">
                        <thead class="flex w-full rounded-t-xl bg-zinc-100">
                            <tr class="flex w-full border-b-2">
                                <th class="py-4 w-4/12">NAME</th>
                                <th class="py-4 w-4/12">WIN / LOSE</th>
                                <th class="py-4 w-4/12">EARNINGS</th>
                            </tr>
                        </thead>
                        <tbody class="flex flex-col items-center justify-between w-full rounded-b-xl">
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-4/12">${roundResult[0]["name"]}</td>
                                <td class="text-center py-4 w-4/12">${roundResult[0]["winOrLose"]}</td>
                                <td class="text-center py-4 w-4/12">$${roundResult[0]["devidend"]}</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-4/12">${roundResult[1]["name"]}</td>
                                <td class="text-center py-4 w-4/12">${roundResult[1]["winOrLose"]}</td>
                                <td class="text-center py-4 w-4/12">$${roundResult[1]["devidend"]}</td>
                            </tr>
                            <tr class="flex w-full border-b">
                                <td class="text-center py-4 w-4/12">${roundResult[2]["name"]}</td>
                                <td class="text-center py-4 w-4/12">${roundResult[2]["winOrLose"]}</td>
                                <td class="text-center py-4 w-4/12">$${roundResult[2]["devidend"]}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex justify-center">
                        <button id="playAnotherRoundButton" class="bg-zinc-800 hover:bg-teal-500 text-white font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Play Another Round</button>
                        <button id="displayGameResultModal" class="bg-zinc-800 hover:bg-red-500 text-white font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Stop This Game</button>
                    </div>
                </div>
            </div>
        `;
    return roundResultModal;
  }
  static setPlayAnotherRoundButtonEvent(table) {
    const playAnotherRoundButton = document.querySelector("#playAnotherRoundButton");
    playAnotherRoundButton.addEventListener("click", () => {
      Controller.playAnotherRound(table);
    });
  }
  static setDisplayGameResultModalEvent(table) {
    const displayGameResultModalButton = document.querySelector("#displayGameResultModal");
    displayGameResultModalButton.addEventListener("click", () => {
      const roundResultModal = document.querySelector("#roundResultModal");
      roundResultModal.remove();
      Controller.displayGameResultModal(table);
    });
  }
}
