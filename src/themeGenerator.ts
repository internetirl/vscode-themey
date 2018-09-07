import * as path from 'path';
import * as fs from 'fs';
import {
    generateTheme,
    IColorSet
} from 'vscode-theme-generator';
import Vibrant = require('node-vibrant');
import * as Mustache from 'mustache';
import * as ColorHelper from './colorHelper';
import {
    Color
} from 'vscode';
let cjson = require('strip-json-comments');

export interface Callback < T > {
    (err ? : Error, result ? : T, colorPalette ? : T): void;
}

export interface CustomThemeCallback {
    (templateValues: any): any;
}

export interface ColorPalette {
    Vibrant: string,
        LightVibrant: string,
        DarkVibrant: string,
        Muted: string,
        LightMuted: string,
        DarkMuted: string
};

// Generate a theme from an in-memory object. This takes the object that contains the base16 color values
// and inserts them into the default theme template.
export function generateThemeFromTemplateValues(templateValues: any, fileName ? : string) {
    const themeyFileName = fileName ? fileName : 'themey-16colors.json';
    let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));
    let rendered = Mustache.render(templateFile, templateValues);
    return rendered;
    // TODO: Return rendered instead of overwriting?
    fs.writeFileSync(path.resolve(__dirname, '..', 'themes', themeyFileName), rendered);
}

export function saveThemeFile(fileName: string, renderedTheme: string) {
    fs.writeFileSync(path.resolve(__dirname, '..', 'themes', fileName), renderedTheme);
}

export function generateCustomTheme(themeValues: CustomThemeCallback) {
    // Read in the default values for Base0 -> Base7
    let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
    // Read in the theme template
    let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));

    // if cb
    // pass them the data
    if (themeValues) {
        templateValues = themeValues(templateValues);
    }

    // Write the new theme with our templateValues
    let rendered = Mustache.render(templateFile, templateValues);

    // Write the new values
    //fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), JSON.stringify(templateValues, null, 2));
    // Save the theme
    fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'themey-16colors.json'), rendered);
}

export function generateCustomThemeRandomize(image: string, location: string, cb ? : Callback < ColorPalette > ) {
    getColorPaletteFromImage(image, (err, palette) => {
        generateCustomTheme((templateValues: any) => {
            Object.keys(templateValues).forEach((key, index) => {
                if (index < 8) {
                    let currentValue = ((8 - index) / 8); // 0->1
                    currentValue = currentValue <= 0.5 ? (0.75 - (currentValue * 1.5)) * -1 : (currentValue * 1.5) - 0.75;
                    templateValues[key] = ColorHelper.shadeColor(palette.Vibrant, currentValue);
                }
            });
            return templateValues;
        });
    });
}

export function generateRandomThemeBase16(palette: ColorPalette) {
    let colors = [];
    Object.keys(palette).forEach((key) => {
        palette[key] = palette[key].replace('#', '');
        colors.push(palette[key]);
    });

    let generatedColorPalette;
    generateCustomTheme((templateValues: any) => {
        // apply the colors randomly
        // 6 colors
        let randomModifier = Math.floor(Math.random() * Math.floor(6));
        Object.keys(templateValues).forEach((key, index) => {
            if (index >= 8) {
                let newIndex = (index + randomModifier) % 6;
                templateValues[key] = colors[newIndex];
            }
        });
        generatedColorPalette = templateValues;
        return templateValues;

    });
    return generatedColorPalette;
}

export function generateCustomThemeBase16(palette: ColorPalette) {
    Object.keys(palette).forEach((key) => {
        palette[key] = palette[key].replace('#', '');
    });

    let generatedColorPalette;
    generateCustomTheme((templateValues: any) => {

        // palette
        // templateValues
        //         // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
        //         templateValues["base08-hex"] = vibrant;
        //         //  Integers, Boolean, Constants, XML Attributes, Markup Link Url
        //         templateValues["base09-hex"] = lightMuted;
        //         //  Classes, Markup Bold, Search Text Background
        //         templateValues["base0A-hex"] = offVibrant3;
        //         // Strings, Inherited Class, Markup Code, Diff Inserted
        //         templateValues["base0B-hex"] = lightVibrant;
        //         // Support, Regular Expressions, Escape Characters, Markup Quotes
        //         templateValues["base0C-hex"] = vibrant;
        //         //  Functions, Methods, Attribute IDs, Headings
        //         templateValues["base0D-hex"] = muted;
        //         //  Keywords, Storage, Selector, Markup Italic, Diff Changed
        //         templateValues["base0E-hex"] = vibrant;
        //         // Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
        //         templateValues["base0F-hex"] = "000000";
        let template = 'bempplate';
        const boo = 1;

        templateValues['base08-hex'] = palette.LightMuted;
        templateValues['base09-hex'] = palette.DarkMuted;
        templateValues['base0A-hex'] = palette.Vibrant;
        templateValues['base0B-hex'] = palette.LightVibrant;
        templateValues['base0C-hex'] = palette.Vibrant;
        templateValues['base0D-hex'] = palette.Vibrant;
        templateValues['base0E-hex'] = palette.DarkVibrant;
        generatedColorPalette = templateValues;

        return templateValues;
    });
    return generatedColorPalette;
}

export function GenerateBasicAndBase16ThemesFromImage(image: string, themesDir: string, cb ? : Callback < ColorPalette > ) {
    getColorPaletteFromImage(image, (err, colorPaletteOfImage) => {
        if (err && cb) {
            cb(err, null);
        }
        generateBasicThemes(themesDir, colorPaletteOfImage);
        // let generatedColorPalette = generateBase16Theme(themesDir, colorPaletteOfImage);
        let generatedColorPalette = generateRandomThemeBase16(colorPaletteOfImage);
        
        // let generatedColorPalette = generateCustomThemeBase16(colorPaletteOfImage);

        if (cb) {
            cb(undefined, generatedColorPalette, colorPaletteOfImage);
        }
    });
}

export function getColorPaletteFromImage(imageUrl: string, paletteGeneratorCallback ? : Callback < ColorPalette > ) {
    const defaultColor: string = '#d0d0d0';
    Vibrant.from(imageUrl).getPalette((err, palette) => {
        if (err && paletteGeneratorCallback) {
            paletteGeneratorCallback(err, null);
        }

        let colorPalette = {
            Vibrant: palette.Vibrant ? palette.Vibrant.getHex() : defaultColor,
            LightVibrant: palette.LightVibrant ? palette.LightVibrant.getHex() : defaultColor,
            DarkVibrant: palette.DarkVibrant ? palette.DarkVibrant.getHex() : defaultColor,
            Muted: palette.Muted ? palette.Muted.getHex() : defaultColor,
            LightMuted: palette.LightMuted ? palette.LightMuted.getHex() : defaultColor,
            DarkMuted: palette.DarkMuted ? palette.DarkMuted.getHex() : defaultColor
        };

        if (paletteGeneratorCallback) {
            paletteGeneratorCallback(null, colorPalette);
        }
    });
}

function generateBasicThemes(location: string, palette: ColorPalette) {
    const defaultColor: string = '#d0d0d0';
    const defaultThemeName = 'Themey';
    const defaultThemeFileName = 'themey.json';
    const altThemeName = 'Themey Alt';
    const altThemeFileName = 'themey-alt.json';

    let colorSet: IColorSet = {
        base: {
            background: '#1e1e1e',
            foreground: palette.LightMuted,
            color1: palette.Muted,
            color2: palette.Vibrant,
            color3: palette.Vibrant,
            color4: palette.LightVibrant
        }
    };
    generateTheme(defaultThemeName, colorSet, path.join(location, defaultThemeFileName));

    colorSet.base.background = palette.DarkMuted;
    colorSet.base.foreground = palette.LightMuted;
    colorSet.base.color1 = palette.Muted;
    colorSet.base.color2 = palette.Vibrant;
    colorSet.base.color3 = palette.Muted;
    colorSet.base.color4 = palette.Vibrant;
    generateTheme(altThemeName, colorSet, path.join(location, altThemeFileName));
}

function generateBase16Theme(location: string, palette: ColorPalette) {
    const vsCodeExtensionDir = '';
    const templateValuesFile = 'templateValues.json';
    const themeTemplateFile = 'default.json';

    // Strip the # from the hex values
    Object.keys(palette).forEach((key) => {
        palette[key] = palette[key].replace('#', '');
    });


    // Read in the default values for Base0 -> Base7
    let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
    // Read in the theme template (skipping the comments in the file)
    let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));

    // These are for the VSCode interface. Let's keep a default 
    // palette for VSCode's UI (black->white) and build ontop of it.
    // templateValues["base00-hex"] = "basehex";
    // templateValues["base01-hex"] = "basehex";
    // templateValues["base02-hex"] = "basehex";
    // templateValues["base03-hex"] = "basehex";
    // templateValues["base04-hex"] = "basehex";
    // templateValues["base05-hex"] = "basehex";
    // templateValues["base06-hex"] = "basehex";
    // templateValues["base07-hex"] = "basehex";

    let offVibrant = ColorHelper.shadeColor(palette.Vibrant, 0.2);
    let offVibrant1 = ColorHelper.shadeColor(palette.Vibrant, 0.3);
    let offVibrant2 = ColorHelper.shadeColor(palette.Vibrant, 0.4);
    let offVibrant3 = ColorHelper.shadeColor(palette.Vibrant, 0.5);

    // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
    templateValues["base08-hex"] = palette.Vibrant;
    //  Integers, Boolean, Constants, XML Attributes, Markup Link Url
    templateValues["base09-hex"] = palette.LightMuted;
    //  Classes, Markup Bold, Search Text Background
    templateValues["base0A-hex"] = offVibrant3;
    // Strings, Inherited Class, Markup Code, Diff Inserted
    templateValues["base0B-hex"] = palette.LightVibrant;
    // Support, Regular Expressions, Escape Characters, Markup Quotes
    templateValues["base0C-hex"] = palette.Vibrant;
    //  Functions, Methods, Attribute IDs, Headings
    templateValues["base0D-hex"] = palette.Muted;
    //  Keywords, Storage, Selector, Markup Italic, Diff Changed
    templateValues["base0E-hex"] = palette.Vibrant;
    // Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
    templateValues["base0F-hex"] = "000000";

    // Write the new theme with our templateValues
    let rendered = Mustache.render(templateFile, templateValues);

    // Write the new values
    //fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), JSON.stringify(templateValues, null, 2));
    // Save the theme
    fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'themey-16colors.json'), rendered);

    return templateValues;
}

// export function generateThemesFromImage(image: string, location: string, cb ? : Callback < ColorPalette > ) {

//     let vibrant: string;
//     let lightVibrant: string;
//     let darkVibrant: string;
//     let muted: string;
//     let lightMuted: string;
//     let darkMuted: string;
//     const defaultColor: string = '#d0d0d0';

//     Vibrant.from(image).getPalette((err: any, palette: any) => {
//         if (err && cb) {
//             cb(err, undefined);
//         }

//         vibrant = palette.Vibrant ? palette.Vibrant.getHex() : defaultColor;
//         lightVibrant = palette.LightVibrant ? palette.LightVibrant.getHex() : defaultColor;
//         darkVibrant = palette.DarkVibrant ? palette.DarkVibrant.getHex() : defaultColor;
//         muted = palette.Muted ? palette.Muted.getHex() : defaultColor;
//         lightMuted = palette.LightMuted ? palette.LightMuted.getHex() : defaultColor;
//         darkMuted = palette.DarkMuted ? palette.DarkMuted.getHex() : defaultColor;

//         let colorPalette = {
//             vibrant: vibrant,
//             lightVibrant: lightVibrant,
//             darkVibrant: darkVibrant,
//             muted: muted,
//             lightMuted: lightMuted,
//             darkMuted: darkMuted
//         };

//         let colorSet: IColorSet = {
//             base: {
//                 background: '#1e1e1e', //darkMuted || defaultColor,
//                 foreground: lightMuted || defaultColor,
//                 color1: muted || defaultColor,
//                 color2: vibrant || defaultColor,
//                 color3: vibrant || defaultColor,
//                 color4: lightVibrant || defaultColor
//             }
//         };

//         let defaultThemeName = 'Themey';
//         generateTheme(defaultThemeName, colorSet, path.join(location, 'themey.json'));

//         let altThemeName = defaultThemeName + ' Alt';
//         colorSet.base.background = darkMuted;
//         colorSet.base.foreground = lightMuted;
//         colorSet.base.color1 = muted;
//         colorSet.base.color2 = vibrant;
//         colorSet.base.color3 = muted;
//         colorSet.base.color4 = vibrant;
//         generateTheme(altThemeName, colorSet, path.join(location, 'themey-alt.json'));

//         // Exploratory
//         let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
//         let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));

//         // Set values off of base templateFile
//         // templateValues["base00-hex"] = "basehex";
//         // templateValues["base01-hex"] = "basehex";
//         // templateValues["base02-hex"] = "basehex";
//         // templateValues["base03-hex"] = "basehex";
//         // templateValues["base04-hex"] = "basehex";
//         // templateValues["base05-hex"] = "basehex";
//         // templateValues["base06-hex"] = "basehex";
//         // templateValues["base07-hex"] = "basehex";
//         vibrant = vibrant.replace('#', '');
//         muted = muted.replace('#', '');
//         lightMuted = lightMuted.replace('#', '');
//         darkMuted = darkMuted.replace('#', '');
//         lightVibrant = lightVibrant.replace('#', '');
//         darkVibrant = darkVibrant.replace('#', '');

//         let offVibrant = ColorHelper.shadeColor(vibrant, 0.2);
//         let offVibrant1 = ColorHelper.shadeColor(vibrant, 0.3);
//         let offVibrant2 = ColorHelper.shadeColor(vibrant, 0.4);
//         let offVibrant3 = ColorHelper.shadeColor(vibrant, 0.5);

//         // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
//         templateValues["base08-hex"] = vibrant;
//         //  Integers, Boolean, Constants, XML Attributes, Markup Link Url
//         templateValues["base09-hex"] = lightMuted;
//         //  Classes, Markup Bold, Search Text Background
//         templateValues["base0A-hex"] = offVibrant3;
//         // Strings, Inherited Class, Markup Code, Diff Inserted
//         templateValues["base0B-hex"] = lightVibrant;
//         // Support, Regular Expressions, Escape Characters, Markup Quotes
//         templateValues["base0C-hex"] = vibrant;
//         //  Functions, Methods, Attribute IDs, Headings
//         templateValues["base0D-hex"] = muted;
//         //  Keywords, Storage, Selector, Markup Italic, Diff Changed
//         templateValues["base0E-hex"] = vibrant;
//         // Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
//         templateValues["base0F-hex"] = "000000";

//         let rendered = Mustache.render(templateFile, templateValues);

//         // Write the new values
//         fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), JSON.stringify(templateValues, null, 2));
//         // Save the theme
//         fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'themey-16colors.json'), rendered);

//         if (cb) {
//             cb(undefined, templateValues, colorPalette);
//         }
//     });
// }