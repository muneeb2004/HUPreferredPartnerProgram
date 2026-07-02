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

let modifiedFiles = 0;
let functionsCorrected = 0;

function processContent(content) {
  let originalContent = content;

  // async function foo(...): Type { 
  // where Type does not start with Promise
  content = content.replace(/async\s+function\s+([A-Za-z0-9_]*)\s*\(([^)]*)\)\s*:\s*(?!Promise\b)([^\{]+?)\s*\{/g, (match, name, args, type) => {
    // some types might have trailing spaces
    let cleanType = type.trim();
    functionsCorrected++;
    return `async function ${name}(${args}): Promise<${cleanType}> {`;
  });

  // async (...) : Type =>
  content = content.replace(/async\s*\(([^)]*)\)\s*:\s*(?!Promise\b)([^=]+?)\s*=>/g, (match, args, type) => {
    let cleanType = type.trim();
    functionsCorrected++;
    return `async (${args}): Promise<${cleanType}> =>`;
  });

  return content;
}

['apps', 'packages'].forEach(folder => {
  walkDir(path.join(__dirname, folder), (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    content = processContent(content);

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      modifiedFiles++;
      console.log(`Fixed ${filePath}`);
    }
  });
});

console.log(`Modified files: ${modifiedFiles}`);
console.log(`Functions corrected: ${functionsCorrected}`);
