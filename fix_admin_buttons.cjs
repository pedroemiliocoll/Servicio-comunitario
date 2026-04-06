const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/views');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
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
    
    // Replace all bg-primary-fixed, bg-secondary-fixed, bg-tertiary-fixed with hardcoded brand colors for buttons
    let newContent = content
        .replace(/bg-primary-fixed text-on-primary-fixed/g, 'bg-[#005bbf] text-white')
        .replace(/bg-secondary-fixed text-on-secondary-fixed/g, 'bg-[#004a9e] text-white')
        .replace(/bg-tertiary-fixed text-on-tertiary-fixed/g, 'bg-surface-container-highest text-on-surface')
        .replace(/shadow-primary-fixed\/[0-9]+/g, 'shadow-lg shadow-black/20')
        .replace(/shadow-secondary-fixed\/[0-9]+/g, 'shadow-lg shadow-black/20')
        .replace(/shadow-tertiary-fixed\/[0-9]+/g, 'shadow-lg shadow-black/20');

    // Also replace bg-primary text-on-primary if any remain
    newContent = newContent.replace(/bg-primary text-on-primary/g, 'bg-[#005bbf] text-white');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed buttons:', path.basename(file));
    }
});
