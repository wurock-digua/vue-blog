#!/bin/bash

# 项目根目录（可选：自动进入）
cd "$(dirname "$0")"

echo "🚀 开始构建项目..."
pnpm run build

echo "📤 正在同步到服务器..."
rsync -avz --delete \
  ./dist/ \
  root@120.24.179.231:/opt/myapp-blog/frontend/

echo "✅ 部署完成！"
