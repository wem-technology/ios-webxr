import inquirer from 'inquirer';
import chalk from 'chalk';
import { WhitelabelConfig } from './validator';

export async function promptForConfig(): Promise<WhitelabelConfig> {
  console.log(chalk.blue('\n📱 iOS WebXR Whitelabel Configuration\n'));
  console.log(chalk.gray('Answer the following questions to configure your app:\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name (example: MyApp):',
      default: 'MyApp',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Project name is required';
        }
        if (/\s/.test(input)) {
          return 'Project name cannot contain spaces';
        }
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(input)) {
          return 'Project name must be a valid identifier';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'displayName',
      message: 'App display name (example: My App):',
      default: (answers: any) => answers.projectName || 'My App',
    },
    {
      type: 'input',
      name: 'bundleIdPrefix',
      message: 'Bundle ID prefix (example: com.yourcompany.yourapp):',
      default: (answers: any) => `com.example.${answers.projectName?.toLowerCase() || 'myapp'}`,
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Bundle ID prefix is required';
        }
        if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(input)) {
          return 'Bundle ID prefix must be in reverse domain notation (e.g., com.company.app)';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'mainBundleId',
      message: 'Main app bundle ID:',
      default: (answers: any) => answers.bundleIdPrefix || 'com.example.myapp',
      validate: (input: string, answers: any) => {
        if (!input || input.trim().length === 0) {
          return 'Main bundle ID is required';
        }
        const prefix = answers.bundleIdPrefix;
        if (prefix && !input.startsWith(prefix)) {
          return `Main bundle ID must start with ${prefix}`;
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'clipBundleId',
      message: 'App Clip bundle ID:',
      default: (answers: any) => `${answers.mainBundleId || answers.bundleIdPrefix || 'com.example.myapp'}.Clip`,
      validate: (input: string, answers: any) => {
        if (!input || input.trim().length === 0) {
          return 'Clip bundle ID is required';
        }
        const prefix = answers.bundleIdPrefix;
        if (prefix && !input.startsWith(prefix)) {
          return `Clip bundle ID must start with ${prefix}`;
        }
        if (!input.endsWith('.Clip')) {
          return "Clip bundle ID must end with '.Clip'";
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'structName',
      message: 'Swift struct name for main App:',
      default: (answers: any) => `${answers.projectName || 'MyApp'}App`,
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Struct name is required';
        }
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(input)) {
          return 'Struct name must be a valid Swift identifier';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'startURL',
      message: 'Initial URL to load (must start with http:// or https://):',
      default: 'https://example.com',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Start URL is required';
        }
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
          return 'Start URL must start with http:// or https://';
        }
        try {
          new URL(input);
          return true;
        } catch {
          return 'Invalid URL format';
        }
      },
    },
    {
      type: 'input',
      name: 'associatedDomain',
      message: 'Associated domain for App Clips (without appclips: prefix):',
      default: (answers: any) => {
        try {
          const url = new URL(answers.startURL || 'https://example.com');
          return url.hostname;
        } catch {
          return 'example.com';
        }
      },
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Associated domain is required';
        }
        // Basic domain validation
        if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(input)) {
          return 'Invalid domain format';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'version',
      message: 'App version (marketing version):',
      default: '1.0.0',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Version is required';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'buildNumber',
      message: 'Build number:',
      default: '1',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Build number is required';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'deploymentTarget',
      message: 'Minimum iOS deployment target:',
      default: '16.0',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Deployment target is required';
        }
        if (!/^\d+\.\d+$/.test(input)) {
          return 'Deployment target must be in format X.Y (e.g., 16.0)';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'xcodeVersion',
      message: 'Required Xcode version:',
      default: '15.0',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Xcode version is required';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'mainTargetName',
      message: 'Xcode target name for main app (optional, defaults to project name):',
      default: (answers: any) => answers.projectName || 'MyApp',
    },
    {
      type: 'input',
      name: 'clipTargetName',
      message: 'Xcode target name for App Clip (optional, defaults to project name + Clip):',
      default: (answers: any) => `${answers.projectName || 'MyApp'}Clip`,
    },
    {
      type: 'input',
      name: 'iconPath',
      message: 'Path to app icon file (1024x1024 PNG, optional - defaults to icon.png in output directory):',
      default: '',
      filter: (input: string) => input.trim() || undefined,
    },
  ]);

  const config: WhitelabelConfig = {
    project: {
      name: answers.projectName,
      displayName: answers.displayName,
      bundleIdPrefix: answers.bundleIdPrefix,
      version: answers.version,
      buildNumber: answers.buildNumber,
    },
    app: {
      mainBundleId: answers.mainBundleId,
      clipBundleId: answers.clipBundleId,
      structName: answers.structName,
      startURL: answers.startURL,
      mainTargetName: answers.mainTargetName === answers.projectName ? undefined : answers.mainTargetName,
      clipTargetName: answers.clipTargetName === `${answers.projectName}Clip` ? undefined : answers.clipTargetName,
    },
    domains: {
      associatedDomain: answers.associatedDomain,
    },
    ios: {
      deploymentTarget: answers.deploymentTarget,
      xcodeVersion: answers.xcodeVersion,
    },
    iconPath: answers.iconPath,
  };

  return config;
}
