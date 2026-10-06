/* =============================================================
   丸つけクイズ テンプレート ― 設定ファイル
   このファイルだけを書き換えれば、別のクイズになります。
   （index.html は触らなくて大丈夫です）
   ============================================================= */
window.QUIZ_CONFIG = {

  /* ---------- アプリ全体 ---------- */
  app: {
    title: "丸つけクイズ",              // アプリ名（画面上部とブラウザのタブ）
    subject: "一般教養（サンプル）",     // 答案用紙の「科目」欄
    tagline: "問題・カテゴリ・色は quiz.config.js を書き換えるだけで差し替えられます。",
    storageKey: "marutsuke-sample",    // 端末に保存するときの名前。クイズごとに変える
    passcode: "",                      // 文字を入れると起動時にパスコードを要求（空欄なら無効）
    passMark: 70,                      // 合格ライン（100点満点中）
    timer: 20,                         // タイムアタック時の 1問あたりの秒数
    counts: [5, 10, 20]                // 出題数の選択肢（「全問」は自動で追加）
  },

  /* ---------- 色の上書き（任意） ----------
     使えるキー: paper / sheet / ink / ink-2 / rule / mark / hi など
     例: light: { mark: "#1F6FEB" }, dark: { mark: "#7FB2FF" }          */
  theme: { light: {}, dark: {} },

  /* ---------- カテゴリ ----------
     key は問題の cat と対応させます。表示順はこの並び順です。 */
  categories: [
    { key: "geo",   name: "地理" },
    { key: "sci",   name: "科学" },
    { key: "word",  name: "ことば" },
    { key: "shape", name: "図形" }
  ],

  /* ---------- 問題 ----------
     type: "choice"（選択式） / "text"（記述式） / "image"（画像つき選択式）
     choice・image … choices に選択肢、answer に正解（選択肢と同じ文字）
     text          … answer に正解（配列で複数可）。hint は任意
     explain       … 解説（任意）。答えたあとと要点ノートに表示
     image         … 画像の URL、または <svg> から始まるコード              */
  questions: [
    { type: "choice", cat: "geo", q: "日本でいちばん面積が大きい都道府県は？",
      choices: ["北海道", "岩手県", "長野県", "新潟県"], answer: "北海道",
      explain: "約8.3万km²で、2位の岩手県のおよそ5.5倍あります。" },
    { type: "choice", cat: "geo", q: "世界でいちばん長い川とされるのは？",
      choices: ["ナイル川", "アマゾン川", "長江", "ミシシッピ川"], answer: "ナイル川",
      explain: "全長は約6,650km。アマゾン川を最長とする説もあります。" },
    { type: "choice", cat: "geo", q: "琵琶湖がある都道府県は？",
      choices: ["滋賀県", "京都府", "岐阜県", "福井県"], answer: "滋賀県",
      explain: "琵琶湖は県の面積のおよそ6分の1を占めています。" },
    { type: "choice", cat: "geo", q: "日本の標準時の基準になる東経135度の線が通る、兵庫県の市は？",
      choices: ["明石市", "神戸市", "姫路市", "西宮市"], answer: "明石市" },
    { type: "text", cat: "geo", q: "オーストラリアの首都は？",
      answer: ["キャンベラ", "Canberra"], hint: "シドニーではありません。",
      explain: "シドニーとメルボルンの首都争いの末、その間に計画都市として作られました。" },

    { type: "choice", cat: "sci", q: "光の速さは、およそ秒速何km？",
      choices: ["約30万km", "約3万km", "約300万km", "約3,000km"], answer: "約30万km",
      explain: "1秒間に地球をおよそ7周半する速さです。" },
    { type: "choice", cat: "sci", q: "元素記号「Fe」が表す元素は？",
      choices: ["鉄", "フッ素", "金", "銀"], answer: "鉄",
      explain: "ラテン語の ferrum が由来です。フッ素は F、金は Au、銀は Ag。" },
    { type: "choice", cat: "sci", q: "太陽系でいちばん大きな惑星は？",
      choices: ["木星", "土星", "天王星", "海王星"], answer: "木星" },
    { type: "choice", cat: "sci", q: "大人の体の骨は、およそ何本？",
      choices: ["約200本", "約100本", "約50本", "約500本"], answer: "約200本",
      explain: "およそ206本。赤ちゃんのころはもっと多く、成長とともにくっついて減ります。" },
    { type: "text", cat: "sci", q: "植物が光を使って、水と二酸化炭素から養分をつくるはたらきを何という？",
      answer: ["光合成", "こうごうせい"], hint: "○○合成",
      explain: "このとき酸素も作られます。" },

    { type: "choice", cat: "word", q: "「情けは人のためならず」の本来の意味は？",
      choices: [
        "人に親切にすれば、巡り巡って自分に返ってくる",
        "情けをかけると、その人のためにならない",
        "人に情けをかけてはいけない",
        "情けは自分のためだけにかけるもの"
      ],
      answer: "人に親切にすれば、巡り巡って自分に返ってくる",
      explain: "「甘やかすとためにならない」という意味で使うのは誤用です。" },
    { type: "choice", cat: "word", q: "「一石二鳥」と似た意味の四字熟語は？",
      choices: ["一挙両得", "一期一会", "一朝一夕", "一進一退"], answer: "一挙両得" },
    { type: "text", cat: "word", q: "「十人十色」の読みをひらがなで書きましょう。",
      answer: ["じゅうにんといろ"], hint: "「色」の読み方に注意。",
      explain: "考えや好みは人によってそれぞれ違う、という意味です。" },

    { type: "image", cat: "shape", q: "この図形の名前は？",
      image: '<svg viewBox="0 0 120 120"><polygon points="106,60 83,99.8 37,99.8 14,60 37,20.2 83,20.2" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
      choices: ["正六角形", "正五角形", "正八角形", "ひし形"], answer: "正六角形",
      explain: "6つの辺の長さと角の大きさがすべて等しい六角形。1つの内角は120°です。" },
    { type: "image", cat: "shape", q: "この図形の名前は？",
      image: '<svg viewBox="0 0 120 120"><polygon points="60,12 105.6,45.2 88.2,98.8 31.8,98.8 14.4,45.2" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
      choices: ["正五角形", "正六角形", "台形", "正方形"], answer: "正五角形" },
    { type: "image", cat: "shape", q: "この三角形の名前は？",
      image: '<svg viewBox="0 0 120 120"><polygon points="20,100 100,100 20,40" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M20 88 H32 V100" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
      choices: ["直角三角形", "正三角形", "二等辺三角形", "鈍角三角形"], answer: "直角三角形",
      explain: "左下の小さな四角は、そこが直角（90°）であることを表す記号です。" },
    { type: "image", cat: "shape", q: "この四角形の名前は？",
      image: '<svg viewBox="0 0 120 120"><polygon points="38,30 82,30 106,94 14,94" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
      choices: ["台形", "平行四辺形", "ひし形", "長方形"], answer: "台形",
      explain: "向かい合う1組の辺（上と下）だけが平行な四角形です。" }
  ],

  /* ---------- セット問題（データ表から自動出題） ----------
     items の各行について、fields の項目ごとに選択式の問題を自動で作ります。
     まちがいの選択肢は、ほかの行の同じ項目から選ばれます。                 */
  decks: [
    {
      key: "countries",
      title: "国データ",
      itemLabel: "国",
      fields: [
        { key: "capital",  label: "首都" },
        { key: "region",   label: "地域" },
        { key: "currency", label: "通貨" }
      ],
      items: [
        { name: "日本",           capital: "東京",       region: "アジア",     currency: "円" },
        { name: "フランス",       capital: "パリ",       region: "ヨーロッパ", currency: "ユーロ" },
        { name: "エジプト",       capital: "カイロ",     region: "アフリカ",   currency: "エジプト・ポンド" },
        { name: "ブラジル",       capital: "ブラジリア", region: "南アメリカ", currency: "レアル" },
        { name: "カナダ",         capital: "オタワ",     region: "北アメリカ", currency: "カナダ・ドル" },
        { name: "タイ",           capital: "バンコク",   region: "アジア",     currency: "バーツ" },
        { name: "イギリス",       capital: "ロンドン",   region: "ヨーロッパ", currency: "ポンド" },
        { name: "オーストラリア", capital: "キャンベラ", region: "オセアニア", currency: "オーストラリア・ドル" }
      ]
    }
  ],

  /* ---------- 要点ノート（教科書） ----------
     ここに書いた内容に加えて、セット問題の一覧表と
     全問題の「解答・解説」が自動で並びます。                               */
  notes: [
    {
      title: "要点：ことば",
      entries: [
        { term: "一挙両得", reading: "いっきょりょうとく", desc: "ひとつのことをして、ふたつの利益を得ること。「一石二鳥」とほぼ同じ意味。" },
        { term: "情けは人のためならず", desc: "人に親切にすると、巡り巡って自分によい報いがある。" },
        { term: "十人十色", reading: "じゅうにんといろ", desc: "考えや好みは人によってそれぞれ違うこと。" }
      ]
    },
    {
      title: "要点：図形",
      entries: [
        { term: "台形", desc: "向かい合う1組の辺が平行な四角形。" },
        { term: "正六角形", desc: "6つの辺の長さと角の大きさがすべて等しい六角形。1つの内角は120°。" },
        { term: "直角三角形", desc: "1つの角が直角（90°）の三角形。" }
      ]
    }
  ],

  /* ---------- 採点のはんこ ----------
     min 点以上でそのはんことコメントが出ます（上から順に判定）。
     stamp の \n は改行です。                                              */
  grades: [
    { min: 90, stamp: "たいへん\nよく\nできました", comment: "ほぼ完ぺきです。出題範囲を広げて腕だめしをしましょう。" },
    { min: 70, stamp: "よく\nできました",           comment: "合格ラインです。間違えた問題だけ解き直すと定着します。" },
    { min: 50, stamp: "もう\nすこし",               comment: "基礎はできています。要点ノートで確認してから再挑戦しましょう。" },
    { min: 0,  stamp: "がんばり\nましょう",         comment: "まず要点ノートを読み、少ない問題数から始めてみましょう。" }
  ]
};
