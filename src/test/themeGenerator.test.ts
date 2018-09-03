//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as themeGenerator from '../themeGenerator';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite("Theme Generator", function () {
    test("Get color palette from image returns valid palette", function() {
        themeGenerator.getColorPaletteFromImage('../../images/2001.png', (err, colorPalette) => {
           assert.equal(err, null);
           assert.notEqual(undefined, colorPalette.Vibrant);
           assert.notEqual(undefined, colorPalette.LightVibrant);
           assert.notEqual(undefined, colorPalette.DarkVibrant);
           assert.notEqual(undefined, colorPalette.Muted);
           assert.notEqual(undefined, colorPalette.LightMuted);
           assert.notEqual(undefined, colorPalette.DarkMuted);
        });
    });
    test("Invalid image returns error", function() {
        themeGenerator.getColorPaletteFromImage('', (err, colorPalette) => {
           assert.notEqual(err, null);
           assert.equal(undefined, colorPalette.Vibrant);
           assert.equal(undefined, colorPalette.LightVibrant);
           assert.equal(undefined, colorPalette.DarkVibrant);
           assert.equal(undefined, colorPalette.Muted);
           assert.equal(undefined, colorPalette.LightMuted);
           assert.equal(undefined, colorPalette.DarkMuted);
        });
    });
});