import { commands, ExtensionContext } from "vscode";
import { EnvDataPanel } from "./panels/EnvDataPanel";

export function activate(context: ExtensionContext) {
  EnvDataPanel.render(context);
}
