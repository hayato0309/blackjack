export class PageView {
    static createGameSelectPage(): string {
        return (`
            <div class="flex justify-center items-center h-screen w-screen">
                <div class="w-6/12 rounded-lg bg-white shadow-lg flex">
                    <div class="w-5/12 bg-sky-300 rounded-l-lg">image</div>
                    <div class="w-7/12 p-12">
                        <div class="mb-4">
                            <label class="block mb-2 font-bold text-gray-700">Name</label>
                            <input
                                class="w-full px-3 py-2 border shadow rounded"
                                type="text"
                                placeholder="Name"
                            >
                        </div>
                        <div class="mb-4">
                            <label class="block mb-2 font-bold text-gray-700">Select Game</label>
                            <select class="w-full px-3 py-2 border shadow rounded">
                                <option>Blackjack</option>
                                <option disabled>Porker - coming soon -</option>
                                <option disabled>Baccarat - coming soon -</option>
                            </select>
                        </div>
                        <div class="mb-8">
                            <label class="block mb-2 font-bold text-gray-700">Computer Player Speed</label>
                            <select class="w-full px-3 py-2 border shadow rounded">
                                <option>Fast</option>
                                <option>Middle</option>
                                <option>Slow</option>
                            </select>
                        </div>
                        <button
                            class="w-full px-4 py-2 font-bold text-white bg-zinc-800 rounded-full hover:bg-zinc-600 focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                        GET STARTED
                        </button>
                    </div>
                </div>    
            </div>
        `);
    }

    static createGamePage(playerName: string): string {
        return (`
            <div class="h-screen w-screen">
                <div class="flex justify-center items-center h-1/3 card-container">
                    
                </div>
                <div class="flex h-1/3 p-2">
                    <div class="scale-75" style="width: 30%">
                        <div class="text-center text-xl font-bold tracking-wider">Ninja 🥷</div>
                        <div class="flex justify-center items-center h-full card-container"></div>
                    </div>
                    <div class="rounded-lg bg-white/60 p-3"style="width: 40%">
                        <div class="text-center text-xl font-bold tracking-wider">${playerName}</div>
                        <div class="flex justify-center items-center h-full card-container">
                        </div>
                    </div>
                    <div class="scale-75 p-0" style="width: 30%">
                        <div class="text-center text-xl font-bold tracking-wider">John 🐶</div>
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



// <div class="h-screen w-screen">
//                 <div class="flex justify-center items-center h-1/3">
//                     <div class="border rounded shadow h-36 w-28 mx-2 bg-white relative flex justify-center items-center">
//                         <div class="w-4 text-center absolute top-1 left-1">
//                             <div class="h-4 text-lg">A</div>
//                             <div class="h-4">♥︎</div>
//                         </div>
//                         <div class="text-2xl">♥︎</div>
//                         <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                             <div class="h-4 text-lg">A</div>
//                             <div class="h-4">♥︎</div>
//                         </div>
//                     </div>
//                     <div class="border rounded shadow h-36 w-28 bg-white relative flex justify-center items-center">
//                         <div class="w-4 text-center absolute top-1 left-1">
//                             <div class="h-4 text-lg">A</div>
//                             <div class="h-4">♣︎</div>
//                         </div>
//                         <div class="text-2xl">♣︎</div>
//                         <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                             <div class="h-4 text-lg">A</div>
//                             <div class="h-4">♣︎</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="flex h-1/3 p-4">
//                     <div class="w-4/12">
//                         <div class="text-center text-xl font-bold tracking-wider">Ninja 🥷</div>
//                             <div class="flex justify-center items-center h-full">
//                                 <div class="border rounded shadow h-36 w-28 mx-2 bg-white relative flex justify-center items-center">
//                                     <div class="w-4 text-center absolute top-1 left-1">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♥︎</div>
//                                     </div>
//                                     <div class="text-2xl">♥︎</div>
//                                     <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♥︎</div>
//                                     </div>
//                                 </div>
//                                 <div class="border rounded shadow h-36 w-28 bg-white relative flex justify-center items-center">
//                                     <div class="w-4 text-center absolute top-1 left-1">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♣︎</div>
//                                     </div>
//                                     <div class="text-2xl">♣︎</div>
//                                     <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♣︎</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="w-4/12">
//                             <div class="text-center text-xl font-bold tracking-wider">Hayato</div>
//                             <div class="flex justify-center items-center h-full">
//                                 <div class="border rounded shadow h-36 w-28 mx-2 bg-white relative flex justify-center items-center">
//                                     <div class="w-4 text-center absolute top-1 left-1">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♥︎</div>
//                                     </div>
//                                     <div class="text-2xl">♥︎</div>
//                                     <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♥︎</div>
//                                     </div>
//                                 </div>
//                                 <div class="border rounded shadow h-36 w-28 bg-white relative flex justify-center items-center">
//                                     <div class="w-4 text-center absolute top-1 left-1">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♣︎</div>
//                                     </div>
//                                     <div class="text-2xl">♣︎</div>
//                                     <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♣︎</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="w-4/12">
//                             <div class="text-center text-xl font-bold tracking-wider">John 🐶</div>
//                             <div class="flex justify-center items-center h-full">
//                                 <div class="border rounded shadow h-36 w-28 mx-2 bg-white relative flex justify-center items-center">
//                                     <div class="w-4 text-center absolute top-1 left-1">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♥︎</div>
//                                     </div>
//                                     <div class="text-2xl">♥︎</div>
//                                     <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♥︎</div>
//                                     </div>
//                                 </div>
//                                 <div class="border rounded shadow h-36 w-28 bg-white relative flex justify-center items-center">
//                                     <div class="w-4 text-center absolute top-1 left-1">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♣︎</div>
//                                     </div>
//                                     <div class="text-2xl">♣︎</div>
//                                     <div class="w-4 text-center absolute bottom-1 right-1 rotate-180">
//                                         <div class="h-4 text-lg">A</div>
//                                         <div class="h-4">♣︎</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 <div class="flex justify-center items-center h-1/3">
//                     <div>
//                         <div class="flex">
//                             <div class="w-1/2 text-center mb-6">
//                                 <div class="text-xl font-bold tracking-wider">
//                                     <div>Chips</div>
//                                     <div>$400-</div>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label class="text-xl font-bold tracking-wider">Bet</label> 
//                                 <div><input type="number" class="w-50 h-8 px-2 rounded-xl"></div>
//                             </div>
//                         </div>
//                         <div>
//                             <button class="bg-zinc-800 hover:bg-zinc-600 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Stand</button>
//                             <button class="bg-zinc-800 hover:bg-zinc-600 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Double</button>
//                             <button class="bg-zinc-800 hover:bg-zinc-600 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Hit</button>
//                             <button class="bg-zinc-800 hover:bg-zinc-600 text-white text-lg font-bold tracking-wider shadow rounded-xl py-1 px-6 mx-2">Surrender</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>