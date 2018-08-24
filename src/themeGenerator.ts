import * as path from 'path';
import {
    generateTheme,
    IColorSet
} from 'vscode-theme-generator';
import Vibrant = require('node-vibrant');

export interface Callback<T> {
    (err?: Error, result?: T): void;
}

export function generateThemesFromImage(image: string, location: string, cb?: Callback<string>) {

    let vibrant: string;
    let lightVibrant: string;
    let darkVibrant: string;
    let muted: string;
    let lightMuted: string;
    let darkMuted: string;

    const defaultColor: string = '#000000';

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

        let colorSet: IColorSet = {
            base: {
                background: '#1e1e1e',//darkMuted || defaultColor,
                foreground: lightMuted || defaultColor,
                color1: muted || defaultColor,
                color2: vibrant || defaultColor,
                color3: vibrant || defaultColor,
                color4: lightVibrant || defaultColor
            }
        };

        let themeName = 'Themey';
        generateTheme(themeName, colorSet, path.join(__dirname, '..', 'themes', 'themey.json'));

        themeName + ' Alt';
        colorSet.base.background = darkMuted;
        colorSet.base.foreground = lightMuted;
        colorSet.base.color1 = muted;
        colorSet.base.color2 = vibrant;
        colorSet.base.color3 = muted;
        colorSet.base.color4 = vibrant;
        generateTheme(themeName, colorSet, path.join(__dirname, '..', 'themes', 'themey-alt.json'));
        
        if(cb) {
            cb(undefined, "Successfully created themes.");
        }
    });
}