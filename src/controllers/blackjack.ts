import { View } from './../views/blackjack';

export class Controller {
    static displayGameSelectPage() {
        if (typeof document !== "undefined") {
            const containerDom = document.getElementById("container")!;
            console.log(containerDom);
            View.createGameSelectPage(containerDom);
        }
    }
}