#!/usr/bin/env python3
"""
White-label project generator for iOS WebXR app.
Reads whitelabel.config.json and generates a customized project in a new directory.
"""

import json
import os
import re
import shutil
import sys
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.absolute()

# Files and directories to exclude when copying template
EXCLUDE_PATTERNS = [
    '.git',
    '.gitignore',
    '*.xcodeproj',
    '*.xcworkspace',
    'DerivedData',
    '.DS_Store',
    '__pycache__',
    '*.pyc',
    'generate_whitelabel.py',
    'whitelabel.config.json',
    'cyango.config.json',  # Example configs
    'WHITELABEL.md',
]

def load_config(config_path="whitelabel.config.json"):
    """Load configuration from JSON file."""
    config_file = Path(config_path).resolve()
    if not config_file.exists():
        config_file = SCRIPT_DIR / config_path
    with open(config_file, 'r') as f:
        return json.load(f)

def should_exclude(path, base_path):
    """Check if a path should be excluded from copying."""
    rel_path = path.relative_to(base_path)
    path_str = str(rel_path)
    
    for pattern in EXCLUDE_PATTERNS:
        if pattern.startswith('*'):
            if path_str.endswith(pattern[1:]):
                return True
        elif pattern in path_str or path.name == pattern:
            return True
    
    return False

def copy_template(template_dir, output_dir):
    """Copy template directory to output directory, excluding certain files."""
    output_path = Path(output_dir).resolve()
    template_path = Path(template_dir).resolve()
    
    # Check if output is inside template - if so, exclude it from copying
    try:
        output_path.relative_to(template_path)
        output_is_inside_template = True
    except ValueError:
        output_is_inside_template = False
    
    if output_path.exists():
        response = input(f"Directory {output_path} already exists. Overwrite? (y/N): ")
        if response.lower() != 'y':
            print("Cancelled.")
            sys.exit(0)
        shutil.rmtree(output_path)
    
    output_path.mkdir(parents=True, exist_ok=True)
    
    def copy_recursive(src, dst):
        """Recursively copy files, excluding patterns."""
        # Exclude output directory if it's inside template
        if output_is_inside_template:
            try:
                src.relative_to(output_path)
                # src is inside output_path, skip it
                return
            except ValueError:
                pass
        
        if should_exclude(src, template_path):
            return
        
        if src.is_dir():
            dst.mkdir(exist_ok=True)
            for item in src.iterdir():
                copy_recursive(item, dst / item.name)
        else:
            shutil.copy2(src, dst)
    
    print(f"Copying template from {template_path} to {output_path}...")
    for item in template_path.iterdir():
        # Skip output directory if it's inside template
        if output_is_inside_template and item.resolve() == output_path.resolve():
            continue
        copy_recursive(item, output_path / item.name)
    
    return output_path

def replace_variables(content, variables):
    """Replace ${variable} placeholders in content."""
    for var_name, var_value in variables.items():
        content = content.replace(f'${{{var_name}}}', str(var_value))
    return content

def update_file(output_dir, file_path, variables):
    """Update a file in the output directory with variable replacements."""
    full_path = output_dir / file_path
    if not full_path.exists():
        print(f"  ⚠ Warning: {file_path} does not exist, skipping...")
        return
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    content = replace_variables(content, variables)
    
    with open(full_path, 'w') as f:
        f.write(content)

def update_project_yml(output_dir, config):
    """Update project.yml with config values."""
    proj = config['project']
    app = config['app']
    ios = config['ios']
    
    # Get target names (default to project name if not specified)
    main_target = app.get('mainTargetName', proj['name'])
    clip_target = app.get('clipTargetName', f"{proj['name']}Clip")
    
    project_yml_path = output_dir / 'project.yml'
    with open(project_yml_path, 'r') as f:
        content = f.read()
    
    # Replace ${variable} placeholders
    variables = {
        'projectName': proj['name'],
        'bundleIdPrefix': proj['bundleIdPrefix'],
        'mainBundleId': app['mainBundleId'],
        'clipBundleId': app['clipBundleId'],
        'version': proj['version'],
        'buildNumber': proj['buildNumber'],
        'deploymentTarget': ios['deploymentTarget'],
        'xcodeVersion': ios['xcodeVersion'],
    }
    content = replace_variables(content, variables)
    
    # Replace target names
    content = re.sub(r'^  MainApp:', f'  {main_target}:', content, flags=re.MULTILINE)
    content = re.sub(r'^  MainAppClip:', f'  {clip_target}:', content, flags=re.MULTILINE)
    content = re.sub(r'      - target: MainAppClip', f'      - target: {clip_target}', content)
    
    # Replace entitlements file names
    content = content.replace('CODE_SIGN_ENTITLEMENTS: "MainApp.entitlements"', 
                             f'CODE_SIGN_ENTITLEMENTS: "{main_target}.entitlements"')
    content = content.replace('CODE_SIGN_ENTITLEMENTS: "MainAppClip.entitlements"', 
                             f'CODE_SIGN_ENTITLEMENTS: "{clip_target}.entitlements"')
    
    with open(project_yml_path, 'w') as f:
        f.write(content)

def rename_entitlements(output_dir, config):
    """Rename entitlement files based on target names."""
    app = config['app']
    proj = config['project']
    
    main_target = app.get('mainTargetName', proj['name'])
    clip_target = app.get('clipTargetName', f"{proj['name']}Clip")
    
    # Rename main entitlements
    old_main = output_dir / 'MainApp.entitlements'
    new_main = output_dir / f'{main_target}.entitlements'
    if old_main.exists() and not new_main.exists():
        old_main.rename(new_main)
    
    # Rename clip entitlements
    old_clip = output_dir / 'MainAppClip.entitlements'
    new_clip = output_dir / f'{clip_target}.entitlements'
    if old_clip.exists() and not new_clip.exists():
        old_clip.rename(new_clip)

def validate_config(config):
    """Validate configuration values."""
    errors = []
    
    # Validate bundle IDs
    if not config['app']['mainBundleId'].startswith(config['project']['bundleIdPrefix']):
        errors.append("mainBundleId must start with bundleIdPrefix")
    
    if not config['app']['clipBundleId'].startswith(config['project']['bundleIdPrefix']):
        errors.append("clipBundleId must start with bundleIdPrefix")
    
    if not config['app']['clipBundleId'].endswith('.Clip'):
        errors.append("clipBundleId should end with '.Clip'")
    
    # Validate struct name (Swift identifier)
    if not re.match(r'^[A-Za-z_][A-Za-z0-9_]*$', config['app']['structName']):
        errors.append("structName must be a valid Swift identifier")
    
    # Validate URL
    if not config['app']['startURL'].startswith(('http://', 'https://')):
        errors.append("startURL must start with http:// or https://")
    
    if errors:
        print("Configuration errors:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)

def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate a white-label iOS WebXR project')
    parser.add_argument('config', nargs='?', default=None,
                       help='Path to configuration JSON file (positional argument)')
    parser.add_argument('-f', '--config-file', dest='config_file',
                       help='Path to configuration JSON file (alternative to positional argument)')
    parser.add_argument('-o', '--output', 
                       help='Output directory (default: inside template directory with project name)')
    parser.add_argument('-t', '--template', default=SCRIPT_DIR,
                       help='Template directory (default: script directory)')
    
    args = parser.parse_args()
    
    # Determine config file path: -f flag takes precedence, then positional, then default
    config_path = args.config_file or args.config or 'whitelabel.config.json'
    
    # Load config
    print(f"Loading configuration from {config_path}...")
    try:
        config = load_config(config_path)
    except FileNotFoundError:
        print(f"Error: Configuration file '{config_path}' not found!")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in configuration file: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error loading configuration: {e}")
        sys.exit(1)
    
    # Validate config
    print("Validating configuration...")
    validate_config(config)
    
    # Determine output directory
    template_dir = Path(args.template).resolve()
    if args.output:
        output_dir = Path(args.output).resolve()
    else:
        # Use project name inside template directory
        project_name = config['project']['name']
        output_dir = template_dir / project_name
    
    # Copy template
    template_dir = Path(args.template).resolve()
    output_path = copy_template(template_dir, output_dir)
    
    print("\nGenerating white-label project...")
    
    # Prepare variables
    proj = config['project']
    app = config['app']
    domains = config['domains']
    ios = config['ios']
    
    variables = {
        'projectName': proj['name'],
        'displayName': proj['displayName'],
        'bundleIdPrefix': proj['bundleIdPrefix'],
        'mainBundleId': app['mainBundleId'],
        'clipBundleId': app['clipBundleId'],
        'structName': app['structName'],
        'startURL': app['startURL'],
        'associatedDomain': domains['associatedDomain'],
        'version': proj['version'],
        'buildNumber': proj['buildNumber'],
        'deploymentTarget': ios['deploymentTarget'],
        'xcodeVersion': ios['xcodeVersion'],
    }
    
    # Update project.yml (needs special handling)
    update_project_yml(output_path, config)
    print("  ✓ Updated project.yml")
    
    # Update entitlements files before renaming (use template names)
    update_file(output_path, 'MainApp.entitlements', {'associatedDomain': domains['associatedDomain']})
    update_file(output_path, 'MainAppClip.entitlements', {
        'mainBundleId': app['mainBundleId'],
        'associatedDomain': domains['associatedDomain']
    })
    print("  ✓ Updated entitlements")
    
    # Rename entitlements files
    rename_entitlements(output_path, config)
    
    # Update all other files
    files_to_update = [
        ('Info.plist', ['displayName']),
        ('Info-Clip.plist', ['displayName']),
        ('Sources/App/App.swift', ['structName', 'associatedDomain']),
        ('Sources/App/AppConfig.swift', ['startURL']),
        ('Package.swift', ['projectName']),
        ('privacy_policy.md', ['displayName']),
        ('xtool-Info.plist', ['displayName']),
        ('xtool.yml', ['mainBundleId']),
        ('BUILD_INSTRUCTIONS.md', ['projectName']),
    ]
    
    for file_path, var_names in files_to_update:
        file_vars = {k: variables[k] for k in var_names}
        update_file(output_path, file_path, file_vars)
        print(f"  ✓ Updated {file_path}")
    
    print(f"\n✅ White-label project generated successfully in: {output_path}")
    print("\nNext steps:")
    print(f"  1. cd {output_path}")
    print("  2. Run: xcodegen generate")
    print("  3. Open the generated .xcodeproj in Xcode")
    print("  4. Update your development team in Xcode project settings")
    print("  5. Build and run!")

if __name__ == '__main__':
    main()
