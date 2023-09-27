"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const EnvDataPanel_1 = require("./panels/EnvDataPanel");
function activate(context) {
    EnvDataPanel_1.EnvDataPanel.render(context);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map