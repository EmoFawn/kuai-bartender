#!/bin/bash
# ============================================================
# 酒柜图片优化脚本（依赖 macOS 自带 sips，无需装任何东西）
#
# 问题：酒柜/*.png 是 1760×2336 的原图，单张 1~4MB，总计 64MB。
#      移动端进「我的酒柜」要一次加载 35 张 → 首屏卡住好几秒。
#
# 方案：生成两档 JPEG：
#   thumbs/  480px 宽  → 列表用（3 列网格实际显示宽度约 110px，480 足够 2x 屏）
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

n=0
for f in "$SRC"/*.png; do
  [ -e "$f" ] || continue
  name=$(basename "$f" .png)
  # 列表缩略图：480px 宽，JPEG 质量 62
  sips -s format jpeg -s formatOptions 62 -Z 480 "$f" \
       --out "$THUMB/$name.jpg" >/dev/null 2>&1
  # 详情图：900px 宽，JPEG 质量 72
  sips -s format jpeg -s formatOptions 72 -Z 900 "$f" \
       --out "$MID/$name.jpg" >/dev/null 2>&1
  n=$((n+1))
  printf "\r  已处理 %d 张..." "$n"
done

echo ""
echo "完成：$n 张"
echo "  原图   : $(du -sh "$SRC"/*.png 2>/dev/null | awk '{s+=$1}END{print s"（见下）"}' >/dev/null; du -ch "$SRC"/*.png | tail -1 | cut -f1)"
echo "  thumbs : $(du -sh "$THUMB" | cut -f1)"
echo "  mid    : $(du -sh "$MID" | cut -f1)"
