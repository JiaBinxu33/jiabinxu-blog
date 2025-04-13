#!/usr/bin/env sh

# ==============================================
#             多语言博客部署脚本（安全版）
# ==============================================

# 配置变量
REPO_NAME="jiabinxu-blog"
DEPLOY_BRANCH="blog_pages"
MAIN_BRANCH="master"
TEMP_DIR=".temp_deploy"  # 使用临时目录避免污染工作区

# 确保脚本出错时退出
set -e

echo "🚀 开始安全部署流程..."

# ---------- 阶段1：清理旧文件 ----------
echo "🗑  清理旧文件..."
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# ---------- 阶段2：构建多语言版本 ----------
echo "🛠  构建中文版本..."
vuepress build docs \
  --dest $TEMP_DIR/zh \
  --lang zh-CN

echo "🛠  构建英文版本..."
vuepress build docs \
  --dest $TEMP_DIR/en \
  --lang en-US

# ---------- 阶段3：创建语言切换入口 ----------
echo "🌐 配置多语言自动重定向..."
cat > $TEMP_DIR/index.html <<EOF
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script>
      const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
      window.location.href = \`/${REPO_NAME}/\${lang}/\`;
    </script>
    <noscript>
      <meta http-equiv="refresh" content="0; url=/${REPO_NAME}/zh/">
    </noscript>
  </head>
</html>
EOF

# ---------- 阶段4：部署到GitHub Pages ----------
echo "🚚 准备部署到GitHub..."

# 克隆部署分支到临时目录
echo "⏬ 克隆部署分支..."
DEPLOY_REPO="git@github.com:Jiabinxu33/${REPO_NAME}.git"
git clone --depth 1 --branch $DEPLOY_BRANCH $DEPLOY_REPO $TEMP_DIR/deploy

# 清空部署目录（保留.git）
echo "🧹 清理旧部署文件..."
cd $TEMP_DIR/deploy
git rm -rf .
git clean -fd

# 复制新构建内容
echo "📦 复制新文件..."
cd ../..
cp -r $TEMP_DIR/* $TEMP_DIR/deploy/
rm -rf $TEMP_DIR/deploy/deploy  # 避免递归复制

# 提交更改
echo "💾 提交部署更新..."
cd $TEMP_DIR/deploy
git add .
commit_msg="Deploy: $(date +'%Y-%m-%d %H:%M')"
git commit -m "${commit_msg}"

# 推送到远程
echo "🚀 推送到GitHub..."
git push origin $DEPLOY_BRANCH

# ---------- 清理阶段 ----------
echo "🧼 清理临时文件..."
cd ../..
rm -rf $TEMP_DIR

echo "🎉 部署成功完成!"
echo "   - 中文版：https://Jiabinxu33.github.io/${REPO_NAME}/zh/"
echo "   - 英文版：https://Jiabinxu33.github.io/${REPO_NAME}/en/"