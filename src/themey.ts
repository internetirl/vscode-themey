import * as path from 'path';
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

    public static SaveTheme() {
        // TODO:
        // Load package.json
        // Get list of themes
        // Make sure theme doesn't already exist
        // If it does, prompt to overwrite?
        // Write theme entry to package json
        // Save
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