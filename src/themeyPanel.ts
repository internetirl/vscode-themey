import * as path from 'path';
import * as vscode from 'vscode';
import * as themeGenerator from './themeGenerator';
import { Themey } from './themey';

 let templateStrings = {
     "base00-hex": "Default Background",
     "base01-hex": "Lighter Background (Used for status bars)",
     "base02-hex": "Selection Background",
     "base03-hex": "Comments, Invisibles, Line Highlighting",
     "base04-hex": "Dark Foreground (Used for status bars)",
     "base05-hex": "Default Foreground, Caret, Delimiters, Operators",
     "base06-hex": "Light Foreground (Not often used)",
     "base07-hex": "Light Background (Not often used)",
     "base08-hex": "Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted",
     "base09-hex": "Integers, Boolean, Constants, XML Attributes, Markup Link Url",
     "base0A-hex": "Classes, Markup Bold, Search Text Background",
     "base0B-hex": "Strings, Inherited Class, Markup Code, Diff Inserted",
     "base0C-hex": "Support, Regular Expressions, Escape Characters, Markup Quotes",
     "base0D-hex": "Functions, Methods, Attribute IDs, Headings",
     "base0E-hex": "Keywords, Storage, Selector, Markup Italic, Diff Changed",
     "base0F-hex": "Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>"
 };

export class ThemeyPanel {
    public static currentPanel: ThemeyPanel | undefined;
    public static readonly viewType = 'themey';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    public static _imageUrl;
    public static _colorPaletteOfImage;
    public static _generatedColorPalette;

    public static createOrShow(extensionPath: string) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        if (ThemeyPanel.currentPanel) {
            ThemeyPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(ThemeyPanel.viewType, "Themey", column || vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });

        ThemeyPanel.currentPanel = new ThemeyPanel(panel, extensionPath);
    }

    public static GenerateThemeFromImage(imageUrl: string, extensionPath: string) {
        const themesDir = path.join(extensionPath, 'themes');
        themeGenerator.GenerateBasicAndBase16ThemesFromImage(imageUrl, themesDir, (err, generatedColorPalette, colorPalette) => {
            if (err) {
                vscode.window.showInformationMessage("Error getting palette from image. Make sure the path is correct.");
            } else {
                ThemeyPanel._imageUrl = imageUrl;
                ThemeyPanel._colorPaletteOfImage = colorPalette;
                ThemeyPanel._generatedColorPalette = generatedColorPalette;
                ThemeyPanel.createOrShow(extensionPath);
            }
        });
    }

    public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
        ThemeyPanel.currentPanel = new ThemeyPanel(panel, extensionPath);
    }

    private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);

        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'resetTemplate':
                    // vscode.window.showErrorMessage(JSON.stringify(ThemeyPanel._generatedColorPalette));
                    vscode.window.showErrorMessage('resetTemplate');
                    // this._update();
                    return;
                case 'reloadUI':
                    themeGenerator.generateThemeFromTemplateValues(ThemeyPanel._generatedColorPalette);
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                    return;
                case 'updateTemplate':
                    this.setTitleBar('boo');
                    if(ThemeyPanel._generatedColorPalette) {
                        ThemeyPanel._generatedColorPalette[message.id] = message.text;
                        this._updateState();
                    }
                    return;
                case 'saveTheme':
                    Themey.PromptUserToSaveTheme(extensionPath, false);
                    return;
            }
        }, null, this._disposables);
    }

    public setTitleBar(titleText: string) {
        this._panel.webview.postMessage({
            command: 'updateTitle'
        });
    }

    public dispose() {
        ThemeyPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    
    private _updateState() {
        this._panel.webview.postMessage({
            command: 'updateState',
            state: JSON.stringify({
                imageUrl: ThemeyPanel._imageUrl,
                colorPaletteOfImage: ThemeyPanel._colorPaletteOfImage,
                generatedColorPalette: ThemeyPanel._generatedColorPalette
            })
        });
    }

    private _update() {
        this._panel.title = "Themey Update";
        this._panel.webview.html = this._getHtmlForWebview(ThemeyPanel._imageUrl, ThemeyPanel._colorPaletteOfImage, ThemeyPanel._generatedColorPalette);
        this._panel.webview.postMessage({
            command: 'updateState',
            state: JSON.stringify({
                imageUrl: ThemeyPanel._imageUrl,
                colorPaletteOfImage: ThemeyPanel._colorPaletteOfImage,
                generatedColorPalette: ThemeyPanel._generatedColorPalette
            })
        });
    }

    private _getHtmlForWebview(imageUrl, colorPaletteOfImage, generatedColorPalette) {

        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'src', 'main.js'));
        const scriptUri = scriptPathOnDisk.with({
            scheme: 'vscode-resource'
        });

        let width = '80';
        let horizontalColorPalette = '';
        let verticalColorPalette = '';
        let characterToApplyColorPaletteColorTo = String.fromCharCode(160);
        let generatedColorPaletteKeys = Object.keys(generatedColorPalette);

        Object.keys(colorPaletteOfImage).forEach(function (color) {
            horizontalColorPalette += `<span style="background-color:${colorPaletteOfImage[color]};width:16.667%;height:24px;display:inline-block;">${String.fromCharCode(160)}</span>`;
        });

        verticalColorPalette = `<ul style="width:${width}%;list-style-type:none;text-align:left;"`;
        Object.keys(generatedColorPalette).forEach(function (color) {
            let currentColorHexCode = `#${generatedColorPalette[color]}`;
            let liIconStyle = `style="background-color:${currentColorHexCode};display:inline;"`;
            // let customIcon = `&emsp;&emsp;&emsp;&emsp;`;
            let colorPicker = `<input id="${color}" type="color" value=${currentColorHexCode} onchange="onColorPaletteChange(this);"/>`;
            verticalColorPalette += `<li><p ${liIconStyle}>${colorPicker}</p><strong>&nbsp;${currentColorHexCode}</strong> - ${templateStrings[color]}</li>`;
        });
        verticalColorPalette += '</ul>';

        return `<!DOCTYPE html>
            <html>
               <head></head>
               <body>
                <h1 id="cringe" align="center">Themey</h1>
                <div align="center">
                 <img style="width:${width}%" src="${imageUrl}"/>
                 <p style="width:${width}%">${horizontalColorPalette}</p>
                 <button onclick="onClickReloadUI();">Reload UI</button>
                 <button onclick="onClickResetTemplate();">Reset Template</button>
                 <button onclick="postMessageToPanel('saveTheme');">Save Theme</button>
                 ${verticalColorPalette}
                </div>
                <script src="${scriptUri}"></script>
               </body>
            </html>`;
    }
}