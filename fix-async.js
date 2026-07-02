const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
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

walkDir(path.join(__dirname, 'apps'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix 1: async function foo(...): Type {
  content = content.replace(/async\s+function\s+(\w+)\s*\(([^)]*)\)\s*:\s*(React\.JSX\.Element|JSX\.Element|ReactElement|React\.ReactNode|React\.ReactElement|Response|NextResponse|void)\s*\{/g, (match, name, args, type) => {
    functionsCorrected++;
    return `async function ${name}(${args}): Promise<${type}> {`;
  });
  
  // Fix 2: export default async function(...) : Type {
  // Wait, Fix 1 handles this because `async function foo` matches even if preceded by `export default`.
  // What about anonymous async functions?
  content = content.replace(/async\s+function\s*\(([^)]*)\)\s*:\s*(React\.JSX\.Element|JSX\.Element|ReactElement|React\.ReactNode|React\.ReactElement|Response|NextResponse|void)\s*\{/g, (match, args, type) => {
    functionsCorrected++;
    return `async function(${args}): Promise<${type}> {`;
  });

  // Fix 3: const foo = async (...): Type => {
  content = content.replace(/async\s*\(([^)]*)\)\s*:\s*(React\.JSX\.Element|JSX\.Element|ReactElement|React\.ReactNode|React\.ReactElement|Response|NextResponse|void)\s*=>/g, (match, args, type) => {
    functionsCorrected++;
    return `async (${args}): Promise<${type}> =>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    modifiedFiles++;
    console.log(`Fixed ${filePath}`);
  }
});

walkDir(path.join(__dirname, 'packages'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix 1: async function foo(...): Type {
  content = content.replace(/async\s+function\s+(\w+)\s*\(([^)]*)\)\s*:\s*(React\.JSX\.Element|JSX\.Element|ReactElement|React\.ReactNode|React\.ReactElement|Response|NextResponse|void)\s*\{/g, (match, name, args, type) => {
    functionsCorrected++;
    return `async function ${name}(${args}): Promise<${type}> {`;
  });
  
  content = content.replace(/async\s+function\s*\(([^)]*)\)\s*:\s*(React\.JSX\.Element|JSX\.Element|ReactElement|React\.ReactNode|React\.ReactElement|Response|NextResponse|void)\s*\{/g, (match, args, type) => {
    functionsCorrected++;
    return `async function(${args}): Promise<${type}> {`;
  });

  // Fix 3: const foo = async (...): Type => {
  content = content.replace(/async\s*\(([^)]*)\)\s*:\s*(React\.JSX\.Element|JSX\.Element|ReactElement|React\.ReactNode|React\.ReactElement|Response|NextResponse|void)\s*=>/g, (match, args, type) => {
    functionsCorrected++;
    return `async (${args}): Promise<${type}> =>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    modifiedFiles++;
    console.log(`Fixed ${filePath}`);
  }
});

console.log(`Modified files: ${modifiedFiles}`);
console.log(`Functions corrected: ${functionsCorrected}`);
