import { Table } from './models/Table';
import { Controller } from './controllers/blackjack';

// Tableインスタンス作成
let table = new Table();

// gameSettingページを表示
Controller.displayGameSettingPage(table);

// Controller.displayGameResultModal();