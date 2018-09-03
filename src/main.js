const vscode = acquireVsCodeApi();

function onColorPaletteChange(item) {
    vscode.postMessage({
        command: 'updateTemplate',
        text: item.value.replace('#', ''),
        id: item.id
    });
    document.getElementById(item.id).value = item.value;
}

function onClickReloadUI() {
    vscode.postMessage({
        command: 'reloadUI'
    });
}

function onClickResetTemplate() {
    vscode.postMessage({
        command: 'resetTemplate'
    });
}

var count = 0;
window.addEventListener('message', event => {
    const message = event.data;
    switch(message.command) {
        case 'updateState':
            document.getElementById('cringe').innerHTML = message.state;
            let state = JSON.parse(message.state);
            vscode.setState(state);
            let newState = vscode.getState();
            document.getElementById('cringe').innerHTML = 'new state: ' + JSON.stringify(newState);
            break;
        case 'updatePalette':
            document.getElementById('cringe').innerHTML = "updatePalette";
            break;
        case 'updateTitle':
            count++;
            document.getElementById('cringe').innerHTML = "set from panel " + count;
            break;
    }
});