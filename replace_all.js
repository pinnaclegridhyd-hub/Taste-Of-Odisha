const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', '.next'];
const includeExts = ['.ts', '.tsx', '.md', '.json', '.js'];

let modifiedFiles = 0;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Order matters (longest match first)
    content = content.replace(/TasteOfOdisha/g, 'TasteOfOdisha');
    content = content.replace(/Taste Of Odisha/g, 'Taste Of Odisha');
    content = content.replace(/Taste Of Odisha/g, 'Taste Of Odisha');
    content = content.replace(/Odisha heritage/g, 'Odisha heritage');
    content = content.replace(/ODISHA/g, 'ODISHA');
    content = content.replace(/odishaheritage\.com/g, 'tasteofodisha1996.com');
    content = content.replace(/Odisha/g, 'Odisha');
    content = content.replace(/odisha/g, 'odisha');
    content = content.replace(/Heritage/g, 'Heritage');
    content = content.replace(/Odisha/g, 'Odisha');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
        modifiedFiles++;
    }
}

function traverse(dir) {
    const list = fs.readdirSync(dir);
    for (let file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                traverse(filePath);
            }
        } else {
            if (includeExts.includes(path.extname(file))) {
                processFile(filePath);
            }
        }
    }
}

traverse(__dirname);
console.log(`\nSuccessfully updated ${modifiedFiles} files.`);
