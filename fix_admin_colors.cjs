const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/views/admin');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(directoryPath);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/\bbg-slate-50\b/g, 'bg-surface-container-low')
        .replace(/\bbg-slate-100\b/g, 'bg-surface-container-high')
        .replace(/\bbg-white\b/g, 'bg-surface-container-lowest')
        .replace(/\bborder-slate-100\b/g, 'border-outline-variant/20');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed:', path.basename(file));
    }
});
