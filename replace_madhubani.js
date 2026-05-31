const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', '.next'];
const includeExts = ['.ts', '.tsx', '.md'];

let modifiedFiles = 0;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Order matters (longest match first)
    content = content.replace(/Madhubani Region/g, 'Puri Region');
    content = content.replace(/Madhubani/g, 'Puri');
    content = content.replace(/madhubani/g, 'puri');
    
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
