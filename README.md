# n8n-nodes-semver

[![npm version](https://badge.fury.io/js/@luka-cat-mimi%2Fn8n-nodes-semver.svg)](https://badge.fury.io/js/@luka-cat-mimi%2Fn8n-nodes-semver)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive n8n community node for semantic versioning operations, providing a complete wrapper around the popular [semver](https://www.npmjs.com/package/semver) npm package.

## 🚀 Features

This node covers **99% of semver functions** with 8 comprehensive resource categories:

### 📋 Available Resources

| Resource | Operations | Description |
|----------|------------|-------------|
| **Validation** | `valid`, `clean` | Validate and clean version strings |
| **Comparison** | `gt`, `gte`, `lt`, `lte`, `eq`, `neq`, `compare`, `rcompare`, `compareBuild`, `compareLoose`, `diff` | Compare version numbers |
| **Range** | `satisfies`, `validRange`, `maxSatisfying`, `minSatisfying`, `minVersion`, `gtr`, `ltr`, `outside`, `intersects`, `simplifyRange`, `subset`, `toComparators` | Work with version ranges |
| **Increment** | `inc` | Increment version numbers by release type |
| **Parsing** | `parse`, `major`, `minor`, `patch`, `prerelease` | Parse version components |
| **Cleaning** | `clean` | Clean and normalize versions |
| **Coercion** | `coerce` | Coerce strings to semver format |
| **Sorting** | `sort`, `rsort` | Sort version arrays |

### ✨ Key Capabilities

- ✅ **Complete semver API coverage** - Access to nearly all semver functions
- ✅ **TypeScript support** - Full type safety and IntelliSense
- ✅ **English interface** - International standard compliance
- ✅ **Flexible options** - Loose parsing, prerelease handling, and more
- ✅ **Error handling** - Graceful error management with continue-on-fail support
- ✅ **Production ready** - Thoroughly tested and optimized

## 📦 Installation

### Prerequisites

- n8n version 0.190.0 or higher
- Node.js 18.0 or higher

### Install via n8n Community Nodes

1. Go to **Settings** → **Community Nodes** in your n8n instance
2. Enter the package name: `@luka-cat-mimi/n8n-nodes-semver`
3. Click **Install**

### Install via npm

```bash
npm install @luka-cat-mimi/n8n-nodes-semver
```

## 🎯 Usage Examples

### Basic Version Validation

```json
{
  "resource": "validation",
  "operation": "valid",
  "version": "1.2.3"
}
```

**Output:**
```json
{
  "value": true
}
```

### Version Comparison

```json
{
  "resource": "comparison",
  "operation": "gt",
  "version1": "2.0.0",
  "version2": "1.9.0"
}
```

**Output:**
```json
{
  "value": true
}
```

### Range Satisfaction

```json
{
  "resource": "range",
  "operation": "satisfies",
  "version": "1.2.3",
  "range": "^1.0.0"
}
```

**Output:**
```json
{
  "value": true
}
```

### Version Increment

```json
{
  "resource": "increment",
  "operation": "inc",
  "version": "1.2.3",
  "releaseType": "minor"
}
```

**Output:**
```json
{
  "value": "1.3.0"
}
```

### Array Sorting

```json
{
  "resource": "sorting",
  "operation": "sort",
  "versions": "2.0.0,1.0.0,1.5.0,1.0.1"
}
```

**Output:**
```json
{
  "value": ["1.0.0", "1.0.1", "1.5.0", "2.0.0"]
}
```

## 🔧 Configuration Options

### Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `loose` | boolean | `false` | Use loose parsing for version strings |
| `includePrerelease` | boolean | `false` | Include prerelease versions in range matching |
| `rtl` | boolean | `false` | Coerce version strings right to left (coercion only) |

### Release Types (for increment operations)

- `major` - 1.0.0 → 2.0.0
- `minor` - 1.0.0 → 1.1.0
- `patch` - 1.0.0 → 1.0.1
- `premajor` - 1.0.0 → 2.0.0-0
- `preminor` - 1.0.0 → 1.1.0-0
- `prepatch` - 1.0.0 → 1.0.1-0
- `prerelease` - 1.0.0 → 1.0.1-0 or 1.0.1-0 → 1.0.1-1
- `release` - 1.0.1-0 → 1.0.1

## 📚 API Reference

### Validation Operations

| Operation | Input | Output | Description |
|-----------|-------|--------|-------------|
| `valid` | version string | boolean + parsed version | Check if version is valid |
| `clean` | version string | cleaned version | Clean and normalize version |

### Comparison Operations

| Operation | Input | Output | Description |
|-----------|-------|--------|-------------|
| `gt` | version1, version2 | boolean | version1 > version2 |
| `gte` | version1, version2 | boolean | version1 >= version2 |
| `lt` | version1, version2 | boolean | version1 < version2 |
| `lte` | version1, version2 | boolean | version1 <= version2 |
| `eq` | version1, version2 | boolean | version1 == version2 |
| `neq` | version1, version2 | boolean | version1 != version2 |
| `compare` | version1, version2 | -1\|0\|1 | Compare versions |
| `rcompare` | version1, version2 | -1\|0\|1 | Reverse compare versions |
| `compareBuild` | version1, version2 | -1\|0\|1 | Compare including build metadata |
| `compareLoose` | version1, version2 | -1\|0\|1 | Loose comparison |
| `diff` | version1, version2 | release type | Get difference type |

### Range Operations

| Operation | Input | Output | Description |
|-----------|-------|--------|-------------|
| `satisfies` | version, range | boolean | Check if version satisfies range |
| `validRange` | range | range\|null | Validate range string |
| `maxSatisfying` | versions array, range | version\|null | Highest satisfying version |
| `minSatisfying` | versions array, range | version\|null | Lowest satisfying version |
| `minVersion` | range | version\|null | Minimum version for range |
| `gtr` | version, range | boolean | Version greater than range |
| `ltr` | version, range | boolean | Version less than range |
| `outside` | version, range, direction | boolean | Version outside range bounds |
| `intersects` | range1, range2 | boolean | Check if ranges intersect |
| `simplifyRange` | versions array, range | string | Simplified range |
| `subset` | subRange, superRange | boolean | Check if range is subset |
| `toComparators` | range | array | Convert range to comparators |

## 🏗️ Common Workflows

### 1. Version Validation Pipeline

```
Input Data → Semver (valid) → Filter (isValid=true) → Continue Processing
```

### 2. Version Comparison Chain

```
Input Data → Semver (compare) → Switch (based on value) → Different Paths
```

### 3. Dependency Range Checking

```
Package List → Semver (satisfies) → Filter Compliant → Update Action
```

### 4. Release Version Bumping

```
Current Version → Semver (inc) → New Version → Tag Creation
```

## 🐛 Error Handling

The node includes comprehensive error handling:

- **Invalid version strings** - Returns null or false based on operation
- **Malformed ranges** - Graceful fallback with error details
- **Type mismatches** - Clear error messages
- **Continue on fail** - Option to proceed despite errors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/luka-mimi/n8n-nodes-semver.git

# Install dependencies
npm install

# Build the project
npm run build

# Run linter
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🔗 Related Links

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [semver npm package](https://www.npmjs.com/package/semver)
- [Semantic Versioning Specification](https://semver.org/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/luka-mimi/n8n-nodes-semver/issues)
- **Community**: [n8n Community Forum](https://community.n8n.io/)

---

If this project helps you, please give it a ⭐️!

