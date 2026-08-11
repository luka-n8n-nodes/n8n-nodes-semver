# n8n-nodes-semver

[![npm version](https://badge.fury.io/js/@luka-cat-mimi%2Fn8n-nodes-semver.svg)](https://badge.fury.io/js/@luka-cat-mimi%2Fn8n-nodes-semver)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个功能全面的n8n社区节点，用于语义化版本控制操作，提供了对流行的[semver](https://www.npmjs.com/package/semver) npm包的完整封装。

[English](README.md) | 中文

## 🚀 功能特性

该节点覆盖了**99%的semver函数**，包含8个综合性资源类别：

### 📋 可用资源

| 资源 | 操作 | 描述 |
|------|------|------|
| **验证 (Validation)** | `valid`, `clean` | 验证和清理版本字符串 |
| **比较 (Comparison)** | `gt`, `gte`, `lt`, `lte`, `eq`, `neq`, `compare`, `rcompare`, `compareBuild`, `compareLoose`, `diff` | 比较版本号 |
| **范围 (Range)** | `satisfies`, `validRange`, `maxSatisfying`, `minSatisfying`, `minVersion`, `gtr`, `ltr`, `outside`, `intersects`, `simplifyRange`, `subset`, `toComparators` | 处理版本范围 |
| **递增 (Increment)** | `inc` | 按发布类型递增版本号 |
| **解析 (Parsing)** | `parse`, `major`, `minor`, `patch`, `prerelease` | 解析版本组件 |
| **清理 (Cleaning)** | `clean` | 清理和规范化版本 |
| **强制转换 (Coercion)** | `coerce` | 强制转换字符串为semver格式 |
| **排序 (Sorting)** | `sort`, `rsort` | 排序版本数组 |

### ✨ 核心能力

- ✅ **完整的semver API覆盖** - 访问几乎所有semver函数
- ✅ **TypeScript支持** - 完整的类型安全和智能提示
- ✅ **英文界面** - 符合国际化标准
- ✅ **灵活选项** - 宽松解析、预发布处理等
- ✅ **错误处理** - 优雅的错误管理，支持失败时继续
- ✅ **生产就绪** - 经过充分测试和优化

## 📦 安装说明

### 前置要求

- n8n 版本 0.190.0 或更高
- Node.js 18.0 或更高

### 通过n8n社区节点安装

1. 在n8n实例中进入 **设置** → **社区节点**
2. 输入包名：`@luka-cat-mimi/n8n-nodes-semver`
3. 点击 **安装**

### 通过npm安装

```bash
npm install @luka-cat-mimi/n8n-nodes-semver
```

## 🎯 使用示例

### 基础版本验证

```json
{
  "resource": "validation",
  "operation": "valid",
  "version": "1.2.3"
}
```

**输出：**
```json
{
  "value": true
}
```

### 版本比较

```json
{
  "resource": "comparison",
  "operation": "gt",
  "version1": "2.0.0",
  "version2": "1.9.0"
}
```

**输出：**
```json
{
  "value": true
}
```

### 范围满足检查

```json
{
  "resource": "range",
  "operation": "satisfies",
  "version": "1.2.3",
  "range": "^1.0.0"
}
```

**输出：**
```json
{
  "value": true
}
```

### 版本递增

```json
{
  "resource": "increment",
  "operation": "inc",
  "version": "1.2.3",
  "releaseType": "minor"
}
```

**输出：**
```json
{
  "value": "1.3.0"
}
```

### 数组排序

```json
{
  "resource": "sorting",
  "operation": "sort",
  "versions": "2.0.0,1.0.0,1.5.0,1.0.1"
}
```

**输出：**
```json
{
  "value": ["1.0.0", "1.0.1", "1.5.0", "2.0.0"]
}
```

## 🔧 配置选项

### 全局选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `loose` | boolean | `false` | 对版本字符串使用宽松解析 |
| `includePrerelease` | boolean | `false` | 在范围匹配中包含预发布版本 |
| `rtl` | boolean | `false` | 从右到左强制转换版本字符串（仅用于强制转换） |

### 发布类型（用于递增操作）

- `major` - 1.0.0 → 2.0.0
- `minor` - 1.0.0 → 1.1.0
- `patch` - 1.0.0 → 1.0.1
- `premajor` - 1.0.0 → 2.0.0-0
- `preminor` - 1.0.0 → 1.1.0-0
- `prepatch` - 1.0.0 → 1.0.1-0
- `prerelease` - 1.0.0 → 1.0.1-0 或 1.0.1-0 → 1.0.1-1
- `release` - 1.0.1-0 → 1.0.1

## 📚 API参考

### 验证操作

| 操作 | 输入 | 输出 | 描述 |
|------|------|------|------|
| `valid` | 版本字符串 | 布尔值 + 解析后的版本 | 检查版本是否有效 |
| `clean` | 版本字符串 | 清理后的版本 | 清理和规范化版本 |

### 比较操作

| 操作 | 输入 | 输出 | 描述 |
|------|------|------|------|
| `gt` | version1, version2 | 布尔值 | version1 > version2 |
| `gte` | version1, version2 | 布尔值 | version1 >= version2 |
| `lt` | version1, version2 | 布尔值 | version1 < version2 |
| `lte` | version1, version2 | 布尔值 | version1 <= version2 |
| `eq` | version1, version2 | 布尔值 | version1 == version2 |
| `neq` | version1, version2 | 布尔值 | version1 != version2 |
| `compare` | version1, version2 | -1\|0\|1 | 比较版本 |
| `rcompare` | version1, version2 | -1\|0\|1 | 反向比较版本 |
| `compareBuild` | version1, version2 | -1\|0\|1 | 包含构建元数据的比较 |
| `compareLoose` | version1, version2 | -1\|0\|1 | 宽松比较 |
| `diff` | version1, version2 | 发布类型 | 获取差异类型 |

### 范围操作

| 操作 | 输入 | 输出 | 描述 |
|------|------|------|------|
| `satisfies` | 版本, 范围 | 布尔值 | 检查版本是否满足范围 |
| `validRange` | 范围 | 范围\|null | 验证范围字符串 |
| `maxSatisfying` | 版本数组, 范围 | 版本\|null | 满足条件的最高版本 |
| `minSatisfying` | 版本数组, 范围 | 版本\|null | 满足条件的最低版本 |
| `minVersion` | 范围 | 版本\|null | 范围的最小版本 |
| `gtr` | 版本, 范围 | 布尔值 | 版本大于范围 |
| `ltr` | 版本, 范围 | 布尔值 | 版本小于范围 |
| `outside` | 版本, 范围, 方向 | 布尔值 | 版本在范围边界外 |
| `intersects` | 范围1, 范围2 | 布尔值 | 检查范围是否相交 |
| `simplifyRange` | 版本数组, 范围 | 字符串 | 简化的范围 |
| `subset` | 子范围, 超级范围 | 布尔值 | 检查是否为范围子集 |
| `toComparators` | 范围 | 数组 | 将范围转换为比较器 |

## 🏗️ 常见工作流

### 1. 版本验证管道

```
输入数据 → Semver (valid) → 过滤器 (isValid=true) → 继续处理
```

### 2. 版本比较链

```
输入数据 → Semver (compare) → 开关 (基于结果) → 不同路径
```

### 3. 依赖范围检查

```
包列表 → Semver (satisfies) → 过滤兼容包 → 更新操作
```

### 4. 发布版本递增

```
当前版本 → Semver (inc) → 新版本 → 标签创建
```

## 🎨 应用场景

### DevOps自动化
- **CI/CD管道** - 自动版本检查和递增
- **依赖管理** - 验证包版本兼容性
- **发布流程** - 自动化版本标记

### 项目管理
- **版本控制** - 统一版本格式验证
- **依赖审计** - 检查版本范围合规性
- **更新通知** - 监控版本更新需求

### 质量保证
- **版本验证** - 确保版本格式正确性
- **兼容性检查** - 验证版本兼容性
- **回归测试** - 版本差异分析

## 🐛 错误处理

节点包含全面的错误处理：

- **无效版本字符串** - 根据操作返回null或false
- **格式错误的范围** - 优雅回退并提供错误详情
- **类型不匹配** - 清晰的错误消息
- **失败时继续** - 即使出错也可选择继续执行

## 🤝 贡献

欢迎贡献！请随时提交Pull Request。

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/luka-mimi/n8n-nodes-semver.git

# 安装依赖
npm install

# 构建项目
npm run build

# 运行代码检查
npm run lint
```

## 🎯 最佳实践

### 1. 版本验证
```json
{
  "resource": "validation",
  "operation": "valid",
  "version": "{{ $json.version }}",
  "options": {
    "loose": false
  }
}
```

### 2. 批量版本比较
使用循环节点处理版本数组，逐一进行比较操作。

### 3. 范围检查优化
对于大量版本检查，优先使用`validRange`验证范围有效性。

### 4. 错误处理
启用"Continue On Fail"选项以处理无效输入。

## 📄 许可证

本项目采用MIT许可证 - 详见[LICENSE](LICENSE.md)文件。

## 🔗 相关链接

- [n8n社区节点文档](https://docs.n8n.io/integrations/community-nodes/)
- [semver npm包](https://www.npmjs.com/package/semver)
- [语义化版本规范](https://semver.org/)
- [n8n官方文档](https://docs.n8n.io/)

## 📞 支持

- **问题反馈**: [GitHub Issues](https://github.com/luka-mimi/n8n-nodes-semver/issues)
- **社区讨论**: [n8n社区论坛](https://community.n8n.io/)
- **文档**: [项目Wiki](https://github.com/luka-mimi/n8n-nodes-semver/wiki)

## 🎖️ 致谢

感谢以下项目和贡献者：

- [semver](https://github.com/npm/node-semver) - 底层语义化版本库
- [n8n](https://github.com/n8n-io/n8n) - 强大的工作流自动化平台
- n8n社区 - 持续的反馈和支持

---

如果这个项目对你有帮助，请给它一个 ⭐️！
