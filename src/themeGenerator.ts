import * as path from 'path';
import * as fs from 'fs';
import {
    generateTheme,
    IColorSet
} from 'vscode-theme-generator';
import Vibrant = require('node-vibrant');
import * as Mustache from 'mustache';
let cjson = require('strip-json-comments');

export interface Callback < T > {
    (err ? : Error, result ? : T, colorPalette ? : T): void;
}

function shadeColor2(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function generateThemeFromTemplateValues(templateUpdate) {
       let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
       Object.keys(templateUpdate).forEach(function(key) {
            templateValues[key] = templateUpdate[key];
       });
       let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));
       let rendered = Mustache.render(templateFile, templateValues);
       fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), JSON.stringify(templateValues, null, 2));
       fs.writeFileSync(path.resolve(__dirname, '..', 'themes', 'themey-16colors.json'), rendered);
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

        vibrant      = palette.Vibrant      ? palette.Vibrant.getHex()      : defaultColor;
        lightVibrant = palette.LightVibrant ? palette.LightVibrant.getHex() : defaultColor;
        darkVibrant  = palette.DarkVibrant  ? palette.DarkVibrant.getHex()  : defaultColor;
        muted        = palette.Muted        ? palette.Muted.getHex()        : defaultColor;
        lightMuted   = palette.LightMuted   ? palette.LightMuted.getHex()   : defaultColor;
        darkMuted    = palette.DarkMuted    ? palette.DarkMuted.getHex()    : defaultColor;

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
        
        // let lightTheme = defaultThemeName + " Light";
        // colorSet.type = "light";
        // colorSet.base.background = lightMuted;
        // colorSet.base.foreground = darkMuted;
        // generateTheme(lightTheme, colorSet, path.join(location, 'themey-light.json'));

        // Exploratory
        let templateValues = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'templateValues.json'), 'utf-8'));
        let templateFile = cjson(fs.readFileSync(path.resolve(__dirname, '..', 'themes', 'default.json'), 'utf-8'));

        // Set values off of base templateFile
        templateValues["scheme-name"] = "basehex";
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

        let offVibrant = shadeColor2('#' + vibrant, 0.2).replace('#', '');
        let offVibrant1 = shadeColor2('#' + vibrant, 0.3).replace('#', '');
        let offVibrant2 = shadeColor2('#' + vibrant, 0.4).replace('#', '');
        let offVibrant3 = shadeColor2('#' + vibrant, 0.5).replace('#', '');

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