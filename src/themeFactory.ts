import {
    ColorPalette,
    VibrantDarkThemeGenerator,
    VibrantDarkMutedThemeGenerator,
    Base16ThemeGenerator
} from './themeGenerator';
import * as path from 'path';

class ThemeFactory {
    static GenerateTheme(type: string, colorPalette: ColorPalette, extensionPath: string) : void {
        let themesDir = path.resolve(extensionPath, 'themes');
        if(type === 'Vibrant Dark') {
            return new VibrantDarkThemeGenerator().GenerateTheme('Themey', colorPalette, path.resolve(themesDir, 'themey.json'));
        } else if(type === 'Vibrant Dark Muted') {
            return new VibrantDarkMutedThemeGenerator().GenerateTheme('Themey Alt', colorPalette, path.resolve(themesDir, 'themey-alt.json'));
        } else if (type === 'Base 16') {
            return new Base16ThemeGenerator().GenerateTheme('Themey Custom', colorPalette, path.resolve(themesDir, 'themey-custom.json'));
        } else {
            return null;
        }
    } 
}