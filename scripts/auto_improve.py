#!/usr/bin/env python3
"""
Daily auto-improvement script for coffee-blend.html.
Runs via GitHub Actions on a daily schedule (02:00 UTC = 11:00 JST).

Required env vars:
  ANTHROPIC_API_KEY  — Anthropic API key (set as GitHub Actions secret)
  FOCUS              — Improvement focus: any | bug | data | ui | algorithm | feature
"""

import anthropic
import os
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ── Constants ──────────────────────────────────────────────────────────────────
JST = timezone(timedelta(hours=9))
TODAY = datetime.now(JST).strftime("%Y-%m-%d")

FOCUS_LABELS = {
    "bug":       "🐛 バグ修正・動作安定性",
    "data":      "📊 コーヒーデータベース更新・拡充",
    "ui":        "🎨 UI / 日本語テキスト改善",
    "algorithm": "🧠 ブレンドアルゴリズム精度向上",
    "feature":   "✨ 小規模な新機能追加",
    "any":       "🎯 最も効果的な改善を自由選択",
}

SYSTEM_PROMPT = """\
あなたはスペシャルティコーヒーの世界的な専門家であり、優秀な JavaScript / HTML エンジニアです。
Fuglen Tokyo（ノルウェー発のコーヒーロースタリー兼バー）のスタッフ向けコーヒーブレンド AI アプリを、
毎日少しずつ高品質に改善するのがあなたの使命です。
改善は保守的に、品質を最優先し、既存の動作を絶対に壊さないようにしてください。\
"""

# ── Helpers ────────────────────────────────────────────────────────────────────
def build_prompt(html: str, recent_log: str, focus: str) -> str:
    focus_label = FOCUS_LABELS.get(focus, FOCUS_LABELS["any"])
    return f"""\
今日（{TODAY}）の自動改善タスクです。

## 改善フォーカス
{focus_label}

## 改善対象ファイル（coffee-blend.html）
```html
{html}
```

## 最近の改善履歴
{recent_log if recent_log else "（まだ改善履歴はありません）"}

## 今日の改善指示
上記のコードを分析し、以下から **1〜2 個** の改善を実施してください。

改善候補（優先度順）:
1. **データ精度**: コーヒー産地・品種・プロセスの正確な情報、まだない産地の追加（例: ルワンダ、ペルー、タンザニア等）
2. **アルゴリズム**: スコアリング・比率計算・焙煎度推定のロジック改善
3. **バグ修正**: JavaScript のエラーやエッジケース
4. **日本語品質**: テキストの自然さ・専門性の向上
5. **UI 改善**: 視覚フィードバックやインタラクションの向上
6. **小機能追加**: ブレンド名のバリエーション追加、フレーバータグ追加など

制約（必ず守ること）:
- 全テキストは日本語
- ダークテーマ（--bg:#0f0f17 / --primary:#d4a847）を維持
- 外部ライブラリ・CDN を追加しない
- `index.html` へのバックリンクを保持
- 既存のすべての機能・レイアウト構造を維持
- 大規模なリファクタリングは行わない

## 必須レスポンス形式
以下の区切り文字を使って、**必ずこの形式のみ**で回答してください:

---SUMMARY---
（改善内容の日本語要約を 1〜2 文）
---CHANGES---
（各変更点を 1 行 1 項目で箇条書き）
---HTML---
（変更がある場合: <!DOCTYPE html> から始まる完全な更新済み HTML ファイル）
（変更がない場合: UNCHANGED）
---END---
"""


def parse_response(text: str) -> dict:
    """Extract structured data from Claude's response."""
    summary_m = re.search(r"---SUMMARY---\s*(.*?)\s*---CHANGES---", text, re.DOTALL)
    changes_m = re.search(r"---CHANGES---\s*(.*?)\s*---HTML---", text, re.DOTALL)
    html_m    = re.search(r"---HTML---\s*(.*?)\s*---END---", text, re.DOTALL)

    if not all([summary_m, changes_m, html_m]):
        return {"ok": False, "error": "レスポンスのパースに失敗"}

    summary      = summary_m.group(1).strip()
    changes_raw  = changes_m.group(1).strip()
    html_content = html_m.group(1).strip()

    changes = [
        c.lstrip("-•・ ").strip()
        for c in changes_raw.splitlines()
        if c.strip() and c.strip() not in {"（なし）", "なし", "N/A", "-"}
    ]
    has_changes = html_content not in {"UNCHANGED", ""} and html_content.startswith("<!DOCTYPE")

    return {
        "ok": True,
        "summary": summary,
        "changes": changes,
        "has_changes": has_changes,
        "html": html_content if has_changes else None,
    }


def update_log(log_path: Path, today: str, focus: str, summary: str, changes: list[str]) -> None:
    focus_label = FOCUS_LABELS.get(focus, FOCUS_LABELS["any"])
    changes_md  = "\n".join(f"- {c}" for c in changes) if changes else "- （詳細なし）"
    entry = (
        f"## {today} — {focus_label}\n"
        f"**概要**: {summary}\n"
        f"**変更点**:\n{changes_md}\n\n---\n\n"
    )

    if log_path.exists():
        existing   = log_path.read_text(encoding="utf-8")
        first_nl   = existing.find("\n") + 1
        new_content = existing[:first_nl] + "\n" + entry + existing[first_nl:]
    else:
        new_content = f"# コーヒーブレンドAI 自動改善ログ\n\n{entry}"

    log_path.write_text(new_content, encoding="utf-8")


# ── Main ───────────────────────────────────────────────────────────────────────
def main() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ ANTHROPIC_API_KEY が設定されていません")
        sys.exit(1)

    focus    = os.environ.get("FOCUS", "any")
    html_path = Path("coffee-blend.html")
    log_path  = Path("improve_log.md")

    if not html_path.exists():
        print("❌ coffee-blend.html が見つかりません")
        sys.exit(1)

    current_html = html_path.read_text(encoding="utf-8")
    recent_log   = ""
    if log_path.exists():
        raw = log_path.read_text(encoding="utf-8")
        recent_log = raw[:3000]  # 最近の履歴だけ送信

    print(f"🤖 Claude に改善案を依頼中... [{TODAY}] フォーカス: {FOCUS_LABELS.get(focus, focus)}")

    client = anthropic.Anthropic(api_key=api_key)
    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=16000,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        # キャッシュ対象: HTMLの大部分（ほぼ変わらない）
                        {
                            "type": "text",
                            "text": build_prompt(current_html, recent_log, focus),
                            "cache_control": {"type": "ephemeral"},
                        }
                    ],
                }
            ],
            extra_headers={"anthropic-beta": "prompt-caching-2024-07-31"},
        )
    except Exception as exc:
        print(f"❌ API エラー: {exc}")
        sys.exit(1)

    result = parse_response(message.content[0].text)

    if not result["ok"]:
        print(f"❌ {result['error']}")
        sys.exit(1)

    if not result["has_changes"]:
        print(f"✅ 今日は変更なし: {result['summary']}")
        sys.exit(0)

    # Apply changes
    html_path.write_text(result["html"], encoding="utf-8")
    update_log(log_path, TODAY, focus, result["summary"], result["changes"])

    print(f"✅ 改善完了: {result['summary']}")
    for change in result["changes"]:
        print(f"  ・{change}")


if __name__ == "__main__":
    main()
