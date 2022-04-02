import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

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
	const currentFilePath = vscode.window.activeTextEditor?.document.fileName;
	if (currentFilePath) {
		const stats = fs.statSync(currentFilePath);
		const modDate = getDateString(stats.mtime);
		const fileSize = getFileSize(stats.size);

		fileStatusBarItem.text = `$(file) ${path.basename(currentFilePath)}: ${fileSize} ${modDate}`;
		fileStatusBarItem.show();
	} else {
		fileStatusBarItem.hide();
	}
}

function getDateString (fileDate: Date):string {
	const curDate = new Date;
	if(curDate.toDateString() === fileDate.toDateString()){
		return fileDate.toLocaleTimeString();
	}
	return fileDate.toISOString().split("T")[0];
}

function getFileSize(fileSize: number):string {
	if (fileSize < 1024) {
		return `${fileSize.toString()}B`;
	}
	if (fileSize < 1024*1024) {
		return `${(fileSize/1024).toFixed(2)}KB`;
	}
	if (fileSize < 1024*1024*1024) {
		return `${(fileSize/ (1024*1024)).toFixed(2)}MB`;
	}
	return `${(fileSize/ (1024*1024*1024)).toFixed(2)}GB`;
}

export function deactivate() { }
