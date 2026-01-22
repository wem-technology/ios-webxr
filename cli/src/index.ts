#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { validateConfig, WhitelabelConfig } from './validator';
import { generateWhitelabel } from './generator';
import { promptForConfig } from './prompts';

const program = new Command();

program
  .name('ios-webxr-cli')
  .description('Generate a white-label iOS WebXR project')
  .version('1.0.0')
  .argument('[config]', 'Path to configuration JSON file (optional - will prompt interactively if not provided)')
  .option('-f, --config-file <path>', 'Path to configuration JSON file (alternative to positional argument)')
  .option('-o, --output <path>', 'Output directory (default: inside template directory with project name)')
  .option('-t, --template <path>', 'Template directory (default: script directory)')
  .action(async (configArg: string | undefined, options) => {
    try {
      // Resolve paths relative to the CLI package location
      // __dirname will be cli/src/ when running via tsx, so go up to cli/, then to root
      const cliDir = path.resolve(__dirname, '..');
      const rootDir = path.resolve(cliDir, '..');

      let config: WhitelabelConfig;

      // Determine config file path: -f flag takes precedence, then positional
      const configPath = options.configFile || configArg;

      if (configPath) {
        // Load from config file
        let resolvedConfigPath: string;
        if (path.isAbsolute(configPath)) {
          resolvedConfigPath = configPath;
        } else {
          // Try current working directory first, then root directory
          const cwdConfig = path.resolve(process.cwd(), configPath);
          const rootConfig = path.resolve(rootDir, configPath);
          if (await fs.pathExists(cwdConfig)) {
            resolvedConfigPath = cwdConfig;
          } else if (await fs.pathExists(rootConfig)) {
            resolvedConfigPath = rootConfig;
          } else {
            resolvedConfigPath = cwdConfig; // Will fail with better error message
          }
        }

        console.log(chalk.blue(`Loading configuration from ${resolvedConfigPath}...`));
        if (!(await fs.pathExists(resolvedConfigPath))) {
          console.error(chalk.red(`Error: Configuration file '${resolvedConfigPath}' not found!`));
          process.exit(1);
        }

        try {
          const configContent = await fs.readFile(resolvedConfigPath, 'utf-8');
          config = JSON.parse(configContent);
        } catch (error) {
          if (error instanceof SyntaxError) {
            console.error(chalk.red(`Error: Invalid JSON in configuration file: ${error.message}`));
            process.exit(1);
          }
          console.error(chalk.red(`Error loading configuration: ${error}`));
          process.exit(1);
        }
      } else {
        // Interactive mode - prompt for config
        config = await promptForConfig();
      }

      // Validate config
      console.log(chalk.blue('\nValidating configuration...'));
      const errors = validateConfig(config);
      if (errors.length > 0) {
        console.error(chalk.red('Configuration errors:'));
        for (const error of errors) {
          console.error(chalk.red(`  - ${error}`));
        }
        process.exit(1);
      }

      // Determine template and output directories
      const templateDir = options.template ? path.resolve(options.template) : rootDir;
      let outputDir: string;
      if (options.output) {
        outputDir = path.resolve(options.output);
      } else {
        // Use project name inside template directory
        const projectName = config.project.name;
        outputDir = path.join(templateDir, projectName);
      }

      // Generate whitelabel project
      await generateWhitelabel(config, templateDir, outputDir);
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program.parse();
