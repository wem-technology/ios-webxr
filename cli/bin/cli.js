#!/usr/bin/env node

// Wrapper script to run TypeScript directly with tsx
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find tsx executable
let tsxPath;
const cliDir = path.resolve(__dirname, '..');

// Try to find tsx in node_modules
const nodeModulesTsx = path.join(cliDir, 'node_modules', '.bin', 'tsx');
if (fs.existsSync(nodeModulesTsx)) {
  tsxPath = nodeModulesTsx;
} else {
  // Try to resolve tsx package and find its bin
  try {
    const tsxPackageJson = require.resolve('tsx/package.json');
    const tsxPackageDir = path.dirname(tsxPackageJson);
    const tsxPackage = JSON.parse(fs.readFileSync(tsxPackageJson, 'utf-8'));
    
    if (tsxPackage.bin && tsxPackage.bin.tsx) {
      tsxPath = path.resolve(tsxPackageDir, tsxPackage.bin.tsx);
    } else {
      // Use node to run tsx's main entry
      const tsxMain = require.resolve('tsx');
      tsxPath = 'node';
      // We'll need to pass tsx main as first arg
    }
  } catch (e) {
    console.error('Error: tsx is not installed. Please run: cd cli && npm install');
    process.exit(1);
  }
}

const sourcePath = path.resolve(__dirname, '../src/index.ts');
const args = process.argv.slice(2);

// If tsxPath is 'node', we need to run tsx's main entry
if (tsxPath === 'node') {
  const tsxMain = require.resolve('tsx');
  const child = spawn('node', [tsxMain, sourcePath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  child.on('exit', (code) => process.exit(code || 0));
  child.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
} else {
  // Use tsx executable directly
  const child = spawn(tsxPath, [sourcePath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  child.on('exit', (code) => process.exit(code || 0));
  child.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
