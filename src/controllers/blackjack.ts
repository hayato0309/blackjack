import { View } from './../views/blackjack';

export class Controller {
    static displayGameSelectPage() {
        const containerDom = document.getElementById("container")!;
        View.createGameSelectPage(containerDom);
        console.log(containerDom);
    }
}