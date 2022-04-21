import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { toIsoStringShort } from './helper';

let fileStatusBarItem: vscode.StatusBarItem;
let state: vscode.Memento;

export function activate(context: vscode.ExtensionContext) {
	// register the command that is invoked on status bar click
	const fileStatusCommandId = 'pmfilestatus.fileStatus';
	state = context.workspaceState;

	let disposable = vscode.commands.registerCommand('pmfilestatus.fileStatus', () => {
		updateStatusBarItem();
	});

	context.subscriptions.push(disposable);

	// create a new status bar item that we can now manage
	fileStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	fileStatusBarItem.command = fileStatusCommandId;
	context.subscriptions.push(fileStatusBarItem);

	// register some listener that make sure the status bar item always up-to-date
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(updateStatusBarItem));
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(updateStatusBarItemNoFile));

	// update status bar item once at start
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	const currentFilePath = vscode.window.activeTextEditor?.document.fileName;
	if (currentFilePath && fs.existsSync(currentFilePath)) {
		setFileStatusText(currentFilePath);
		fileStatusBarItem.show();
	} else if (currentFilePath) {
		setFileStatusTextMinimal(currentFilePath);
		fileStatusBarItem.show();
	} else {
		fileStatusBarItem.hide();
	}
}

function updateStatusBarItemNoFile(): void {
	const currentFilePath = vscode.window.activeTextEditor?.document.fileName;
	if (currentFilePath && fs.existsSync(currentFilePath)) {
		return;
	}
	else if (currentFilePath) {
		state.update(currentFilePath, new Date());
		setFileStatusTextMinimal(currentFilePath);
		fileStatusBarItem.show();
	}
}

function setFileStatusText(currentFilePath: string): void {
	const stats = fs.statSync(currentFilePath);
	const modDate = getDateString(stats.mtime);
	const fileSize = getFileSize(stats.size);
	var text = `$(file) `;
	if (vscode.workspace.getConfiguration('pmFileStatus').get('displayFileName')) {
		text += `${path.basename(currentFilePath)} `;
	}
	if (vscode.workspace.getConfiguration('pmFileStatus').get('displayFileSize')) {
		text += `${fileSize} `;
	}
	if (vscode.workspace.getConfiguration('pmFileStatus').get('displayFileModificationTime')) {
		text += `${modDate} `;
	}
	fileStatusBarItem.text = text;
	fileStatusBarItem.tooltip = `Full path: ${currentFilePath}\nFile Size: ${stats.size}\nLast modified: ${toIsoStringShort(stats.mtime)}\nClick to refresh`;
}

function setFileStatusTextMinimal(currentFilePath: string): void {
	var text = `$(file) `;
	let modDate = state.get<Date>(currentFilePath);
	if (typeof modDate === 'string') {
		modDate = new Date(modDate);
	}
	if (modDate instanceof Date) {
		if (vscode.workspace.getConfiguration('pmFileStatus').get('displayFileModificationTime')) {
			text += `${getDateString(modDate)} `;
		}
		fileStatusBarItem.tooltip = `${currentFilePath}\nLast modified: ${toIsoStringShort(modDate)}\nClick to refresh`;
	} else {
		fileStatusBarItem.tooltip = ``;
	}
	fileStatusBarItem.text = text;
}

function getDateString(fileDate: Date): string {
	const curDate = new Date;
	if (curDate.toDateString() === fileDate.toDateString()) {
		return fileDate.toLocaleTimeString();
	}
	return fileDate.toISOString().split("T")[0];
}

function getFileSize(fileSize: number): string {
	if (fileSize < 1024) {
		return `${fileSize.toString()}B`;
	}
	if (fileSize < 1024 * 1024) {
		return `${(fileSize / 1024).toFixed(2)}KB`;
	}
	if (fileSize < 1024 * 1024 * 1024) {
		return `${(fileSize / (1024 * 1024)).toFixed(2)}MB`;
	}
	return `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}

export function deactivate() { }
