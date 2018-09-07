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
    test("Generate theme from template values replaces values properly", function () {
        const fileName = '';
        const templateValues = {
            "base00-hex": "181818",
            "base01-hex": "282828",
            "base02-hex": "383838",
            "base03-hex": "585858",
            "base04-hex": "b8b8b8",
            "base05-hex": "d8d8d8",
            "base06-hex": "e8e8e8",
            "base07-hex": "f8f8f8",
            "base08-hex": "bb893f",
            "base09-hex": "d5c5ac",
            "base0A-hex": "ddc49f",
            "base0B-hex": "a38547",
            "base0C-hex": "bb893f",
            "base0D-hex": "bfa688",
            "base0E-hex": "bb893f",
            "base0F-hex": "000000"
        };
        const rendered = JSON.parse(themeGenerator.generateThemeFromTemplateValues(templateValues, fileName));

        assert.notEqual(undefined, rendered);
        assert.equal('#' + templateValues["base00-hex"], rendered.colors["widget.shadow"]);
        assert.equal('#' + templateValues["base01-hex"], rendered.colors["button.background"]);
        assert.equal('#' + templateValues["base02-hex"], rendered.colors["scrollbarSlider.background"]);
        assert.equal('#' + templateValues["base03-hex"], rendered.colors["scrollbarSlider.hoverBackground"]);
        assert.equal('#' + templateValues["base04-hex"], rendered.colors["scrollbarSlider.activeBackground"]);
        assert.equal('#' + templateValues["base05-hex"], rendered.colors["input.foreground"]);
        assert.equal('#' + templateValues["base06-hex"], rendered.colors["terminal.ansiWhite"]);
        assert.equal('#' + templateValues["base07-hex"], rendered.colors["list.dropBackground"]);
        assert.equal('#' + templateValues["base08-hex"], rendered.colors["inputValidation.errorBorder"]);
        assert.equal('#' + templateValues["base09-hex"], rendered.colors["inputOption.activeBorder"]);
        assert.equal('#' + templateValues["base0A-hex"], rendered.colors["inputValidation.warningBorder"]);
        assert.equal('#' + templateValues["base0B-hex"], rendered.colors["editorOverviewRuler.addedForeground"]);
        assert.equal('#' + templateValues["base0C-hex"], rendered.colors["editorInfo.foreground"]);
        assert.equal('#' + templateValues["base0D-hex"], rendered.colors["editorSuggestWidget.highlightForeground"]);
        assert.equal('#' + templateValues["base0E-hex"], rendered.colors["editorGutter.modifiedBackground"]);
        assert.equal('#' + templateValues["base0F-hex"], rendered.colors["editorOverviewRuler.commonContentForeground"]);
    });

    test("Get color palette from image returns valid palette", function () {
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
    test("Invalid image returns error", function () {
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