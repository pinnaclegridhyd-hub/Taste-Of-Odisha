const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', '.next'];
const includeExts = ['.ts', '.tsx', '.md'];
const searchRegex = /madhubani/i;

function searchFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        results = results.concat(searchFiles(filePath));
      }
    } else {
      if (includeExts.includes(path.extname(file))) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (searchRegex.test(content)) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (searchRegex.test(line)) {
              results.push(`${filePath}:${index + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
  return results;
}

const matches = searchFiles(__dirname);
fs.writeFileSync('search_results.txt', matches.join('\n'));
console.log(`Found ${matches.length} matches.`);
