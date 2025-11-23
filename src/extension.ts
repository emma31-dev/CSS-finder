import * as vscode from 'vscode';
import { CSSScanner } from './scanner/cssScanner';
import { UsageScanner } from './scanner/usageScanner';

let outputChannel: vscode.OutputChannel;
let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('CSS Finder');
    diagnosticCollection = vscode.languages.createDiagnosticCollection('css-finder');

    const scanCommand = vscode.commands.registerCommand('css-finder.scanUnusedCSS', async () => {
        await scanForUnusedCSS();
    });

    context.subscriptions.push(scanCommand, outputChannel, diagnosticCollection);

    outputChannel.appendLine('CSS Finder extension activated');
}

async function scanForUnusedCSS() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    outputChannel.clear();
    outputChannel.show();
    outputChannel.appendLine('Starting CSS scan...\n');
    diagnosticCollection.clear();

    const config = vscode.workspace.getConfiguration('cssFinder');
    const ignoreFolders = config.get<string[]>('ignoreFolders', []);
    const fileExtensions = config.get<string[]>('fileExtensions', []);

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Scanning for unused CSS',
        cancellable: false
    }, async (progress) => {
        progress.report({ increment: 0, message: 'Finding CSS files...' });

        const cssScanner = new CSSScanner();
        const usageScanner = new UsageScanner();

        const cssFiles = await vscode.workspace.findFiles('**/*.css', `{${ignoreFolders.join(',')}}`);
        outputChannel.appendLine(`Found ${cssFiles.length} CSS files\n`);

        progress.report({ increment: 30, message: 'Parsing CSS...' });
        const scanResult = await cssScanner.extractClasses(cssFiles);
        const allClasses = scanResult.classes;
        
        if (scanResult.skippedTailwindFiles > 0) {
            outputChannel.appendLine(`⚠️  Skipped ${scanResult.skippedTailwindFiles} Tailwind CSS file(s)\n`);
        }
        
        outputChannel.appendLine(`Total CSS classes found: ${allClasses.size}\n`);

        progress.report({ increment: 30, message: 'Scanning project files...' });
        const usedClasses = await usageScanner.findUsedClasses(fileExtensions, ignoreFolders);
        outputChannel.appendLine(`Classes used in project: ${usedClasses.size}\n`);

        progress.report({ increment: 30, message: 'Analyzing results...' });
        const unusedClasses = new Set([...allClasses].filter(cls => !usedClasses.has(cls)));

        outputChannel.appendLine(`\n=== RESULTS ===`);
        outputChannel.appendLine(`Unused classes: ${unusedClasses.size}\n`);

        if (unusedClasses.size > 0) {
            outputChannel.appendLine('Unused CSS classes:');
            unusedClasses.forEach(cls => outputChannel.appendLine(`  - ${cls}`));
        } else {
            outputChannel.appendLine('No unused CSS classes found!');
        }

        progress.report({ increment: 10, message: 'Done!' });
    });

    vscode.window.showInformationMessage('CSS scan complete! Check output panel for results.');
}

export function deactivate() {}
