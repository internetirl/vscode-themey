'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import { ThemeyPanel } from './themeyPanel';

function promptToReloadWindow() {
  const action = 'Reload';

  vscode.window
    .showInformationMessage(
      `Reload window to see updated theme. Make sure to have the 'Themey' theme selected.`,
      action
    )
    .then(selectedAction => {
      if (selectedAction === action) {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      }
    });
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.runThemey', () => {
    let inputOpts = {
      placeHolder: 'Specify location of image',
      prompt: 'Specify location of image',
      ignoreFocusOut: true
    };
    vscode.window.showInputBox(inputOpts).then((imageUrl) => {
      if (!imageUrl || imageUrl === '') {
        return;
      }
      imageUrl = imageUrl.trim();
      ThemeyPanel.GenerateThemeFromImage(imageUrl, context.extensionPath);
    });
  }));

  context.subscriptions.push(vscode.commands.registerCommand('extension.editTheme', () => {

  }));
  
  if(vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer(ThemeyPanel.viewType, {
      async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        console.log(`Revivial: Got state: ${state}`);
        ThemeyPanel._imageUrl = state.imageUrl;
        ThemeyPanel._colorPaletteOfImage = state.colorPaletteOfImage;
        ThemeyPanel._generatedColorPalette = state.generatedColorPalette;
        ThemeyPanel.revive(webviewPanel, context.extensionPath);
      }
    });
  }
}
