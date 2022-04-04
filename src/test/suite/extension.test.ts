import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension loaded', () => {
		assert.notStrictEqual(undefined, vscode.extensions.getExtension('ocasoprotal.filestatus'));
	});
	test('Display file name is not set', () => {
		assert.strictEqual(false, vscode.workspace.getConfiguration('fileStatus').get('displayFileName'));
	});
	test('Display file size is set', () => {
		assert.strictEqual(true, vscode.workspace.getConfiguration('fileStatus').get('displayFileSize'));
	});
	test('Display file modification time is set', () => {
		assert.strictEqual(true, vscode.workspace.getConfiguration('fileStatus').get('displayFileModificationTime'));
	});
});
