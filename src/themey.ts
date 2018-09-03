import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as themeGenerator from './themeGenerator';
import * as themeSummary from './themeSummary';
import {
    ThemeyPanel
} from './themeyPanel';

export class Themey {

    public static _extensionPath: string;

    public static Create(extensionPath: string) {
        Themey._extensionPath = extensionPath;
        ThemeyPanel.createOrShow(extensionPath);
    }

    public static CreateTheme() {
        // ThemeyPanel._imageUrl = "";
        // ThemeyPanel._colorPaletteOfImage = "";
        // ThemeyPanel._generatedColorPalette = _defaultTemplateValues;
        // ThemeyPanel.createOrShow(Themey._extensionPath);
    }

    public static GenerateThemeFromImage(imageUrl: string, extensionPath: string) {
        const themesDir = path.join(extensionPath, 'themes');
        themeGenerator.generateThemesFromImage(imageUrl, themesDir, (err: any, message: any, colorPalette: any) => {
            if (err) {
                vscode.window.showInformationMessage("Error getting palette from image. Make sure the path is correct.");
            } else {
                ThemeyPanel._imageUrl = imageUrl.trim();
                ThemeyPanel._colorPaletteOfImage = colorPalette;
                ThemeyPanel._generatedColorPalette = message;
                ThemeyPanel.createOrShow(extensionPath);
            }
        });
    }

    public static GenerateThemeFromBase16Palette(palette: string) {
        themeGenerator.generateThemeFromTemplateValues(palette);
    }

    public static ResetBase16Palette() {
        // TODO:
        // Save default template values file
        // Load default template values file
        // Overwrite instance of template values with default values
        // Show ThemeyPanel with new set of defaults
    }

    public static PromptUserToSaveTheme(extensionPath: string, overwrite ? : boolean) {
        let inputOpts = {
            placeHolder: 'Enter a name for the theme',
            prompt: 'Enter a name for the theme',
            ignoreFocusOut: true
        };
        vscode.window.showInputBox(inputOpts).then((name) => {
            if (!name || name === '') {
                return;
            }

            if (this.CheckIfThemeExists(name, extensionPath) && !overwrite) {
                const overwrite = 'Overwrite';
                const cancel = 'Cancel';
                vscode.window
                    .showInformationMessage('Theme already exists! Do you want to overwrite?', overwrite, cancel)
                    .then(selectedAction => {
                        if (selectedAction === overwrite) {
                            return;
                        }
                    });
            } else {
                let err = null;
                err = this.AddThemeToPackageJson(name, extensionPath);
                if (err) {
                    vscode.window.showErrorMessage('Failed to write package.json', err);
                }
                err = this.SaveTheme(name, extensionPath);
                if (err) {
                    vscode.window.showErrorMessage('Failed to write theme file.', err);
                }

                const reload = 'Reload';
                vscode.window.showInformationMessage(`Successfulled saved theme: Themey: ${name}`, reload)
                    .then(selectedAction => {
                        if (selectedAction === reload) {
                            vscode.commands.executeCommand('workbench.action.reloadWindow');
                        }
                    });
            }
        });
    }

    public static CheckIfThemeExists(themeName: string, extensionPath: string) {
        const packageJson = JSON.parse(fs.readFileSync(path.join(extensionPath, 'package.json'), 'utf-8'));
        if (packageJson.contributes && packageJson.contributes.themes) {
            let found = packageJson.contributes.themes.find(function (theme) {
                return theme.label === 'Themey: ' + themeName;
            });
            if (found) {
                return true;
            }
        }

        // file exists?

        return false;
    }

    public static AddThemeToPackageJson(themeName: string, extensionPath: string) {
        const themeyDisplayName = 'Themey: ' + themeName;
        const themeyFileName = 'themey-' + themeName + '.json';
        const packageJson = JSON.parse(fs.readFileSync(path.join(extensionPath, 'package.json'), 'utf-8'));
        const newTheme = {
            label: themeyDisplayName,
            uiTheme: 'vs-dark',
            path: './themes/' + themeyFileName
        };
        packageJson.contributes.themes.push(newTheme);

        try {
            fs.writeFileSync(path.resolve(extensionPath, 'package.json'), JSON.stringify(packageJson, null, 2));
        } catch (err) {
            return err.message;
        }
        return null;
    }

    public static SaveTheme(themeName: string, extensionPath: string) {
        const themeyFileName = 'themey-' + themeName + '.json';
        const fullThemePath = path.join(extensionPath, 'themes', themeyFileName);
        let generatedTheme = themeGenerator.generateThemeFromTemplateValues(ThemeyPanel._generatedColorPalette);
        try {
            fs.writeFileSync(fullThemePath, generatedTheme);
        } catch (err) {
            return err.message;
        }
        return null;
    }

    public static DeleteTheme() {
        // TODO:
        // Load package.json
        // Get list of themes
        // Present list to user
        // On selection, prompt for confirmation
        // Delete entry in list
        // Save
    }
}