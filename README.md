# CSS Finder

Find and identify unused CSS classes in your project to keep your stylesheets clean and optimized.

## Features

- 🔍 Scans all CSS files in your workspace
- 📊 Analyzes HTML, JS, JSX, TS, TSX, and Vue files for class usage
- 📝 Reports unused CSS classes in the output panel
- ⚙️ Configurable file extensions and ignore patterns
- 🚀 Fast scanning with progress notifications

## Usage

1. Open a project with CSS files
2. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Run: **CSS Finder: Scan for Unused CSS**
4. View results in the "CSS Finder" output panel

## Configuration

Configure the extension in your VSCode settings:

```json
{
  "cssFinder.ignoreFolders": [
    "node_modules",
    "dist",
    "build",
    ".git"
  ],
  "cssFinder.fileExtensions": [
    ".html",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".vue"
  ]
}
```

### Settings

- `cssFinder.ignoreFolders`: Folders to exclude from scanning (default: `["node_modules", "dist", "build", ".git"]`)
- `cssFinder.fileExtensions`: File types to scan for CSS class usage (default: `[".html", ".js", ".jsx", ".ts", ".tsx", ".vue"]`)

## How It Works

1. **CSS Parsing**: Uses PostCSS to parse all CSS files and extract class names
2. **Usage Detection**: Scans project files for class usage in:
   - `class="..."` and `className="..."` attributes
   - `classList.add()`, `classList.remove()`, `classList.toggle()`
   - Template literals with classes
3. **Comparison**: Identifies classes defined in CSS but not used anywhere in the project

## Requirements

- Visual Studio Code v1.80.0 or higher

## Known Limitations

- Dynamic class names (e.g., computed from variables) may not be detected
- Classes used in external libraries or CDN files won't be tracked
- Tailwind CSS and utility-first frameworks may show false positives

## Release Notes

### 0.0.1

Initial release of CSS Finder

- Basic CSS class scanning
- Multi-file type support
- Configurable ignore patterns

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/yourusername/css-finder).

## License

MIT
