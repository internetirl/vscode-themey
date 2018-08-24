'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as themeGenerator from './themeGenerator';

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
            if(!imageUrl || imageUrl === '') {
              return;
            }

            let location = path.join(__dirname, '..', 'themes', 'themey.json');
            themeGenerator.generateThemesFromImage(imageUrl.trim(), location, (err: any, message: any) => {
              if(err) {
                 vscode.window.showInformationMessage("Error getting palette from image. Make sure the path is correct."); 
              } else {
                 promptToReloadWindow();
              }
            });
        });
    });
    context.subscriptions.push(disposable);
}