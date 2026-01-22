export interface WhitelabelConfig {
  project: {
    name: string;
    displayName: string;
    bundleIdPrefix: string;
    version: string;
    buildNumber: string;
  };
  app: {
    mainBundleId: string;
    clipBundleId: string;
    structName: string;
    startURL: string;
    mainTargetName?: string;
    clipTargetName?: string;
  };
  domains: {
    associatedDomain: string;
  };
  ios: {
    deploymentTarget: string;
    xcodeVersion: string;
  };
}

export function validateConfig(config: WhitelabelConfig): string[] {
  const errors: string[] = [];

  // Validate bundle IDs
  if (!config.app.mainBundleId.startsWith(config.project.bundleIdPrefix)) {
    errors.push('mainBundleId must start with bundleIdPrefix');
  }

  if (!config.app.clipBundleId.startsWith(config.project.bundleIdPrefix)) {
    errors.push('clipBundleId must start with bundleIdPrefix');
  }

  if (!config.app.clipBundleId.endsWith('.Clip')) {
    errors.push("clipBundleId should end with '.Clip'");
  }

  // Validate struct name (Swift identifier)
  const swiftIdentifierRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;
  if (!swiftIdentifierRegex.test(config.app.structName)) {
    errors.push('structName must be a valid Swift identifier');
  }

  // Validate URL
  if (!config.app.startURL.startsWith('http://') && !config.app.startURL.startsWith('https://')) {
    errors.push('startURL must start with http:// or https://');
  }

  return errors;
}
