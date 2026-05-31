const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'TASTE OF ODISHA');
const imageMap = {};

function crawlDir(dir, relPath) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativeUrl = '/TASTE OF ODISHA/' + (relPath ? relPath + '/' : '') + item;
        
        if (fs.statSync(fullPath).isDirectory()) {
            crawlDir(fullPath, relPath ? relPath + '/' + item : item);
        } else if (/\.(jpg|jpeg|png|webp|avif|gif)$/i.test(item)) {
            // It's an image
            // We can group by the folder it's inside
            const folderName = path.basename(dir).trim().toLowerCase();
            if (!imageMap[folderName]) {
                imageMap[folderName] = [];
            }
            imageMap[folderName].push(relativeUrl);
        }
    });
}

crawlDir(baseDir, '');
fs.writeFileSync('image-map.json', JSON.stringify(imageMap, null, 2));
console.log(`Found ${Object.keys(imageMap).length} product folders with images.`);
