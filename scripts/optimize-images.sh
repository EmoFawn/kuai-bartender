#!/bin/bash
# ============================================================
# 酒柜图片优化脚本（依赖 macOS 自带 sips，无需装任何东西）
#
# 问题：酒柜/*.png 是 1760×2336 的原图，单张 1~4MB，总计 64MB。
#      移动端进「我的酒柜」要一次加载 35 张 → 首屏卡住好几秒。
#
# ⚠️ 必须输出 PNG，不能用 JPEG！
#   原图带 alpha 通道（酒杯是抠图，背景透明），靠 .bottle-pic 的
#   深色渐变透出来才好看。JPEG 不支持 alpha，sips 会把透明区域
#   压成纯白 → 酒柜变成一格格白底方块，非常丑。
#   PNG 保留 alpha，480px 下单张约 136KB，35 张约 4MB，
#   相比原来 64MB 仍然是 16 倍的提升。
#
# 输出两档：
#   thumbs/  480px 宽  → 列表用（3 列网格实际显示宽度约 110px，480 够 2x 屏）
#   mid/     900px 宽  → 详情卡用（sheet-pic 宽度约 380px）
#
# 原 PNG 保留在原地，不删（作为母版）。
# 用法：bash scripts/optimize-images.sh
# ============================================================
set -e
cd "$(dirname "$0")/.."

SRC="酒柜"
THUMB="$SRC/thumbs"
MID="$SRC/mid"
mkdir -p "$THUMB" "$MID"

# 清掉上一版可能残留的 JPEG（白底那批）
rm -f "$THUMB"/*.jpg "$MID"/*.jpg 2>/dev/null || true

n=0
for f in "$SRC"/*.png; do
  [ -e "$f" ] || continue
  name=$(basename "$f" .png)
  # 列表缩略图：480px 宽，PNG（保 alpha）
  sips -s format png -Z 480 "$f" --out "$THUMB/$name.png" >/dev/null 2>&1
  # 详情图：900px 宽，PNG（保 alpha）
  sips -s format png -Z 900 "$f" --out "$MID/$name.png" >/dev/null 2>&1
  n=$((n+1))
  printf "\r  已处理 %d 张..." "$n"
done

echo ""
echo "完成：$n 张"
echo "  原图   : $(du -ch "$SRC"/*.png | tail -1 | cut -f1)"
echo "  thumbs : $(du -sh "$THUMB" | cut -f1)"
echo "  mid    : $(du -sh "$MID" | cut -f1)"
