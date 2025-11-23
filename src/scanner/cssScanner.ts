import * as vscode from 'vscode';
import * as postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

export interface ScanResult {
    classes: Set<string>;
    skippedTailwindFiles: number;
}

export class CSSScanner {
    async extractClasses(cssFiles: vscode.Uri[]): Promise<ScanResult> {
        const classes = new Set<string>();
        let skippedTailwindFiles = 0;

        for (const file of cssFiles) {
            try {
                const content = await vscode.workspace.fs.readFile(file);
                const cssText = Buffer.from(content).toString('utf8');
                
                // Skip Tailwind CSS files (contain @tailwind directives)
                if (this.isTailwindFile(cssText)) {
                    skippedTailwindFiles++;
                    console.log(`Skipping Tailwind file: ${file.fsPath}`);
                    continue;
                }
                
                const root = postcss.parse(cssText);
                
                root.walkRules(rule => {
                    selectorParser((selectors: selectorParser.Root) => {
                        selectors.walkClasses((classNode: selectorParser.ClassName) => {
                            classes.add(classNode.value);
                        });
                    }).processSync(rule.selector);
                });
            } catch (error) {
                console.error(`Error parsing ${file.fsPath}:`, error);
            }
        }

        return { classes, skippedTailwindFiles };
    }

    private isTailwindFile(cssText: string): boolean {
        // Check for Tailwind directives
        const tailwindDirectives = [
            '@tailwind base',
            '@tailwind components',
            '@tailwind utilities',
            '@import "tailwindcss',
            "@import 'tailwindcss"
        ];

        return tailwindDirectives.some(directive => 
            cssText.includes(directive)
        );
    }
}
