import * as vscode from 'vscode';

export class UsageScanner {
    async findUsedClasses(fileExtensions: string[], ignoreFolders: string[]): Promise<Set<string>> {
        const usedClasses = new Set<string>();

        const pattern = `**/*{${fileExtensions.join(',')}}`;
        const exclude = `{${ignoreFolders.join(',')}}`;
        
        const files = await vscode.workspace.findFiles(pattern, exclude);

        for (const file of files) {
            try {
                const content = await vscode.workspace.fs.readFile(file);
                const text = Buffer.from(content).toString('utf8');
                
                this.extractClassesFromText(text, usedClasses);
            } catch (error) {
                console.error(`Error reading ${file.fsPath}:`, error);
            }
        }

        return usedClasses;
    }

    private extractClassesFromText(text: string, classes: Set<string>): void {
        // Match class="..." or className="..."
        const classAttrRegex = /class(?:Name)?=["']([^"']+)["']/g;
        let match;
        
        while ((match = classAttrRegex.exec(text)) !== null) {
            const classString = match[1];
            classString.split(/\s+/).forEach(cls => {
                if (cls.trim()) {
                    classes.add(cls.trim());
                }
            });
        }

        // Match classList.add('...') or classList.toggle('...')
        const classListRegex = /classList\.(add|remove|toggle)\(['"]([^'"]+)['"]\)/g;
        while ((match = classListRegex.exec(text)) !== null) {
            classes.add(match[2]);
        }

        // Match template literals with classes (basic support)
        const templateRegex = /class(?:Name)?=\{`([^`]+)`\}/g;
        while ((match = templateRegex.exec(text)) !== null) {
            const classString = match[1].replace(/\$\{[^}]+\}/g, '');
            classString.split(/\s+/).forEach(cls => {
                if (cls.trim() && !cls.includes('$')) {
                    classes.add(cls.trim());
                }
            });
        }
    }
}
