import * as fs from 'fs-extra';
import * as path from 'path';
import { WhitelabelConfig } from './validator';
import { shouldExclude, replaceVariables, readFileSafe, writeFileSafe, promptOverwrite } from './utils';

export async function copyTemplate(
  templateDir: string,
  outputDir: string
): Promise<string> {
  const templatePath = path.resolve(templateDir);
  const outputPath = path.resolve(outputDir);

  // Check if output is inside template
  let outputIsInsideTemplate = false;
  try {
    path.relative(templatePath, outputPath);
    const relativePath = path.relative(templatePath, outputPath);
    outputIsInsideTemplate = !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
  } catch {
    outputIsInsideTemplate = false;
  }

  // Check if output exists
  if (await fs.pathExists(outputPath)) {
    const shouldOverwrite = await promptOverwrite(outputPath);
    if (!shouldOverwrite) {
      process.exit(0);
    }
    await fs.remove(outputPath);
  }

  await fs.ensureDir(outputPath);

  async function copyRecursive(src: string, dst: string): Promise<void> {
    // Exclude output directory if it's inside template
    if (outputIsInsideTemplate) {
      try {
        const relSrc = path.relative(outputPath, src);
        if (!relSrc.startsWith('..') && !path.isAbsolute(relSrc)) {
          // src is inside outputPath, skip it
          return;
        }
      } catch {
        // Not inside output path, continue
      }
    }

    if (shouldExclude(src, templatePath)) {
      return;
    }

    const stat = await fs.stat(src);
    if (stat.isDirectory()) {
      await fs.ensureDir(dst);
      const entries = await fs.readdir(src);
      for (const entry of entries) {
        await copyRecursive(path.join(src, entry), path.join(dst, entry));
      }
    } else {
      await fs.copy(src, dst);
    }
  }

  console.log(`Copying template from ${templatePath} to ${outputPath}...`);
  const entries = await fs.readdir(templatePath);
  for (const entry of entries) {
    const srcPath = path.join(templatePath, entry);
    const dstPath = path.join(outputPath, entry);

    // Skip output directory if it's inside template
    if (outputIsInsideTemplate && path.resolve(srcPath) === outputPath) {
      continue;
    }

    await copyRecursive(srcPath, dstPath);
  }

  return outputPath;
}

export async function updateFile(
  outputDir: string,
  filePath: string,
  variables: Record<string, string>
): Promise<void> {
  const fullPath = path.join(outputDir, filePath);
  if (!(await fs.pathExists(fullPath))) {
    console.log(`  ⚠ Warning: ${filePath} does not exist, skipping...`);
    return;
  }

  const content = await readFileSafe(fullPath);
  const updatedContent = replaceVariables(content, variables);
  await writeFileSafe(fullPath, updatedContent);
}

export async function updateProjectYml(outputDir: string, config: WhitelabelConfig): Promise<void> {
  const proj = config.project;
  const app = config.app;
  const ios = config.ios;

  const mainTarget = app.mainTargetName || proj.name;
  const clipTarget = app.clipTargetName || `${proj.name}Clip`;

  const projectYmlPath = path.join(outputDir, 'project.yml');
  let content = await readFileSafe(projectYmlPath);

  // Replace variables
  const variables = {
    projectName: proj.name,
    bundleIdPrefix: proj.bundleIdPrefix,
    mainBundleId: app.mainBundleId,
    clipBundleId: app.clipBundleId,
    version: proj.version,
    buildNumber: proj.buildNumber,
    deploymentTarget: ios.deploymentTarget,
    xcodeVersion: ios.xcodeVersion,
  };
  content = replaceVariables(content, variables);

  // Replace target names
  content = content.replace(/^  MainApp:/gm, `  ${mainTarget}:`);
  content = content.replace(/^  MainAppClip:/gm, `  ${clipTarget}:`);
  content = content.replace(/      - target: MainAppClip/g, `      - target: ${clipTarget}`);

  // Replace entitlements file names
  content = content.replace(
    'CODE_SIGN_ENTITLEMENTS: "MainApp.entitlements"',
    `CODE_SIGN_ENTITLEMENTS: "${mainTarget}.entitlements"`
  );
  content = content.replace(
    'CODE_SIGN_ENTITLEMENTS: "MainAppClip.entitlements"',
    `CODE_SIGN_ENTITLEMENTS: "${clipTarget}.entitlements"`
  );

  await writeFileSafe(projectYmlPath, content);
}

export async function renameEntitlements(outputDir: string, config: WhitelabelConfig): Promise<void> {
  const app = config.app;
  const proj = config.project;

  const mainTarget = app.mainTargetName || proj.name;
  const clipTarget = app.clipTargetName || `${proj.name}Clip`;

  // Rename main entitlements
  const oldMain = path.join(outputDir, 'MainApp.entitlements');
  const newMain = path.join(outputDir, `${mainTarget}.entitlements`);
  if ((await fs.pathExists(oldMain)) && !(await fs.pathExists(newMain))) {
    await fs.move(oldMain, newMain);
  }

  // Rename clip entitlements
  const oldClip = path.join(outputDir, 'MainAppClip.entitlements');
  const newClip = path.join(outputDir, `${clipTarget}.entitlements`);
  if ((await fs.pathExists(oldClip)) && !(await fs.pathExists(newClip))) {
    await fs.move(oldClip, newClip);
  }
}

export async function generateWhitelabel(
  config: WhitelabelConfig,
  templateDir: string,
  outputDir: string
): Promise<void> {
  console.log('\nGenerating white-label project...');

  // Copy template
  const outputPath = await copyTemplate(templateDir, outputDir);

  // Prepare variables
  const proj = config.project;
  const app = config.app;
  const domains = config.domains;
  const ios = config.ios;

  const variables = {
    projectName: proj.name,
    displayName: proj.displayName,
    bundleIdPrefix: proj.bundleIdPrefix,
    mainBundleId: app.mainBundleId,
    clipBundleId: app.clipBundleId,
    structName: app.structName,
    startURL: app.startURL,
    associatedDomain: domains.associatedDomain,
    version: proj.version,
    buildNumber: proj.buildNumber,
    deploymentTarget: ios.deploymentTarget,
    xcodeVersion: ios.xcodeVersion,
  };

  // Update project.yml (needs special handling)
  await updateProjectYml(outputPath, config);
  console.log('  ✓ Updated project.yml');

  // Update entitlements files before renaming (use template names)
  await updateFile(outputPath, 'MainApp.entitlements', {
    associatedDomain: domains.associatedDomain,
  });
  await updateFile(outputPath, 'MainAppClip.entitlements', {
    mainBundleId: app.mainBundleId,
    associatedDomain: domains.associatedDomain,
  });
  console.log('  ✓ Updated entitlements');

  // Rename entitlements files
  await renameEntitlements(outputPath, config);
  
  // Verify renamed entitlements files don't have any remaining placeholders
  // (Xcode doesn't like entitlements files that were modified during build)
  const mainTarget = app.mainTargetName || proj.name;
  const clipTarget = app.clipTargetName || `${proj.name}Clip`;
  
  const mainEntitlementsPath = path.join(outputPath, `${mainTarget}.entitlements`);
  const clipEntitlementsPath = path.join(outputPath, `${clipTarget}.entitlements`);
  
  // Verify and update main entitlements if it exists
  if (await fs.pathExists(mainEntitlementsPath)) {
    let mainContent = await readFileSafe(mainEntitlementsPath);
    // Check for our placeholders (not Xcode build settings like $(VAR))
    const placeholderPattern = /\$\{[^}]+\}/g;
    if (placeholderPattern.test(mainContent)) {
      mainContent = replaceVariables(mainContent, {
        associatedDomain: domains.associatedDomain,
      });
      await writeFileSafe(mainEntitlementsPath, mainContent);
    }
  }
  
  // Verify and update clip entitlements if it exists
  if (await fs.pathExists(clipEntitlementsPath)) {
    let clipContent = await readFileSafe(clipEntitlementsPath);
    // Check for our placeholders (not Xcode build settings like $(VAR))
    const placeholderPattern = /\$\{[^}]+\}/g;
    if (placeholderPattern.test(clipContent)) {
      clipContent = replaceVariables(clipContent, {
        mainBundleId: app.mainBundleId,
        associatedDomain: domains.associatedDomain,
      });
      await writeFileSafe(clipEntitlementsPath, clipContent);
      // Verify no placeholders remain
      const remainingPlaceholders = clipContent.match(placeholderPattern);
      if (remainingPlaceholders) {
        console.log(`  ⚠ Warning: Found remaining placeholders in ${clipTarget}.entitlements: ${remainingPlaceholders.join(', ')}`);
      }
    }
  }

  // Update all other files
  const filesToUpdate: Array<[string, string[]]> = [
    ['Info.plist', ['displayName']],
    ['Info-Clip.plist', ['displayName']],
    ['Sources/App/App.swift', ['structName', 'associatedDomain']],
    ['Sources/App/AppConfig.swift', ['startURL']],
    ['Package.swift', ['projectName']],
    ['privacy_policy.md', ['displayName']],
    ['xtool-Info.plist', ['displayName']],
    ['xtool.yml', ['mainBundleId']],
  ];

  for (const [filePath, varNames] of filesToUpdate) {
    const fileVars: Record<string, string> = {};
    for (const varName of varNames) {
      fileVars[varName] = variables[varName as keyof typeof variables];
    }
    await updateFile(outputPath, filePath, fileVars);
    console.log(`  ✓ Updated ${filePath}`);
  }

  console.log(`\n✅ White-label project generated successfully in: ${outputPath}`);
  console.log('\nNext steps:');
  console.log(`  1. cd ${outputPath}`);
  console.log('  2. Run: xcodegen generate');
  console.log('  3. Open the generated .xcodeproj in Xcode');
  console.log('  4. Update your development team in Xcode project settings');
  console.log('  5. Build and run!');
}
