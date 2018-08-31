import * as vscode from 'vscode';

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

interface ColorPalette {
}

function onColorPaletteChange(item) {
    vscode.postMessage({
        command: 'alert',
        text: item.value
    });
}

 export function getThemeSummary(imageUrl, colorPaletteOfImage, generatedColorPalette) {

    let width = '60';
    let horizontalColorPalette = ''; 
    let verticalColorPalette = '';
    let characterToApplyColorPaletteColorTo = String.fromCharCode(160);
    let generatedColorPaletteKeys = Object.keys(generatedColorPalette);

    Object.keys(colorPaletteOfImage).forEach(function (color) {
        horizontalColorPalette += `<span style="background-color:${colorPaletteOfImage[color]};width:16.667%;height:24px;display:inline-block;">${String.fromCharCode(160)}</span>`;
    });

    verticalColorPalette = `<ul style="width:${width}%;list-style-type:none;text-align:left;"`; 
    Object.keys(generatedColorPalette).forEach(function (color) {
        if(color === 'scheme-name') {
            return;
        }
        let currentColorHexCode = `#${generatedColorPalette[color]}`;
        let liIconStyle = `style="background-color:${currentColorHexCode};display:inline;"`;
        let customIcon = `&emsp;&emsp;&emsp;&emsp;`;
        let colorPicker = `<input id="${color}" type="color" value=${currentColorHexCode} onchange="onColorPaletteChange(this);"/>`;
        verticalColorPalette += `<li><p ${liIconStyle}>${colorPicker}${customIcon}</p><strong>&nbsp;${currentColorHexCode}</strong> - ${templateStrings[color]}</li>`; 
    });
    verticalColorPalette += '</ul>';

                        // const vscode = acquireVsCodeApi();
    return `<!DOCTYPE html>
            <html>
               <head></head>
               <body >
                <h1 id="cringe" align="center">Themey</h1>
                <div align="center">
                 <img style="width:${width}%" src="${imageUrl}"/>
                 <p style="width:${width}%">${horizontalColorPalette}</p>
                 <button onclick="onColorPaletteChange();">click</button>
                 ${verticalColorPalette}
                </div>
                <script>
                    function onColorPaletteChange(item) {
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({
                            command: 'updateTemplate',
                            text: item.value,
                            id: item.id
                        });
                        document.getElementById("cringe").innerHTML = "Themey Update";
                    }
                </script>
               </body>
            </html>`; 
 }