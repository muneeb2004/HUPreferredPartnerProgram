const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.turbo' && f !== 'dist') {
        walkDir(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
        callback(dirPath);
      }
    }
  });
}

let found = [];

function checkContent(filePath, content) {
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Check for async function foo(): Type {
    const match = line.match(/async\s+(?:function\s+[A-Za-z0-9_]*\s*)?\([^)]*\)\s*:\s*([^P\{=\s][^\{=\s]*)/);
    if (match) {
      const type = match[1];
      if (!type.startsWith('Promise') && !type.includes('any')) {
        found.push(`${filePath}:${i+1} => ${line.trim()}`);
      }
    }
    
    // Check for arrow function const foo = async (): Type => {
    const matchArrow = line.match(/async\s*\([^)]*\)\s*:\s*([^P\{=\s][^\{=\s]*).*?=>/);
    if (matchArrow) {
      const type = matchArrow[1];
      if (!type.startsWith('Promise') && !type.includes('any')) {
        found.push(`${filePath}:${i+1} => ${line.trim()}`);
      }
    }
  });
}

['apps', 'packages'].forEach(folder => {
  walkDir(path.join(__dirname, folder), (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    checkContent(filePath, content);
  });
});

console.log(found.join('\n'));
