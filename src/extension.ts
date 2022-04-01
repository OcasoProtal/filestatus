import * as vscode from 'vscode';

let fileStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	// register the command that is invoked on status bar click
	const fileStatusCommandId = 'filestatus.fileStatus';

	let disposable = vscode.commands.registerCommand('filestatus.fileStatus', () => {
		console.log('clicked');
	});

	context.subscriptions.push(disposable);

	// create a new status bar item that we can now manage
	fileStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	fileStatusBarItem.command = fileStatusCommandId;
	context.subscriptions.push(fileStatusBarItem);

	// update status bar item once at start
	updateStatusBarItem();

}

function updateStatusBarItem(): void {
	fileStatusBarItem.text = 'Hello!';
	fileStatusBarItem.show();
}

export function deactivate() { }
