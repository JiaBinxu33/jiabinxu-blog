#!/usr/bin/env node

/**
 * 记录功能点改动量到 changes.json
 *
 * 使用方式:
 * node scripts/record-changes.js \
 *   --design-dir "docs/design/YYYY-MM-DD-需求名称" \
 *   --feature "功能点名称" \
 *   --base "abc1234" \
 *   --changes "改动1" "改动2" "改动3"
 *
 * --base: 可选，功能点开始前的 commit hash，用于准确统计跨 commit 的改动
 *         不传则回退为 diff HEAD（仅统计未提交的改动）
 * --changes: 多值参数，收集到下一个 --flag 为止
 *
 * 文件列表由 git 自动检测，无需手动传入：
 *   - tracked 文件: git diff <base|HEAD> --numstat
 *   - untracked 新建文件: git ls-files --others --exclude-standard
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// 忽略统计的文件模式列表
const IGNORE_PATTERNS = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  /changes\.json$/,  // 忽略 changes.json 文件本身
];

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    designDir: '',
    feature: '',
    base: '',
    changes: []
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--design-dir':
        params.designDir = args[++i];
        break;
      case '--feature':
        params.feature = args[++i];
        break;
      case '--base':
        params.base = args[++i];
        break;
      case '--changes':
        while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          params.changes.push(args[++i]);
        }
        break;
      default:
        console.warn(`未知参数: ${args[i]}`);
    }
  }

  return params;
}

// 检查文件是否应该被忽略
function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some(pattern => {
    if (typeof pattern === 'string') {
      return filePath === pattern || filePath.endsWith('/' + pattern);
    }
    if (pattern instanceof RegExp) {
      return pattern.test(filePath);
    }
    return false;
  });
}

function countFileLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content) return 0;
    const lines = content.split('\n');
    return content.endsWith('\n') ? lines.length - 1 : lines.length;
  } catch {
    return 0;
  }
}

function getStats(base) {
  let totalFiles = 0;
  let totalInsertions = 0;
  let totalDeletions = 0;
  const fileList = [];

  const ref = base || 'HEAD';

  // 1. tracked 文件改动（已 commit + 未 commit，相对于 ref）
  try {
    const output = execFileSync(
      'git',
      ['diff', ref, '--numstat'],
      { encoding: 'utf-8' }
    );
    for (const line of output.split('\n')) {
      if (!line.trim()) continue;
      const [add, del, file] = line.split('\t');
      // 跳过忽略的文件
      if (shouldIgnore(file)) continue;
      totalFiles++;
      totalInsertions += parseInt(add) || 0;
      totalDeletions += parseInt(del) || 0;
      fileList.push(file);
    }
  } catch (error) {
    console.error('统计已跟踪文件改动失败:', error.message);
  }

  // 2. untracked 新建文件
  try {
    const output = execFileSync(
      'git',
      ['ls-files', '--others', '--exclude-standard'],
      { encoding: 'utf-8' }
    );
    for (const file of output.split('\n').filter(Boolean)) {
      // 跳过忽略的文件
      if (shouldIgnore(file)) continue;
      const lines = countFileLines(file);
      if (lines > 0) {
        totalFiles++;
        totalInsertions += lines;
        fileList.push(file);
      }
    }
  } catch (error) {
    console.error('检测新建文件失败:', error.message);
  }

  return { files: totalFiles, insertions: totalInsertions, deletions: totalDeletions, fileList };
}

function main() {
  const params = parseArgs();

  if (!params.designDir || !params.feature) {
    console.error('错误: 必须提供 --design-dir 和 --feature 参数');
    process.exit(1);
  }

  const stats = getStats(params.base);

  if (stats.files === 0) {
    console.warn('警告: 未检测到任何文件改动，请确认 --base 参数是否正确');
  }

  const record = {
    feature: params.feature,
    files: stats.files,
    insertions: stats.insertions,
    deletions: stats.deletions,
    fileList: stats.fileList,
    timestamp: new Date().toISOString(),
    ...(params.base && { baseCommit: params.base }),
    changes: params.changes
  };

  const changesFile = path.join(params.designDir, 'changes.json');

  let data = [];
  if (fs.existsSync(changesFile)) {
    try {
      const content = fs.readFileSync(changesFile, 'utf-8');
      data = JSON.parse(content);
    } catch {
      console.warn('读取 changes.json 失败，将创建新文件');
    }
  }

  data.push(record);

  fs.mkdirSync(path.dirname(changesFile), { recursive: true });
  fs.writeFileSync(changesFile, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✅ 已记录功能点 "${params.feature}" 的改动量到 ${changesFile}`);
  console.log(`📊 统计: ${stats.files} 个文件, +${stats.insertions} -${stats.deletions} 行`);
  if (stats.fileList.length) {
    console.log(`📁 文件列表:\n${stats.fileList.map(f => `   ${f}`).join('\n')}`);
  }
}

main();
