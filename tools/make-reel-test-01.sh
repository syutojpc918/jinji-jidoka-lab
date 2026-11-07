#!/usr/bin/env bash
# Instagramリール用テスト動画（reel-test-01）を静止画から生成する。
#
#   入力: assets/reel-base-01.png（941x1672、縦型）
#   出力: assets/reel-test-01.mp4（1080x1920 / 30fps / 10秒 / H.264 / 音声なし）
#
# 演出:
#   - Ken Burns風のゆっくりズームイン（1.00 → 1.08、ease-in-out）
#   - ズームの中心はデスクとノートパソコンのあたり（画面の横55%・縦58%の点を固定点にする）
#   - 冒頭・末尾に黒からのフェードイン／黒へのフェードアウト（各0.8秒）
#   - 文字・テロップ・音声なし
#
# 使い方（リポジトリのルートで）:
#   bash tools/make-reel-test-01.sh
#
# 必要なもの: ffmpeg（libx264 付き）
set -euo pipefail

cd "$(dirname "$0")/.."

IN="assets/reel-base-01.png"
OUT="assets/reel-test-01.mp4"

W=1080          # 出力幅
H=1920          # 出力高さ
FPS=30
DUR=10          # 秒
FADE=0.8        # フェード秒数（冒頭・末尾それぞれ）
ZMAX=0.08       # ズーム増分（1.00 → 1.08）
PX=0.55         # ズーム固定点（横位置の割合）: ノートパソコン〜デスク
PY=0.58         # ズーム固定点（縦位置の割合）

FRAMES=$((FPS * DUR))
LAST=$((FRAMES - 1))
FADE_OUT_START=$(awk -v d="$DUR" -v f="$FADE" 'BEGIN{printf "%.3f", d - f}')

# 先に4倍の解像度へアップスケールしてから zoompan をかける。
# zoompan は切り出し位置を整数ピクセルに丸めるため、
# 高解像度で処理すると「カクつき（ジッター）」が目立たなくなる。
SW=$((W * 4))
SH=$((H * 4))

# ズーム量: ease-in-out（コサイン）で 1.00 → 1.00+ZMAX
Z="1+${ZMAX}*(0.5-0.5*cos(PI*on/${LAST}))"
# 固定点 (PX,PY) が画面上で動かないように切り出し位置を決める
X="${PX}*(iw-iw/zoom)"
Y="${PY}*(ih-ih/zoom)"

ffmpeg -hide_banner -y \
  -loop 1 -framerate "$FPS" -t "$DUR" -i "$IN" \
  -filter_complex "\
[0:v]scale=${SW}:${SH}:flags=lanczos,setsar=1,\
zoompan=z='${Z}':x='${X}':y='${Y}':d=1:s=${W}x${H}:fps=${FPS},\
fade=t=in:st=0:d=${FADE},\
fade=t=out:st=${FADE_OUT_START}:d=${FADE},\
format=yuv420p[v]" \
  -map "[v]" -an \
  -frames:v "$FRAMES" -r "$FPS" \
  -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.1 \
  -movflags +faststart \
  "$OUT"

echo "done: $OUT"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,nb_frames \
  -of default=noprint_wrappers=1 "$OUT"
