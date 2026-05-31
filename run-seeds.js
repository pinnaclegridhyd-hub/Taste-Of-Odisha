const fs = require('fs');
const { execSync } = require('child_process');

const envConfig = fs.readFileSync('.env.local', 'utf8');
envConfig.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [key, ...val] = line.split('=');
    if(key.trim() !== '') {
        process.env[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
    }
  }
});

try {
    console.log("Running seed-categories.ts...");
    execSync('npx tsx seed-categories.ts', { stdio: 'inherit', env: process.env });

    console.log("Running seed-products.ts...");
    execSync('npx tsx seed-products.ts', { stdio: 'inherit', env: process.env });
    console.log("Done.");
} catch(e) {
    console.error(e);
}
