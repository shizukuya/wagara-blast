# Wagara Blast - 和柄タイルブラスト

> 日本の伝統文様「和柄」をテーマにしたブロックパズルゲーム

8x8 のグリッドに和柄タイルのブロックピースを配置し、行・列を揃えて消していくパズルゲームです。
美しい和柄パターン、コンボシステム、障害物、ブースターを組み合わせた奥深いゲームプレイが特徴です。

---

## 目次

1. [セットアップ](#セットアップ)
2. [起動方法](#起動方法)
3. [ゲームモード](#ゲームモード)
4. [基本ルール](#基本ルール)
5. [和柄パターン（7種）](#和柄パターン7種)
6. [ブロック形状（14種）](#ブロック形状14種)
7. [スコアリング](#スコアリング)
8. [コンボシステム](#コンボシステム)
9. [障害物（6種）](#障害物6種)
10. [ブースター（5種）](#ブースター5種)
11. [レベル設計](#レベル設計)
12. [和柄図鑑](#和柄図鑑)
13. [設定](#設定)
14. [プロジェクト構造](#プロジェクト構造)
15. [技術スタック](#技術スタック)
16. [TODOスタブ](#todoスタブ)

---

## セットアップ

### 前提条件

- Node.js 18+
- npm or yarn
- Expo Go アプリ（iOS / Android）または開発ビルド環境

### インストール

```bash
cd wagara-blast
npm install --legacy-peer-deps
```

### 仮サウンドファイル生成

初回セットアップ時に、プレースホルダーのWAVファイルを生成します。

```bash
node scripts/generate-sounds.js
```

`src/assets/sounds/` に 14 SE + 4 BGM の WAV ファイルが生成されます。
本番ではこれらを実際のサウンドアセットに差し替えてください。

---

## 起動方法

> **注意**: 本プロジェクトは `react-native-mmkv`（Nitro Modules）を使用しているため、
> **Expo Go では動作しません**。開発ビルド（dev-client）が必要です。

```bash
# 1. ネイティブプロジェクト生成 + ビルド（初回のみ）
npx expo prebuild
npx expo run:android   # または npx expo run:ios

# 2. 以降の開発サーバー起動
npx expo start --dev-client
```

#### EAS Build を使う場合

```bash
eas build --profile development --platform android --local
eas build --profile development --platform ios --local
npx expo start --dev-client
```

---

## ゲームモード

### Classic（クラシック）

- 終わりのないエンドレスモード
- ピースを置ける場所がなくなるとゲームオーバー
- ハイスコアを目指す

### Level（レベル）

- 全100レベル（現在 Lv.1〜15 を実装済み）
- 各レベルにクリア条件（スコア / ライン数 / 手数制限）
- 星評価 1〜3（スコア閾値で判定）
- 障害物が段階的に登場

### Daily（デイリーチャレンジ）

- 毎日1つ、日付ベースのシード値で生成されるステージ
- 連続クリアでストリーク（連続日数）記録
- 曜日で難易度が変化（月曜 = 易、日曜 = 全障害物）

---

## 基本ルール

### 操作

1. **画面下部のトレイ**に 3 つのブロックピースが表示される
2. ピースを**ドラッグ**してグリッド上にドロップ
3. 有効な位置にスナップし配置される（ゴールド枠でプレビュー表示）
4. 無効な位置では赤枠が表示され、手を離すとトレイに戻る

### ライン消し

- **行**または**列**のすべてのセルが埋まると、そのラインが消去される
- 複数ラインの同時消しでボーナススコア
- 消去後、空いたセルに新しいピースを置ける

### ピース補充

- 3 つのピースを**すべて使い切る**と、新しい 3 ピースが自動生成される
- 3 つのうちどの順番で使っても OK

### ゲームオーバー

- 残りのピースがグリッド上のどこにも配置できなくなったらゲームオーバー
- レベルモードでは手数制限超過でもゲームオーバー

---

## 和柄パターン（7種）

各ブロックピースにはランダムで和柄が割り当てられます。
出現頻度は和柄によって異なります（レアなものほど図鑑での発見価値が高い）。

| 和柄 | 英名 | 色 | 出現頻度 | 意味 |
|------|------|-----|---------|------|
| 市松 | Ichimatsu | 緑×黒 | ★★★★★ | 繁栄・発展（市松模様） |
| 麻の葉 | Asanoha | ピンク | ★★★★ | 健やかな成長 |
| 青海波 | Seigaiha | 青 | ★★★★ | 穏やかな暮らし・平安 |
| 七宝 | Shippou | 紫 | ★★★ | 仏教の七つの宝 |
| 矢絣 | Yagasuri | 赤 | ★★★ | 出戻らない（嫁入り道具） |
| 亀甲 | Kikkou | 金 | ★★ | 長寿（亀の甲羅） |
| 鱗 | Uroko | 橙 | ★★ | 厄除け・再生 |

すべてのパターンは `react-native-svg` でプログラム的に描画されます（外部SVGアセット不要）。

---

## ブロック形状（14種）

| 形状名 | サイズ | セル数 | 形 |
|--------|--------|--------|-----|
| Single | 1x1 | 1 | `#` |
| Domino (H) | 2x1 | 2 | `##` |
| Domino (V) | 1x2 | 2 | 縦2 |
| Tromino (H) | 3x1 | 3 | `###` |
| Tromino (V) | 1x3 | 3 | 縦3 |
| L-shape | 2x3 | 4 | L字 |
| L-shape Rev | 2x3 | 4 | 逆L字 |
| T-shape | 3x2 | 4 | T字 |
| Square 2x2 | 2x2 | 4 | 正方形 |
| Z-shape | 3x2 | 4 | Z字 |
| Z-shape Rev | 3x2 | 4 | 逆Z字 |
| Square 3x3 | 3x3 | 9 | 大正方形 |
| I-shape 4 | 1x4 | 4 | 縦棒 |
| Rect 2x3 | 2x3 | 6 | 長方形 |

---

## スコアリング

### 配置スコア

```
配置スコア = セル数 x 10
```

例: 4セルのL字ピース → 40点

### ライン消しスコア

| 同時消しライン数 | 基本点 |
|-----------------|--------|
| 1ライン | 100 |
| 2ライン | 300 |
| 3ライン以上 | ライン数 x 100 x 2 |

### コンボ乗算

```
コンボ倍率 = 1 + (コンボ数 - 1) x 0.5
```

- コンボ2: x1.5
- コンボ3: x2.0
- コンボ4: x2.5
- ...

### 金継ぎボーナス

金継ぎ障害物を含むラインを消すと、そのライン消しスコアが **2倍** になります。

---

## コンボシステム

ライン消しを**連続で**達成するとコンボが発生します。

- ピース配置 → ライン消し成功 → コンボ +1
- ピース配置 → ライン消しなし → コンボリセット

| コンボ | 表示 | フィードバック |
|-------|------|--------------|
| 2連続 | Combo! | 振動 + 効果音 SE06 |
| 3連続 | Triple! | 強振動 + 効果音 SE07 |
| 4連続以上 | Super Combo! | 最大振動 + 画面シェイク |

---

## 障害物（6種）

レベルモードで段階的に登場する障害物です。

### 石（Stone）
- **破壊不可**（ストーンブレーカーのみ除去可能）
- ブロック配置を妨害
- ライン消しでは消えない
- 初登場: Lv.4

### 金継ぎ（Kintsugi）
- 隣接するラインを **2回** 消すと破壊
- ブロック配置を妨害
- 破壊時にスコア2倍ボーナス
- 初登場: Lv.6

### 氷結（Frozen）
- 既存のブロックが凍結される
- 凍結中はライン消しにカウントされない
- 数ターン経過 or 隣接ライン消しで解凍
- 初登場: Lv.8

### 鎖（Chain）
- HP 3 の鎖でセルが縛られる
- ブロック配置は可能
- 鎖が残っている間はライン消しにカウントされない
- 隣接ライン消しで HP -1、HP 0 で解放
- 初登場: Lv.10

### 霧（Fog）
- セルの中身が見えない
- ブロックを隣接セルに置くか、隣接ラインを消すと晴れる
- 初登場: Lv.12

### 回転（Rotate）
- 一定ターンごとに周囲8マスを時計回りに回転
- 破壊不可
- 戦略的に利用可能
- 初登場: Lv.51 以降（予定）

---

## ブースター（5種）

ゲーム中に使用できる特殊アイテムです。初期所持数が付与され、コインで追加購入できます。

| ブースター | 初期数 | コスト | 効果 |
|-----------|--------|--------|------|
| 石割りの槌（Stone Breaker） | 3 | 50コイン | 指定セルの障害物を1つ破壊 |
| 手替え（Shuffle） | 3 | 30コイン | 手持ちピースを全て入れ替え |
| 導きの光（Guide） | 3 | 20コイン | 最適配置をハイライト表示 |
| 雷（Lightning） | 1 | 80コイン | 指定した行を丸ごと消去 |
| 波（Wave） | 1 | 80コイン | 指定した列を丸ごと消去 |

### 使い方

1. 画面下部のブースターバーからアイコンをタップ
2. 対象（セル / 行 / 列）を選択（種類による）
3. 効果が即座に発動

---

## レベル設計

全15レベル（16〜100は今後追加予定）。障害物が段階的に導入されます。

| レベル | テーマ | 障害物 | クリア条件 |
|-------|--------|--------|-----------|
| 1〜3 | チュートリアル | なし | スコア 500 / 800 / 1200 |
| 4〜5 | 石の登場 | 石 | スコア 1500 / 2000 |
| 6〜7 | 金継ぎの登場 | 石 + 金継ぎ | スコア 2500 / 3000 |
| 8〜9 | 氷結の登場 | 石 + 氷結 | スコア 3500 / 4000 |
| 10〜11 | 鎖の登場 | 石 + 鎖 | スコア 4500 / ライン20本 |
| 12〜13 | 霧の登場 | 霧 | スコア 5000 / 5500 |
| 14 | 全障害物ミックス | 石+金継ぎ+氷結+鎖+霧 | スコア 6000 |
| 15 | 手数制限 | 全種 | 手数30以内でスコア達成 |

### 星評価

各レベルには 3 段階のスコア閾値があり、達成度に応じて星 1〜3 が付与されます。

---

## 和柄図鑑

ゲーム中に新しい和柄パターンに出会うと、図鑑にアンロックされます。

- **コレクション画面**: 発見済みパターンの一覧
- **詳細画面**: 各和柄の歴史・意味・由来（日本語 / English 対応）
- 未発見のパターンはシルエット表示

---

## 設定

| 項目 | 説明 | デフォルト |
|------|------|-----------|
| サウンド（SE） | 効果音の ON/OFF | ON |
| 音楽（BGM） | BGM の ON/OFF | ON |
| 振動 | 触覚フィードバックの ON/OFF | ON |
| 言語 | 日本語 / English 切替 | デバイス言語に自動追従 |
| 進捗リセット | 全データ初期化 | - |

設定は MMKV で端末内に永続化されます。

---

## フィードバックシステム

すべてのゲームイベントには 3 層のフィードバックが同時に発火します。

| イベント | サウンド | 振動 | アニメーション |
|---------|---------|------|--------------|
| ピース拾い上げ | SE01 | Light Impact | 1.05x スケール |
| ホバー（セル境界通過） | SE02 | Selection Tick | ゴースト表示 |
| 配置確定 | SE03 | Medium Impact | スナップ（ease-out-back） |
| 無効配置 | SE04 | Error Notification | 赤フラッシュ + 戻りアニメ |
| ライン消し | SE05 | Heavy Impact | ラインフラッシュ + パーティクル |
| コンボ 2 | SE06 | Heavy x2 | コンボテキスト表示 |
| コンボ 3+ | SE07 | Heavy x3 | スクリーンシェイク |
| 鎖破壊 | SE08 | Heavy Impact | 鎖エフェクト |
| スコア加算 | SE09 | - | スコアポップアップ |
| レベルクリア | SE10 | Success | 星出現アニメ |
| ゲームオーバー | SE11 | Warning | オーバーレイ |

---

## プロジェクト構造

```
wagara-blast/
├── app/                            # expo-router 画面定義
│   ├── _layout.tsx                 # ルートレイアウト
│   ├── index.tsx                   # エントリ → /(tabs)/play
│   ├── (tabs)/                     # タブナビゲーション
│   │   ├── play.tsx                # モード選択
│   │   ├── collection.tsx          # 和柄図鑑
│   │   ├── shop.tsx                # ショップ
│   │   └── settings.tsx            # 設定
│   ├── game/
│   │   ├── classic.tsx             # クラシックモード
│   │   ├── level.tsx               # レベルモード
│   │   ├── daily.tsx               # デイリーチャレンジ
│   │   └── result.tsx              # リザルト
│   ├── level-select/index.tsx      # レベル選択
│   └── wagara/[id].tsx             # 和柄詳細
├── src/
│   ├── engine/                     # 純粋ゲームロジック（React非依存）
│   │   ├── GameEngine.ts           # メインオーケストレーター
│   │   ├── GridLogic.ts            # グリッド操作
│   │   ├── PieceGenerator.ts       # ピース生成
│   │   ├── ScoreCalculator.ts      # スコア計算
│   │   ├── ObstacleLogic.ts        # 障害物処理
│   │   ├── BoosterLogic.ts         # ブースター処理
│   │   ├── LevelLoader.ts          # レベル読み込み
│   │   └── DailyChallenge.ts       # デイリーシード生成
│   ├── stores/                     # Zustand ステート管理
│   │   ├── mmkvStorage.ts          # MMKV永続化アダプター
│   │   ├── gameStore.ts            # ゲーム状態（非永続）
│   │   ├── userStore.ts            # ユーザー進捗（永続）
│   │   ├── settingsStore.ts        # 設定（永続）
│   │   ├── collectionStore.ts      # 図鑑（永続）
│   │   └── boosterStore.ts         # ブースター在庫（永続）
│   ├── services/                   # 外部サービス連携
│   │   ├── SoundService.ts         # expo-audio サウンド再生
│   │   ├── HapticService.ts        # expo-haptics 振動
│   │   ├── FeedbackService.ts      # 3層同時発火オーケストレーター
│   │   ├── AdService.ts            # 広告（TODOスタブ）
│   │   ├── IAPService.ts           # アプリ内課金（TODOスタブ）
│   │   └── AnalyticsService.ts     # 分析（TODOスタブ）
│   ├── hooks/                      # React カスタムフック
│   │   ├── useGame.ts              # メインゲームループ
│   │   ├── useDragBlock.ts         # D&Dジェスチャー
│   │   ├── useGridAnimation.ts     # グリッドアニメーション
│   │   ├── useSound.ts             # サウンド再生
│   │   └── useHaptics.ts           # 振動
│   ├── components/
│   │   ├── game/                   # ゲームUIコンポーネント
│   │   │   ├── Grid.tsx            # 8x8 グリッド描画
│   │   │   ├── GridCell.tsx        # 個別セル
│   │   │   ├── Tile.tsx            # 和柄タイル
│   │   │   ├── BlockPiece.tsx      # ドラッグ可能ピース
│   │   │   ├── BlockTray.tsx       # 3ピーストレイ
│   │   │   ├── GhostPreview.tsx    # 配置プレビュー
│   │   │   ├── ScoreDisplay.tsx    # スコア表示
│   │   │   ├── ComboCounter.tsx    # コンボカウンター
│   │   │   ├── BoosterBar.tsx      # ブースターバー
│   │   │   ├── GameHeader.tsx      # ヘッダー
│   │   │   └── GameOverOverlay.tsx # ゲームオーバー
│   │   ├── effects/                # 演出エフェクト
│   │   │   ├── LineClearEffect.tsx
│   │   │   ├── ScreenShake.tsx
│   │   │   ├── ParticleSystem.tsx
│   │   │   ├── ScorePopup.tsx
│   │   │   └── ComboText.tsx
│   │   ├── tiles/                  # 和柄SVGパターン
│   │   │   ├── IchimatsuPattern.tsx
│   │   │   ├── AsanohaPattern.tsx
│   │   │   ├── SeigaihaPattern.tsx
│   │   │   ├── ShippouPattern.tsx
│   │   │   ├── YagasuriPattern.tsx
│   │   │   ├── KikkouPattern.tsx
│   │   │   ├── UrokoPattern.tsx
│   │   │   └── TilePatternRenderer.tsx
│   │   ├── ui/                     # 汎用UI
│   │   └── collection/             # 図鑑UI
│   ├── data/                       # 静的データ定義
│   │   ├── blockShapes.ts          # 14ブロック形状
│   │   ├── wagaraTypes.ts          # 7和柄定義
│   │   ├── wagaraEncyclopedia.ts   # 図鑑テキスト（日英）
│   │   ├── obstacleTypes.ts        # 6障害物定義
│   │   ├── boosterTypes.ts         # 5ブースター定義
│   │   ├── soundManifest.ts        # サウンドID管理
│   │   ├── iapProducts.ts          # IAP商品定義
│   │   └── levels/index.ts         # レベル1〜15
│   ├── types/index.ts              # 全TypeScript型定義
│   ├── utils/                      # ユーティリティ
│   │   ├── colors.ts               # カラーパレット
│   │   ├── dimensions.ts           # レイアウト計算
│   │   ├── animations.ts           # アニメーション定数
│   │   ├── random.ts               # シードPRNG（Mulberry32）
│   │   └── i18n.ts                 # 日英多言語対応
│   └── assets/sounds/              # サウンドファイル（WAV）
├── scripts/
│   └── generate-sounds.js          # 仮サウンド生成スクリプト
├── app.json                        # Expo設定
├── babel.config.js                 # Babel + module-resolver
├── metro.config.js                 # Metro bundler設定
├── tsconfig.json                   # TypeScript設定
└── package.json
```

---

## 技術スタック

| 技術 | 用途 |
|------|------|
| **Expo SDK 54** | アプリフレームワーク |
| **expo-router** | ファイルベースルーティング（tabs + stack） |
| **React Native 0.81** | UIフレームワーク |
| **TypeScript 5.9** | 型安全性 |
| **Reanimated 4** | 60fps アニメーション（worklet ベース） |
| **Gesture Handler** | ドラッグ＆ドロップ操作 |
| **react-native-svg** | 和柄パターンのプログラム的描画 |
| **Zustand** | 状態管理 |
| **react-native-mmkv** | 高速永続化ストレージ |
| **expo-audio** | サウンド再生 |
| **expo-haptics** | 触覚フィードバック |

### 設計原則

- **純粋関数ゲームエンジン**: `src/engine/` はすべて副作用のない純粋関数。React/RN に依存せず、入力 → 出力のみ
- **イミュータブル更新**: グリッド操作は常に新しいオブジェクトを返す
- **3層フィードバック**: 全イベントでサウンド + 振動 + アニメーションが同時発火
- **ID ベースサウンド管理**: SE01〜SE14, BGM01〜BGM04 で管理し、アセット差し替えが容易
- **シードPRNG**: デイリーチャレンジは日付ベースの Mulberry32 で決定論的に生成

---

## TODOスタブ

以下の機能はインターフェースとスタブ実装のみ提供されています。

| 機能 | ファイル | 状態 |
|------|---------|------|
| 広告（AdMob） | `src/services/AdService.ts` | console.log スタブ |
| アプリ内課金（IAP） | `src/services/IAPService.ts` | console.log スタブ |
| Firebase Analytics | `src/services/AnalyticsService.ts` | console.log スタブ |
| レベル 16〜100 | `src/data/levels/` | フレームワーク完成済み、データ未作成 |
| オンラインリーダーボード | - | ローカルハイスコアのみ実装 |
| サーバー同期デイリー | - | 日付ベースローカルシードで実装 |

---

## ライセンス

Private project.
