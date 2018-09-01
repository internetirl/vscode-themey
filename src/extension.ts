'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as themeGenerator from './themeGenerator';
import * as themeSummary from './themeSummary';

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
  let disposable = vscode.commands.registerCommand('extension.runThemey', () => {
    let inputOpts = {
      placeHolder: 'Specify location of image',
      prompt: 'Specify location of image',
      ignoreFocusOut: true
    };
    vscode.window.showInputBox(inputOpts).then((imageUrl) => {
      if (!imageUrl || imageUrl === '') {
        return;
      }

      let location = path.join(__dirname, '..', 'themes');
      themeGenerator.generateThemesFromImage(imageUrl.trim(), location, (err: any, message: any, colorPalette: any) => {
        if (err) {
          vscode.window.showInformationMessage("Error getting palette from image. Make sure the path is correct.");
        } else {

          const panel = vscode.window.createWebviewPanel('Themey', 'Themey', vscode.ViewColumn.One, {enableScripts:true, retainContextWhenHidden: true});
          let htmlSummary = themeSummary.getThemeSummary(imageUrl.trim(), colorPalette, message);
          panel.webview.html = htmlSummary;
          panel.webview.onDidReceiveMessage(message => {
            switch(message.command) {
              case 'updateTemplate':
                vscode.window.showInformationMessage(message.text + ' ' + message.id);
                let templateUpdate = {};
                templateUpdate[message.id] = message.text.replace('#', '');
                themeGenerator.generateThemeFromTemplateValues(templateUpdate);
                promptToReloadWindow();
                return;
              case 'reloadUI':
                vscode.commands.executeCommand('workbench.action.reloadWindow');
                return;
            }
          }, undefined, context.subscriptions);

          promptToReloadWindow();
        }
      });
    });
  });
  context.subscriptions.push(disposable);
//  vscode.window.registerWebviewPanelSerializer('themeyWebView', new ThemeyWebViewSerializer());
}
// class ThemeyWebViewSerializer implements vscode.WebviewPanelSerializer {
//   async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
//     //webviewPanel.webview.html = themeSummary.getThemeSummary() 
//   }
// }
