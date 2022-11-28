export class View {
    static createGameSelectPage(containerDom: HTMLElement): void {
        containerDom.innerHTML = `
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
        `
    }
}