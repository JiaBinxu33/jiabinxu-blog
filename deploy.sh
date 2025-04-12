#!/usr/bin/env sh

# ==============================================
#             多语言博客部署脚本
# 功能：构建中英文版本、自动语言重定向、部署到GitHub Pages
# 使用方法：在项目根目录执行 ./deploy.sh
# ==============================================

# ---------- 初始化配置 ----------
REPO_NAME="jiabinxu-blog"      # GitHub仓库名称
DEPLOY_BRANCH="blog_pages"     # 部署分支名称
MAIN_BRANCH="master"             # 主开发分支名称

# ---------- 阶段1：清理旧构建文件 ----------
echo "🗑  正在清理旧构建文件..."
rm -rf docs/.vuepress/dist     # 删除旧的构建目录避免缓存问题
echo "✅ 清理完成"

# ---------- 阶段2：构建多语言版本 ----------
# 构建中文版本（输出到 zh/ 子目录）
echo "🛠  正在构建中文版本..."
vuepress build docs \
  --dest docs/.vuepress/dist/zh \
  --lang zh-CN || { echo "❌ 中文构建失败"; exit 1; }

# 构建英文版本（输出到 en/ 子目录）
echo "🛠  正在构建英文版本..."
vuepress build docs \
  --dest docs/.vuepress/dist/en \
  --lang en-US || { echo "❌ 英文构建失败"; exit 1; }

echo "✅ 多语言构建完成"

# ---------- 阶段3：创建语言切换入口 ----------
echo "🌐 配置多语言自动重定向..."
mkdir -p docs/.vuepress/dist    # 确保根目录存在

# 生成智能跳转页面（根据浏览器语言自动重定向）
cat > docs/.vuepress/dist/index.html <<EOF
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script>
      // 根据浏览器语言首选项跳转
      const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
      // 带仓库名称的完整路径跳转
      window.location.href = \`/${REPO_NAME}/\${lang}/\`;
    </script>
    <!-- 备胎方案：手动选择 -->
    <noscript>
      <meta http-equiv="refresh" content="0; url=/${REPO_NAME}/zh/">
    </noscript>
  </head>
</html>
EOF
echo "✅ 重定向配置完成"

# ---------- 阶段4：部署到GitHub Pages ----------
echo "🚚 开始部署流程..."

# 切换到部署分支
echo "↩ 切换到部署分支 ${DEPLOY_BRANCH}..."
git checkout ${DEPLOY_BRANCH}

# 清空部署分支内容（保留.git目录）
echo "🧹 清理旧部署文件..."
rm -rf *                      # 删除所有文件
git rm -rf --cached .         # 从git索引中移除所有文件

# 复制新构建内容
echo "📦 复制新构建文件..."
cp -r docs/.vuepress/dist/* .  # 复制所有生成的文件到根目录

# 提交更改
echo "💾 提交部署更新..."
git add .
commit_msg="Deploy: $(date +'%Y-%m-%d %H:%M') (自动部署)"
git commit -m "${commit_msg}"

# 强制推送到远程分支
echo "🚀 推送到远程仓库..."
git push -f origin ${DEPLOY_BRANCH}

# 切换回开发分支
echo "↩ 切换回开发分支 ${MAIN_BRANCH}..."
git checkout ${MAIN_BRANCH}

# ---------- 完成通知 ----------
echo "🎉 部署成功！访问地址："
echo "   - 中文版：https://Jiabinxu33.github.io/${REPO_NAME}/zh/"
echo "   - 英文版：https://Jiabinxu33.github.io/${REPO_NAME}/en/"