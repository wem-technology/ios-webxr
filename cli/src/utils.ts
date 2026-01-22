import * as fs from 'fs-extra';
import * as path from 'path';
import * as readline from 'readline';

const EXCLUDE_PATTERNS = [
  '.git',
  '.gitignore',
  '*.xcodeproj',
  '*.xcworkspace',
  'DerivedData',
  '.DS_Store',
  '__pycache__',
  '*.pyc',
  'cli',
  '.cursor',
  '.claude',
];

export function shouldExclude(filePath: string, basePath: string): boolean {
  const relPath = path.relative(basePath, filePath);
  const pathStr = relPath.replace(/\\/g, '/');
  const fileName = path.basename(filePath);

  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.startsWith('*')) {
      const suffix = pattern.slice(1);
      if (pathStr.endsWith(suffix) || fileName.endsWith(suffix)) {
        return true;
      }
    } else if (pathStr.includes(pattern) || fileName === pattern) {
      return true;
    }
  }

  return false;
}

export function replaceVariables(content: string, variables: Record<string, string>): string {
  let result = content;
  for (const [varName, varValue] of Object.entries(variables)) {
    const placeholder = `\${${varName}}`;
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), varValue);
  }
  return result;
}

export async function readFileSafe(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`);
  }
}

export async function writeFileSafe(filePath: string, content: string): Promise<void> {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error}`);
  }
}

export function promptOverwrite(outputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`Directory ${outputPath} already exists. Overwrite? (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}
