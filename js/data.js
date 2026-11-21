// 《降落在電通，讀懂《決策智慧》》內容資料
// 所有引文逐字取自《決策智慧 2026》全刊 PDF；頁碼為原刊頁碼。
// 品牌占比依 2026 各品牌預估人數換算，程式只保存占比，不保存人數。

export const ARTICLES = {
  a01: { short: 'AI for Growth', title: 'AI for Growth 看懂世界，加速成長', author: '唐心慧', pages: '6–11', chapter: 'Intro' },
  a02: { short: 'Agentic 時代', title: 'Agentic 時代，品牌與人的真實距離', author: '邵懿文', pages: '12–17', chapter: 'Intro' },
  a03: { short: '真實的力量', title: '真實的力量，重新定義中', author: '周麗君', pages: '20–27', chapter: 'People' },
  a04: { short: 'Agents of Growth', title: 'Agents of Growth：AI 代理時代的增長推手', author: '紀緻謙', pages: '28–35', chapter: 'People' },
  a05: { short: '增長架構師', title: 'AI 代理時代的增長架構師', author: '朱芳儀', pages: '36–43', chapter: 'People' },
  a06: { short: '信任', title: '信任為何成為 AI 時代最難複製的競爭力', author: '楊欣怡', pages: '44–49', chapter: 'People' },
  a07: { short: 'AI 可以幫人買東西', title: 'AI 可以幫人買東西，但品牌要讓人想買東西', author: '陳蒔', pages: '50–57', chapter: 'People' },
  a08: { short: '當注意力成為稀缺資源', title: '當注意力成為稀缺資源：娛樂與運動如何累積品牌心智資產？', author: '何華軒', pages: '58–65', chapter: 'People' },
  a09: { short: '討好演算法，還是打動人？', title: '討好演算法，還是打動人？別讓效率邏輯把社群砍掉', author: '孫韞筑', pages: '66–71', chapter: 'People' },
  a10: { short: '別買曝光了', title: '別買曝光了，開始買注意力吧', author: '徐莉媛', pages: '72–79', chapter: 'People' },
  a11: { short: '從金曲獎到甄嬛傳', title: '從金曲獎到甄嬛傳：共同記憶帶來的品牌價值', author: '吳宗霖、陳炯文', pages: '80–93', chapter: 'People' },
  a12: { short: 'People Model', title: '特別企劃｜People Model：讓消費者研究變成一場隨時能開口的對話', author: '陳介立、孫郁喬、高靖萍', pages: '96–115', chapter: 'Model' },
  a13: { short: '重建 SOV', title: '重建 SOV：在注意力被 AI 稀釋的時代，如何守住品牌被選擇的關鍵場域', author: '吳宗霖', pages: '116–127', chapter: 'Model' },
  a14: { short: '衡斷力', title: 'AI 普及下的演算法世代，「衡斷力（Judgment）」將成為最稀缺的競爭力', author: '強義明', pages: '128–135', chapter: 'Model' },
  a15: { short: '生成式體驗來臨', title: '生成式體驗來臨，誰能掌握顧客的下一步？', author: '鄭怡櫛、張家誠', pages: '136–143', chapter: 'Model' },
  a16: { short: '文化暗流', title: '贏在 AI 時代的隱形戰場：看見「文化暗流」，啟動企業真實的轉型動能', author: '王馥蓓、周允玉', pages: '144–149', chapter: 'Model' },
  a17: { short: '顧客為何停下來？', title: '顧客為何停下來？從洞察到治理的體驗優化', author: '陳詳翰、康晉嵐', pages: '152–159', chapter: 'AI' },
  a18: { short: '體驗這件事', title: '體驗這件事，我們一直只問了一半', author: '王姿喨、詹佳穎、黃靖婷', pages: '160–167', chapter: 'AI' },
  a19: { short: 'GEO 時代', title: 'GEO 時代，被 AI 看見是技術，被消費者記住才是本事', author: '莊閔雯、呂季霖', pages: '168–175', chapter: 'AI' },
  a20: { short: '拒絕同質化 AI Slop', title: '拒絕同質化 AI Slop：將 AI 的「生成力」升級為品牌的「交付力」', author: '潘其偉', pages: '176–181', chapter: 'AI' },
  a21: { short: '超越效率', title: '超越效率：解碼 AI 製作驅動的創意代理商', author: 'Trent Agnew', pages: '182–187', chapter: 'AI' },
  a22: { short: 'AI Agent 走進消費旅程', title: 'AI Agent 走進消費旅程：保健、美妝與零售如何把 AI 變成行動能力', author: '電通智能中心智庫', pages: '188–195', chapter: 'AI' },
};

// 職務家族：Day 1 情境
// ai：AI 助手建議交給 AI 的成數（0–100）；twin：AI 分身預測你會選的成數
export const FAMILIES = {
  planning: {
    name: '媒體企劃',
    does: '依客戶目標與預算，決定在哪些媒體、什麼時段、投多少錢，寫成 media plan。',
    task: '主管丟給你一筆季度預算，下班前要交出 media plan。AI 工具三秒就排好了。它建議把大部分的錢，放在消費者快要下單的地方，像是電商和搜尋廣告。報表上，每筆訂單的成本很漂亮。',
    quote: { text: '越往 lower funnel 越要小心　看起來有效率但看見的人變少', article: 'a13', page: '118–119' },
    slider: '預算分配交給 AI 決定幾成？', ai: 90, twin: 70,
  },
  buying: {
    name: '購買優化',
    does: '在各廣告平台上架廣告、設定出價與受眾，每天看數據、換素材、調預算。',
    task: '你接手一個廣告帳戶，早上第一件事是看報表。AI 自動出價把 CPA 壓到新低，但客戶的品牌市調說：知名度不動了。',
    quote: { text: '陷入成效越優化、品牌越萎縮的惡性循環「The Doom Loop」', article: 'a10', page: '72–73' },
    slider: '出價與版位交給 AI 決定幾成？', ai: 90, twin: 80,
  },
  account: {
    name: '業務',
    does: '客戶窗口：接需求、寫 brief、協調內部團隊、管時程與預算。',
    task: '第一天就收到客戶來信：「今年行銷預算砍兩成。你們不是都在用 AI 了嗎？下週給我一版提案：檔期一樣、素材量一樣，代理費要降。」',
    quote: { text: '很多企業導入 AI，第一個念頭是用更低的成本取代人力、用更便宜的方式做行銷。但這是把 AI 用小了。', article: 'a01', page: '8–9' },
    slider: '提案內容交給 AI 準備幾成？', ai: 80, twin: 50,
  },
  creative: {
    name: '創意',
    does: '從 brief 發想概念，寫文案、做主視覺。',
    task: '明天要跟客戶提三個創意方向。你請 AI 幫忙，它一分鐘就生出 50 句標語、20 張主視覺。每一個看起來都還不錯，卻沒有一個讓你眼睛一亮。',
    quote: { text: 'AI 最大的風險不是犯錯而是變得平均', article: 'a20', page: '176–177' },
    slider: '文案與視覺交給 AI 生成幾成？', ai: 80, twin: 40,
  },
  strategy: {
    name: '策略',
    does: '研究市場、消費者與競品，找出洞察，寫提案的策略段落。',
    task: '比稿前三天，你要寫策略。AI 幾秒鐘就整理好市場資料和競品掃描。那你還要做什麼？',
    quote: { text: '策略人被推向更上游的位置。當重複性工作被加速，真正重要的反而變成：我們如何定義問題、如何判斷方向', article: 'a05', page: '36–37' },
    slider: '研究與分析交給 AI 做幾成？', ai: 80, twin: 60,
  },
  crm: {
    name: '數據與 CRM',
    does: '規劃會員資料、建立分眾與預測模型、設計 CRM 溝通旅程。',
    task: '客戶的會員系統要升級。行銷團隊希望註冊時一次收滿所有欄位，讓分眾模型更準，但註冊率開始下滑。',
    quote: { text: '行銷團隊希望取得更多資料，以便未來做分眾、個人化；但顧客在註冊當下，往往還沒有足夠信任', article: 'a17', page: '156–157' },
    slider: '分眾與推薦交給 AI 模型決定幾成？', ai: 80, twin: 60,
  },
  web: {
    name: '網站工程',
    does: '前後端開發，替客戶建官網、做提案原型。',
    task: '提案週，客戶希望新官網加上 AI 搜尋和 AI 客服，原型後天就要交。',
    quote: { text: '官網 AI 搜尋推薦了某個方案，但客服不知道顧客剛剛看過什麼', article: 'a15', page: '138–139' },
    slider: '前後端程式交給 AI 寫幾成？', ai: 90, twin: 70,
  },
  backoffice: {
    name: '財務法務',
    does: '結帳、財務報表與分析、合約審閱與法律風險把關。',
    task: '月底結帳加上一疊待審合約。前線同事都在用 AI，你們還靠人工。要自己先找 AI 工具來用，還是等公司訂好規則？',
    quote: { text: '第一個隱憂，是資料安全。', article: 'a01', page: '10–11' },
    slider: '例行作業交給 AI 處理幾成？', ai: 70, twin: 30,
  },
  aiproduct: {
    name: 'AI 產品',
    does: '規劃、開發集團內部的 AI 工具，讓各品牌的同事使用。',
    task: '你負責一套 Persona 工具。業務同事希望它每一題都給出漂亮的百分比，好放進提案。證據不足的題目，要讓工具硬給數字嗎？',
    quote: { text: '不是每一個問題都必須產生答案，有時候指出資料缺口，本身就是最有價值的答案。', article: 'a12', page: '112–113' },
    slider: '讓工具自動給答案的比例放到幾成？', ai: 100, twin: 60,
  },
  thinktank: {
    name: '智庫',
    does: '做消費者研究與產業觀點，編寫集團的研究出版品。',
    task: '你的第一個任務：加入一本刊物的編輯團隊，那本刊物叫《決策智慧》。同時，客戶突然丟來一個問題，你手上只有幾個月前的報告。',
    quote: { text: '客戶突然丟來一個問題，而你手上只有幾個月前印好的報告。', article: 'a12', page: '98–99' },
    slider: '先交給 AI 消費者分身回答幾成？', ai: 80, twin: 60,
  },
  amplifi: {
    name: '媒體投資',
    does: '替全集團和媒體談價、買版位。',
    task: '你要替全集團談下一季的媒體採購。官網理念是「Make Every Impression Count」；但刊物裡有人說，曝光越買越多，品牌反而越淡。',
    quote: { text: '陷入成效越優化、品牌越萎縮的惡性循環「The Doom Loop」', article: 'a10', page: '72–73', note: '安布思沛作者的觀點' },
    slider: '採購配置交給 AI 決定幾成？', ai: 90, twin: 70,
  },
  tag: {
    name: '內容製作',
    does: '用 AI 工作流程大量製作內容，供應各通路使用。',
    task: '同一支內容要在 LINE、Dcard、PTT 上都打中人，客戶要 60 個版本，週五上線。',
    quote: { text: '同一內容在這個平台能引發共鳴，換到另一個平台可能毫無迴響。', article: 'a21', page: '182–183' },
    slider: '版本製作交給 AI 生成幾成？', ai: 90, twin: 80,
  },
  consult: {
    name: '轉型顧問',
    does: '協助企業規劃轉型策略，讓策略落地、文化改變。',
    task: '客戶 CEO 重金買了最新的 AI 工具，卻陷入「高期待、高投資、低成功率」。他希望你下週給他一份導入清單。',
    quote: { text: '請暫時放下手邊昂貴的 AI 採購清單，對自己的組織進行一次誠實的靈魂拷問', article: 'a16', page: '148–149' },
    slider: '診斷報告交給 AI 產出幾成？', ai: 80, twin: 50,
  },
};

// 品牌：share 為占比（%）；roles 為可抽到的基層職務
// logo：官網取得的 Logo（已轉為深色吊牌用的白色版）；尚未取得官方 Logo 的品牌以 logoText 文字代替
export const BRANDS = [
  { id: 'dentsux', logo: 'dentsux.png', name: 'dentsu X', zh: '貝立德', share: 15.1, debate: 'D5', articles: ['a13', 'a11', 'a08'],
    card: '「1999 年在台成立」的媒體代理商，以「4X 轉型架構」從媒體企劃延伸到顧客體驗與商業轉型。',
    roles: [['媒體企劃專員', 'planning'], ['營業專員', 'account']] },
  { id: 'carat', logo: 'carat.png', name: 'Carat', zh: '凱絡媒體', share: 14.4, debate: 'D3', articles: ['a09', 'a14'],
    card: '「以品牌智能幕僚為定位」的媒體代理商，理念是「Designing for People」。',
    roles: [['媒體企劃專員', 'planning'], ['媒體購買專員', 'buying'], ['廣告優化專員', 'buying']] },
  { id: 'taiwandentsu', logo: null, logoText: 'taiwan dentsu', name: 'Taiwan Dentsu', zh: '台灣電通', share: 14.3, debate: 'D1', articles: ['a03', 'a20'],
    card: '「整合創意代理商」，定位「The Trusted Frontline Enabler of Taiwan」；拿下台灣第一座坎城全場最大獎。',
    roles: [['營業專員', 'account']] },
  { id: 'iprospect', logo: 'iprospect.svg', name: 'iProspect', zh: '安布思沛', share: 12.3, debate: 'D3', articles: ['a10', 'a19'],
    card: '「數位優先的全方位媒體代理商」，專注「將消費者意圖轉化為實際行動」，整合數位媒體、商務、SEO 與 GEO。',
    roles: [['媒體企劃專員', 'planning'], ['廣告優化專員', 'buying']] },
  { id: 'hq', logo: 'dentsu.png', name: 'HQ', zh: '集團總部', share: 11.3, debate: 'D6', articles: ['a01', 'a16'],
    card: '集團的後勤單位：財務、法務、IT 等，支撐所有品牌運作。',
    roles: [['會計專員', 'backoffice'], ['財務分析專員', 'backoffice'], ['法務', 'backoffice']] },
  { id: 'isobar', logo: 'isobar.png', name: 'Isobar', zh: '安索帕', share: 10.6, debate: 'D1b', articles: ['a15', 'a04', 'a05', 'a06', 'a07'],
    card: '「數位原生創意代理商」，核心理念「Creativity++」，提供從品牌定位到全通路體驗的端到端方案。',
    roles: [['業務（AM）', 'account'], ['文案', 'creative'], ['藝術指導', 'creative'], ['媒體企劃專員', 'planning'], ['網站工程師', 'web']] },
  { id: 'dentsuone', logo: 'dentsuone.png', name: 'dentsu One', zh: '電通國華', share: 8.0, debate: 'D2', articles: ['a04'],
    card: '「創立於 1961 年」，「新品種創意代理商」的整合服務模式，核心策略「Transformative Creativity」。',
    roles: [['營業專員', 'account'], ['策略企劃專員', 'strategy'], ['文案', 'creative']] },
  { id: 'merkle', logo: 'merkle.png', name: 'Merkle', zh: '美庫爾', share: 4.0, debate: 'D3', articles: ['a17', 'a18'],
    card: '「顧客體驗管理（CXM）顧問公司」，提供會員工程、CXM 體驗工程、數據工程、決策工程。',
    roles: [['CRM 轉型專員', 'crm'], ['數據與解決方案架構師', 'crm'], ['資料科學家', 'crm']] },
  { id: 'amplifi', logo: 'amplifi.png', name: 'Amplifi', zh: '安浦菲', share: 2.8, debate: 'D4', articles: ['a10', 'a13'],
    card: '「負責整合集團旗下所有供應端夥伴資源」，理念「Make Every Impression Count」。',
    roles: [['媒體投資專員', 'amplifi']] },
  { id: 'dsc', logo: 'dsc.png', name: 'DSC', zh: '電通智能中心', share: 2.7, debate: 'D1', articles: ['a02', 'a12', 'a22'],
    card: '2021 年成立，透過電通智能工作平台 dentsu pro 提升團隊效能，並建立智庫以獨創方法論支援商業轉型。',
    roles: [['AI 產品開發', 'aiproduct'], ['智庫研究員', 'thinktank']] },
  { id: 'tag', logo: 'tag.png', name: 'Tag', zh: '泰意', share: 2.4, debate: 'D2', articles: ['a21'],
    card: '「迅速且大規模的打造引人注目的內容」，涵蓋內容創作、行銷推動與數據分析。',
    roles: [['內容製作專員', 'tag']] },
  { id: 'consult', logo: null, logoText: 'dentsu consult', name: 'dentsu Consult', zh: '電通商業顧問', share: 2.0, debate: 'D6', articles: ['a16'],
    card: '以 Brand++ 為核心，提供品牌、數位與 AI、永續、文化、產品服務五大顧問服務。',
    roles: [['轉型顧問', 'consult']] },
];

// 第 1 年：所有人都會遇到 People Model（全集團的時刻）
export const YEAR1 = {
  title: '第 1 年｜People Model 來敲門',
  body: '明天要提案，你想知道目標族群會不會買單。DSC 做的 People Model 可以讓你先問 AI 消費者分身；你也可以自己去找真人聊。',
  quote: { text: 'Simulation Before Decision.（先模擬再決策）', article: 'a12', page: '104–105' },
  quote2: { text: '它不取代真人研究，只是把前期探索的門檻大幅降低，讓團隊把時間留給真正重要的判斷。', article: 'a12', page: '98–99' },
  options: [
    { key: 'model', label: '先問 AI 分身，再決定', delegate: 70 },
    { key: 'human', label: '直接找真人，不靠模擬', delegate: 0 },
  ],
  ai: 'model', twinHigh: 'model', twinLow: 'human',
};

// 第 1 年（內部職務版）：HQ 與 DSC 系統派不面對客戶、也不提案，改從「資料把關」的角度遇到 People Model
export const INTERNAL_FAMILIES = ['backoffice', 'aiproduct'];
export const YEAR1_INTERNAL = {
  title: '第 1 年｜前線想用 People Model',
  body: '各品牌開始用 DSC 的 People Model 做提案，有人想把客戶的調查資料放進 AI 工具裡分析。IT 和法務找上你：要先讓前線用，邊用邊訂規則？還是先把規則訂好，再開放使用？',
  quote: { text: '企業需要清楚界定哪些資料可以進入 AI 系統、由誰核准、如何稽核', article: 'a01', page: '10–11' },
  quote2: null,
  options: [
    { key: 'allow', label: '先讓前線用，邊用邊訂規則', delegate: 60 },
    { key: 'govern', label: '先訂好規則，再開放使用', delegate: 20 },
  ],
  ai: 'allow', twinHigh: 'allow', twinLow: 'govern',
};

// 辯論庭：沒有對錯
export const DEBATES = {
  D1: { q: '人可以被模擬嗎？',
    a: { who: 'People Model 團隊', text: '把最昂貴的試錯，留在虛擬世界完成。', article: 'a12', page: '98–99' },
    b: { who: '周麗君', text: '真正強大的品牌，擁有讓人願意拋開理性的魔力。', article: 'a03', page: '26–27' },
    bridge: { text: '不是每一個問題都必須產生答案，有時候指出資料缺口，本身就是最有價值的答案。', who: 'People Model 團隊', article: 'a12', page: '112–113' } },
  D1b: { q: '人可以被模擬嗎？',
    a: { who: 'People Model 團隊', text: '把最昂貴的試錯，留在虛擬世界完成。', article: 'a12', page: '98–99' },
    b: { who: '楊欣怡', text: 'AI 可以生成一萬篇感人的故事，但它無法生成一位百歲爺爺真正跑向終點時流下的汗水', article: 'a06', page: '48–49' },
    bridge: { text: '不是每一個問題都必須產生答案，有時候指出資料缺口，本身就是最有價值的答案。', who: 'People Model 團隊', article: 'a12', page: '112–113' } },
  D2: { q: 'AI 量產，是放大還是稀釋？',
    a: { who: 'Trent Agnew', text: 'AI 不只提升內容產製效率，更能串聯人才、創意與技術', article: 'a21', page: '182–183' },
    b: { who: '潘其偉', text: '品牌很可能因為 AI 的規模化生產，而逐漸滑向市場平均值。', article: 'a20', page: '176–177' },
    bridge: { text: '兩人都把關鍵放在 AI 背後的人：一位稱之為「AI 製作人」，一位稱之為「規格」。', who: '編者整理', article: null } },
  D3: { q: '要不要說給 AI 聽？',
    a: { who: '王姿喨、詹佳穎、黃靖婷', text: '下一個十年，企業要問的不只是顧客怎麼想，還有 AI 怎麼判斷、怎麼選擇、怎麼代替顧客做決定。', article: 'a18', page: '166–167' },
    b: { who: '孫韞筑', text: '那就多生產 AI 喜歡的內容吧。這正是最危險的地方。', article: 'a09', page: '68–69' },
    bridge: { text: '被 AI 看見，是技術的優化；被消費者記住，才是品牌的真本事。', who: '莊閔雯、呂季霖', article: 'a19', page: '174–175' } },
  D4: { q: '曝光，還是注意力？',
    a: { who: 'Amplifi 官網', text: 'Make Every Impression Count', article: null, page: null },
    b: { who: '徐莉媛', text: '曝光不再稀缺，品牌應從買聲量轉向經營注意力', article: 'a10', page: '72–73' },
    bridge: { text: '兩方其實在追問同一件事：每一次曝光，是否真的被看見。', who: '編者整理', article: null } },
  D5: { q: 'Agent 會不會取代共同記憶？',
    a: { who: '王姿喨、詹佳穎、黃靖婷', text: '當 Agent 可能只向顧客呈現三個選項而不是三十個，品牌如何被理解、被排序、被信任，將成為新的競爭場。', article: 'a18', page: '162–163' },
    b: { who: '吳宗霖、陳炯文', text: '下一次大家共同記住一件事時，我的品牌能不能也在裡面？', article: 'a11', page: '92–93' },
    bridge: { text: '選項變少的時候，被記住反而更重要。', who: '編者整理', article: null } },
  D6: { q: '先做再說，還是先顧文化？',
    a: { who: '唐心慧', text: 'Learning by doing. 沒有完美的計畫　只有不斷學習的行動', article: 'a01', page: '10–11' },
    b: { who: '王馥蓓、周允玉', text: '請暫時放下手邊昂貴的 AI 採購清單，對自己的組織進行一次誠實的靈魂拷問', article: 'a16', page: '148–149' },
    bridge: { text: '但興奮，不能取代警覺。', who: '唐心慧', article: 'a01', page: '10–11' } },
};

// 辯論庭裁決之後：玩家選了一邊，就給他「另一邊」最有力的一句話（皆出自原刊）
export const DEBATE_MORE = {
  D1: {
    a: { who: '邵懿文', text: '過去是猜，現在證明模擬結果已經具備支持商業決策的可信度。', article: 'a02', page: '14–15' },
    b: { who: '周麗君', text: 'AI 很懂邏輯，但人，從不只靠邏輯活著。', article: 'a03', page: '24–25' },
  },
  D1b: {
    a: { who: '邵懿文', text: '過去是猜，現在證明模擬結果已經具備支持商業決策的可信度。', article: 'a02', page: '14–15' },
    b: { who: '楊欣怡', text: '真實，依然是最有力量的內容。', article: 'a06', page: '48–49' },
  },
  D2: {
    a: { who: 'Trent Agnew', text: '能更快創造出具備文化共鳴的內容，就等於掌握了更高效的在地化能力。', article: 'a21', page: '184–185' },
    b: { who: '潘其偉', text: '未來的競爭焦點不再是誰能生產內容，而是誰能穩定且持續地交付品牌辨識度。', article: 'a20', page: '178–179' },
  },
  D3: {
    a: { who: '王姿喨、詹佳穎、黃靖婷', text: 'Touchpoint 變少，不代表品牌影響力不重要，反而每一次被 Agent 選中、推薦、呈現的機會，都會變得更關鍵。', article: 'a18', page: '162–163' },
    b: { who: '孫韞筑', text: 'AI 正替消費者篩選品牌，它讀的不是你怎麼說自己，而是別人怎麼說你。', article: 'a09', page: '66–67' },
  },
  D4: {
    a: { who: '吳宗霖、陳炯文', text: '誰有更多 GRP、Reach、Impression、版位與預算，就有更大機會被看見。這些仍然重要', article: 'a11', page: '90–91' },
    b: { who: '徐莉媛', text: '曝光正在通膨、注意力正在升值。', article: 'a10', page: '72–73' },
  },
  D5: {
    a: { who: '王姿喨、詹佳穎、黃靖婷', text: 'Touchpoint 變少，不代表品牌影響力不重要，反而每一次被 Agent 選中、推薦、呈現的機會，都會變得更關鍵。', article: 'a18', page: '162–163' },
    b: { who: '吳宗霖、陳炯文', text: '共同記憶真正的價值，不是把所有人帶回過去，而是讓不同世代，在今天重新碰面。', article: 'a11', page: '92–93' },
  },
  D6: {
    a: { who: '唐心慧', text: '在這個時代，市場不會等。', article: 'a01', page: '8–9' },
    b: { who: '王馥蓓、周允玉', text: 'AI 導入不是軍備採購競賽　而是以人為本的文化轉型', article: 'a16', page: '148–149' },
  },
};

// 第 3 年：依職務家族的處境（升上主管或還在原位，只改變開頭一句）
export const YEAR3_FAMILY = {
  planning: {
    body: 'AI 工具已經能自動排出 media plan，新人卻說不出為什麼這樣分配。客戶開會時問你：這波投放，到底是新增了需求，還是接住本來就想買的人？',
    quote: { text: 'AI 投放的效率悖論：這是新增需求還是接住本來就想買的人？', article: 'a13', page: '118–119' },
  },
  buying: {
    body: 'AI 自動出價幫團隊省下大半操作時間。省下來的時間，要拿來多接幾個帳戶，還是研究消費者到底有沒有真的看進廣告？',
    quote: { text: 'Viewability 是門票　Attention 才是資產', article: 'a10', page: '74–75' },
  },
  account: {
    body: '客戶把年約改成專案制，每一案都要證明成效才有下一案。團隊用 AI 一天就能做完提案，但客戶開始問：你們到底比別人多了什麼？',
    quote: { text: '長期年費型合約逐漸鬆動，專案型、模組型、成效導向的合作模式成為常態。', article: 'a04', page: '28–29' },
  },
  creative: {
    body: '團隊用 AI 一週產出上百支素材，數量是三年前的十倍。品牌主看完卻說：「每一支都不錯，但都很像。」',
    quote: { text: '創意的力量，從不來自「正確」，而來自「真實」。', article: 'a03', page: '24–25' },
  },
  strategy: {
    body: '客戶要你預測三年後消費者的生活會變成什麼樣子。AI 可以給你一個最可能的答案，但客戶要拿它來決定未來三年的投資。',
    quote: { text: '不是為了預言一個唯一正確的未來，而是為了探索多種可能的未來生活情境。', article: 'a05', page: '42–43' },
  },
  crm: {
    body: '你們的推薦模型上線了，結帳轉換率明顯提升。但兩週後，客服補件和退貨都變多，有顧客抱怨流程很亂。',
    quote: { text: '下單很快，但後續很亂。', article: 'a17', page: '154–155' },
  },
  web: {
    body: '你們做的 AI 客服上線了，詢問量下降。但顧客抱怨：在官網問過一次，轉給真人客服又要從頭說一遍。',
    quote: { text: '每換一個管道就要重新說明、重新確認，甚至得到不一致的答案。', article: 'a15', page: '138–139' },
  },
  backoffice: {
    body: '公司終於導入 AI 工具，結帳和合約審閱快了很多。但同事來問你：省下來的時間，到底要拿來做什麼？',
    quote: { text: '42% 基層使用員工表示，高階 AI 工具每週幫他們省下至少整整一天工作時間。但高達 66% 受訪者卻承認，根本沒有收到管理階層任何指引', article: 'a16', page: '144–145' },
  },
  aiproduct: {
    body: '你做的 Persona 工具在各品牌傳開了。你發現有人把工具的模擬結果，直接當成市調數據寫進提案。',
    quote: { text: '不能被當成市場已經發生的事實。', article: 'a12', page: '112–113' },
  },
  thinktank: {
    body: '下一期《決策智慧》要定題了。AI 幾分鐘就整理完一百篇趨勢報告，給了你十個候選題目，每一個看起來都對。',
    quote: { text: '企業真正面對的問題，從來不是答案不夠，而是解法太多', article: 'a14', page: '132–133' },
  },
  amplifi: {
    body: '媒體平台推出全自動的 AI 投放方案，告訴客戶「預算交給我們就好」。你負責和平台談下一年的合作條件。',
    quote: { text: 'AI 投放讓效率提高也讓競爭更集中', article: 'a13', page: '118–119' },
  },
  tag: {
    body: '客戶很滿意你們的產量，一個月上千支版本。但他開始問：這麼多支，哪一支真的有用？',
    quote: { text: '人才、創意工藝與科技，都必須以成效為基礎。', article: 'a21', page: '186–187' },
  },
  consult: {
    body: '客戶 CEO 說：「員工都在用 AI 了，我們轉型成功了。」你做了內部訪談，發現大家只是在用工具，工作方式沒有改變。',
    quote: { text: '台灣企業轉型多半聚焦於「工具層次」優化，卻未真正走進「人的層次」', article: 'a16', page: '144–145' },
  },
};

// 第 3 年：分配 10 小時
export const YEAR3 = {
  mid: {
    title: '第 3 年｜你升上中階主管',
    lead: '你升上了中階主管，向上要成果，向下要帶人。',
    quote: { text: '42% 基層使用員工表示，高階 AI 工具每週幫他們省下至少整整一天工作時間。但高達 66% 受訪者卻承認，根本沒有收到管理階層任何指引', article: 'a16', page: '144–145' },
    buckets: ['導入 AI 工具', '帶團隊', '陪客戶', '自己進修'],
    ai: [6, 1, 2, 1],
  },
  base: {
    title: '第 3 年｜同梯升了，你還沒',
    lead: '同梯有人升上主管了，你還在原本的位置。',
    quote: { text: '一旦人類放棄思考，失去 Judge 能力，便容易淪為 AI 答案的接收端，而非問題的定義者與方向的決定者。', article: 'a14', page: '130–131' },
    buckets: ['交給 AI 工具', '自己動手做', '陪客戶', '自己進修'],
    ai: [6, 2, 1, 1],
  },
};

// 第 5 年
export const YEAR5 = {
  leader: {
    title: '第 5 年｜你成了大家長',
    body: '業績和推動 AI 同時壓在你身上。公司投資了一大筆 AI 預算，董事會問你：轉型成果如何？',
    options: [
      { key: 'announce', label: '對外宣布「轉型很成功」' },
      { key: 'listen', label: '先去聽基層怎麼說' },
    ],
    ai: 'announce', twinHigh: 'announce', twinLow: 'listen',
  },
  other: {
    title: '第 5 年｜一通獵頭電話',
    body: '你發現自己工作裡有一大塊，AI 已經做得到了。這時獵頭來電，另一邊也有朋友找你創業。',
    options: [
      { key: 'stay', label: '留下來，把 AI 做不到的那塊做好' },
      { key: 'jump', label: '接受獵頭，換個舞台' },
      { key: 'startup', label: '自己出去闖' },
    ],
    ai: 'jump', twinHigh: 'jump', twinLow: 'stay',
  },
};

export const ENDINGS = {
  boss: {
    title: '你升上了電通的老闆',
    quote: { text: '讓 AI 協助可被規格化的執行項目，而讓 PI 真正不可取代的價值判斷，就是「衡斷力（Judgment）」。', article: 'a14', page: '132–133' },
  },
  replaced: {
    title: '離開：你的位置被 AI 取代了',
    quote: { text: '一旦人類放棄思考，失去 Judge 能力，便容易淪為 AI 答案的接收端', article: 'a14', page: '130–131' },
  },
  behind: {
    title: '離開：你跟不上了',
    quote: { text: '在這個時代，市場不會等。一份計劃還沒成熟，市場已經往前走了。', article: 'a01', page: '8–9' },
  },
  stay: {
    title: '你留下來了，依舊是電通一家人',
    quote: { text: 'Learning by doing. 沒有完美的計畫　只有不斷學習的行動', article: 'a01', page: '10–11' },
  },
  ownway: {
    title: '離開：你走上自己的路',
    quote: { text: '人，仍然是最後的答案', article: 'a02', page: '16–17' },
  },
};

// AI 分身介紹頁：連回刊物的 People Model 特別企劃
export const TWIN_INTRO = {
  q1: { text: '電通台灣以獨家 CCS 調查為基礎打造 People Model，用 AI 數位分身模擬真實消費者，讓你隨時與消費者對話，不用靠猜的。', article: 'a12', page: '96–97' },
  q2: { text: '背後都對應一位真實受訪者，跟真人調查結果的吻合程度達到 0.89。', article: 'a02', page: '14–15' },
};

export const GAP19 = { text: '在台灣市場，高階主管對轉型成果的正面感受，足足比基層員工高出 19%。', article: 'a16', page: '144–145' };
export const TWIN_LIMIT = { text: '也不代表模型已全然理解人的心理機制或能正確預測每一個人的行為。', article: 'a12', page: '110–111' };

export const COHORT_NAMES = ['Annie', 'Kevin', 'Mia', 'Jason', 'Yuna', 'Joanne', 'Eric', 'Vivian', 'Leo', 'Grace', 'Ryan', 'Iris'];
