import * as path from 'path';
import * as fs from 'fs';
import {
    generateTheme,
    IColorSet
} from 'vscode-theme-generator';
import Vibrant = require('node-vibrant');
import * as Mustache from 'mustache';
import * as ColorHelper from './colorHelper';
let cjson = require('strip-json-comments');

export interface Callback < T > {
    (err ? : Error, result ? : T, colorPalette ? : T): void;
}

// Generate a theme from an in-memory object. This takes the object that contains the base16 color values
// and inserts them into the default theme template.
export function generateThemeFromTemplateValues(templateValues) {
    //    let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
    //    Object.keys(templateUpdate).forEach(function(key) {
    //         templateValues[key] = templateUpdate[key];
    //    });
    let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));
    let rendered = Mustache.render(templateFile, templateValues);
    //    let rendered = Mustache.render(templateFile, templateValues);
    //    fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), JSON.stringify(templateValues, null, 2));
    fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'themey-16colors.json'), rendered);
}

export function generateBase16Theme(palette: any) {
    // Read in the default values for Base0 -> Base7
    let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
    // Read in the theme template
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

    let offVibrant = ColorHelper.shadeColor(vibrant, 0.2);
    let offVibrant1 = ColorHelper.shadeColor(vibrant, 0.3);
    let offVibrant2 = ColorHelper.shadeColor(vibrant, 0.4);
    let offVibrant3 = ColorHelper.shadeColor(vibrant, 0.5);

    // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
    templateValues["base08-hex"] = palette.vibrant;
    //  Integers, Boolean, Constants, XML Attributes, Markup Link Url
    templateValues["base09-hex"] = palette.lightMuted;
    //  Classes, Markup Bold, Search Text Background
    templateValues["base0A-hex"] = offVibrant3;
    // Strings, Inherited Class, Markup Code, Diff Inserted
    templateValues["base0B-hex"] = palette.lightVibrant;
    // Support, Regular Expressions, Escape Characters, Markup Quotes
    templateValues["base0C-hex"] = palette.vibrant;
    //  Functions, Methods, Attribute IDs, Headings
    templateValues["base0D-hex"] = palette.muted;
    //  Keywords, Storage, Selector, Markup Italic, Diff Changed
    templateValues["base0E-hex"] = palette.vibrant;
    // Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
    templateValues["base0F-hex"] = "000000";

    // Write the new theme with our templateValues
    let rendered = Mustache.render(templateFile, templateValues);

    // Write the new values
    fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), JSON.stringify(templateValues, null, 2));
    // Save the theme
}

export function generateThemesFromImage(image: string, location: string, cb ? : Callback < string > ) {

    let vibrant: string;
    let lightVibrant: string;
    let darkVibrant: string;
    let muted: string;
    let lightMuted: string;
    let darkMuted: string;

    const defaultColor: string = '#d0d0d0';

    Vibrant.from(image).getPalette((err: any, palette: any) => {
        if (err && cb) {
            cb(err, undefined);
        }

        vibrant = palette.Vibrant ? palette.Vibrant.getHex() : defaultColor;
        lightVibrant = palette.LightVibrant ? palette.LightVibrant.getHex() : defaultColor;
        darkVibrant = palette.DarkVibrant ? palette.DarkVibrant.getHex() : defaultColor;
        muted = palette.Muted ? palette.Muted.getHex() : defaultColor;
        lightMuted = palette.LightMuted ? palette.LightMuted.getHex() : defaultColor;
        darkMuted = palette.DarkMuted ? palette.DarkMuted.getHex() : defaultColor;

        let colorPalette = {
            vibrant: vibrant,
            lightVibrant: lightVibrant,
            darkVibrant: darkVibrant,
            muted: muted,
            lightMuted: lightMuted,
            darkMuted: darkMuted
        };

        let colorSet: IColorSet = {
            base: {
                background: '#1e1e1e', //darkMuted || defaultColor,
                foreground: lightMuted || defaultColor,
                color1: muted || defaultColor,
                color2: vibrant || defaultColor,
                color3: vibrant || defaultColor,
                color4: lightVibrant || defaultColor
            }
        };

        let defaultThemeName = 'Themey';
        generateTheme(defaultThemeName, colorSet, path.join(location, 'themey.json'));

        let altThemeName = defaultThemeName + ' Alt';
        colorSet.base.background = darkMuted;
        colorSet.base.foreground = lightMuted;
        colorSet.base.color1 = muted;
        colorSet.base.color2 = vibrant;
        colorSet.base.color3 = muted;
        colorSet.base.color4 = vibrant;
        generateTheme(altThemeName, colorSet, path.join(location, 'themey-alt.json'));

        // Exploratory
        let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
        let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));

        // Set values off of base templateFile
        // templateValues["base00-hex"] = "basehex";
        // templateValues["base01-hex"] = "basehex";
        // templateValues["base02-hex"] = "basehex";
        // templateValues["base03-hex"] = "basehex";
        // templateValues["base04-hex"] = "basehex";
        // templateValues["base05-hex"] = "basehex";
        // templateValues["base06-hex"] = "basehex";
        // templateValues["base07-hex"] = "basehex";
        vibrant = vibrant.replace('#', '');
        muted = muted.replace('#', '');
        lightMuted = lightMuted.replace('#', '');
        darkMuted = darkMuted.replace('#', '');
        lightVibrant = lightVibrant.replace('#', '');
        darkVibrant = darkVibrant.replace('#', '');

        let offVibrant = ColorHelper.shadeColor(vibrant, 0.2);
        let offVibrant1 = ColorHelper.shadeColor(vibrant, 0.3);
        let offVibrant2 = ColorHelper.shadeColor(vibrant, 0.4);
        let offVibrant3 = ColorHelper.shadeColor(vibrant, 0.5);

        // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
        templateValues["base08-hex"] = vibrant;
        //  Integers, Boolean, Constants, XML Attributes, Markup Link Url
        templateValues["base09-hex"] = lightMuted;
        //  Classes, Markup Bold, Search Text Background
        templateValues["base0A-hex"] = offVibrant3;
        // Strings, Inherited Class, Markup Code, Diff Inserted
        templateValues["base0B-hex"] = lightVibrant;
        // Support, Regular Expressions, Escape Characters, Markup Quotes
        templateValues["base0C-hex"] = vibrant;
        //  Functions, Methods, Attribute IDs, Headings
        templateValues["base0D-hex"] = muted;
        //  Keywords, Storage, Selector, Markup Italic, Diff Changed
        templateValues["base0E-hex"] = vibrant;
        // Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
        templateValues["base0F-hex"] = "000000";

        let rendered = Mustache.render(templateFile, templateValues);

        // Write the new values
        fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), JSON.stringify(templateValues, null, 2));
        // Save the theme
        fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'themey-16colors.json'), rendered);

        if (cb) {
            cb(undefined, templateValues, colorPalette);
        }
    });
}