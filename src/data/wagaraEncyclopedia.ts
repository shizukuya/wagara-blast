// =============================================================================
// Wagara Blast - Wagara Encyclopedia (Bilingual ja/en)
// =============================================================================

import { WagaraInfo, WagaraType } from '@/types';

// ---------------------------------------------------------------------------
// Full bilingual encyclopedia entries for all seven wagara patterns.
// ---------------------------------------------------------------------------

export const WAGARA_ENCYCLOPEDIA: Record<WagaraType, WagaraInfo> = {
  // -------------------------------------------------------------------------
  // 1. Ichimatsu -- Checker / Checkered pattern
  // -------------------------------------------------------------------------
  ichimatsu: {
    type: 'ichimatsu',
    nameJa: '市松',
    nameEn: 'Ichimatsu (Checker)',
    meaningJa:
      '二色の正方形を交互に並べた格子模様。途切れることなく続く柄は「繁栄」の象徴とされる。',
    meaningEn:
      'A checkerboard pattern of alternating two-color squares. Because the pattern continues endlessly, it is regarded as a symbol of prosperity and eternity.',
    historyJa:
      '江戸時代中期、歌舞伎役者・佐野川市松がこの柄の袴を舞台で着用したことで大流行し、「市松模様」と呼ばれるようになった。それ以前は「石畳」模様として古墳時代の埴輪にも見られる、日本最古級の伝統柄の一つである。2020年東京オリンピックのエンブレムにも採用された。',
    historyEn:
      'In the mid-Edo period (18th century), kabuki actor Sanogawa Ichimatsu wore hakama trousers featuring this pattern on stage, sparking a massive fashion trend. The pattern became known as "Ichimatsu-moyou" after the actor. Prior to this, it was called "ishidatami" (stone pavement) and can be traced back to haniwa clay figures from the Kofun period (3rd-6th century), making it one of Japan\'s oldest traditional patterns. It was also adopted as the emblem of the 2020 Tokyo Olympics.',
    frequency: 5,
  },

  // -------------------------------------------------------------------------
  // 2. Asanoha -- Hemp Leaf
  // -------------------------------------------------------------------------
  asanoha: {
    type: 'asanoha',
    nameJa: '麻の葉',
    nameEn: 'Asanoha (Hemp Leaf)',
    meaningJa:
      '正六角形を基本に、麻の葉の形を模した幾何学模様。麻は丈夫で真っ直ぐ育つことから「健やかな成長」を願う意味が込められている。',
    meaningEn:
      'A geometric pattern based on regular hexagons that resembles hemp leaves. Because hemp grows strong and straight, the pattern symbolizes a wish for healthy growth and resilience.',
    historyJa:
      '平安時代から仏教美術の装飾に用いられ、鎌倉時代には衣服の柄として広まった。特に赤ちゃんの産着や子供の着物に好んで使われ、子供が麻のように丈夫にすくすく育つことを願う親心が込められている。江戸時代には歌舞伎の衣装にも多用され、庶民の間でも広く親しまれた。',
    historyEn:
      'The pattern has been used in Buddhist art since the Heian period (794-1185) and spread to clothing designs during the Kamakura period (1185-1333). It was especially popular for baby garments and children\'s kimono, expressing parents\' hopes that their children would grow as strong and straight as hemp. During the Edo period, it was frequently used in kabuki costumes and became widely beloved among the common people.',
    frequency: 4,
  },

  // -------------------------------------------------------------------------
  // 3. Seigaiha -- Blue Ocean Waves
  // -------------------------------------------------------------------------
  seigaiha: {
    type: 'seigaiha',
    nameJa: '青海波',
    nameEn: 'Seigaiha (Blue Ocean Waves)',
    meaningJa:
      '扇形の波が幾重にも重なり、無限に広がる大海原を表現した模様。「平穏な暮らし」と「未来永劫の幸福」を象徴する。',
    meaningEn:
      'A pattern of layered, fan-shaped waves spreading infinitely to represent the vast ocean. It symbolizes a peaceful life and everlasting happiness.',
    historyJa:
      '起源はペルシアにあるとされ、シルクロードを経て中国、そして日本に伝わった。日本では飛鳥時代（7世紀）の法隆寺の染織品に見られる。名称は雅楽の演目「青海波」に由来し、舞人がこの模様の衣装を身につけたことから広まった。源氏物語にも光源氏が「青海波」を舞う場面が描かれている。',
    historyEn:
      'The pattern is believed to have originated in Persia and traveled along the Silk Road through China to Japan. In Japan, it appears on textiles at Horyu-ji temple from the Asuka period (7th century). Its name derives from the gagaku (court music) piece "Seigaiha," in which dancers wore costumes bearing this pattern. The Tale of Genji also depicts a scene where Hikaru Genji performs the "Seigaiha" dance.',
    frequency: 4,
  },

  // -------------------------------------------------------------------------
  // 4. Shippou -- Seven Treasures
  // -------------------------------------------------------------------------
  shippou: {
    type: 'shippou',
    nameJa: '七宝',
    nameEn: 'Shippou (Seven Treasures)',
    meaningJa:
      '同じ大きさの円を四分の一ずつ重ねた連続模様。円満・調和・ご縁を表し、仏教の七つの宝物にちなんで「七宝」と名付けられた。',
    meaningEn:
      'A continuous pattern of circles overlapping by one quarter. It represents harmony, perfection, and human connections. Named after the Seven Treasures of Buddhism (gold, silver, lapis lazuli, crystal, agate, red pearl, and carnelian).',
    historyJa:
      '仏教伝来とともに日本に伝わり、正倉院の宝物にもこの模様が見られる。「輪違い」とも呼ばれ、人と人との縁が永遠に続く円満な関係を表す吉祥文様として、着物の帯や陶磁器、建築装飾など幅広い分野で愛用されてきた。四方に無限に広がる様子から「しっぽう（四方）」とも解釈される。',
    historyEn:
      'The pattern came to Japan along with Buddhism and can be found among the treasures of the Shosoin repository in Nara. Also called "wa-chigai" (interlocking rings), it is an auspicious motif representing eternal, harmonious connections between people. It has been widely used across many fields including kimono obi sashes, ceramics, and architectural decoration. Some interpret the name as a play on "shippou" meaning "four directions" (shi-hou), referring to how the pattern extends infinitely in all directions.',
    frequency: 3,
  },

  // -------------------------------------------------------------------------
  // 5. Yagasuri -- Arrow Feather
  // -------------------------------------------------------------------------
  yagasuri: {
    type: 'yagasuri',
    nameJa: '矢絣',
    nameEn: 'Yagasuri (Arrow Feather)',
    meaningJa:
      '矢羽根（矢の尾部の羽）を図案化した模様。放たれた矢は戻らないことから「決断」「出世」の意味があり、嫁入り道具の着物に使われた。',
    meaningEn:
      'A pattern depicting stylized arrow fletching (the feathers at the tail of an arrow). Since a shot arrow never returns, it symbolizes determination and advancement. It was traditionally used on kimono given as part of a bride\'s trousseau.',
    historyJa:
      '矢は古来より破魔の力があるとされ、神社の破魔矢にもその信仰が残る。江戸時代、武家社会では嫁に出す娘に矢絣の着物を持たせた。「出戻らない（射た矢は戻らない）」という縁起を担いだものである。明治・大正時代には女学生の袴姿に矢絣の着物を合わせるスタイルが大流行し、「はいからさん」の象徴となった。',
    historyEn:
      'Arrows have been believed to possess the power to ward off evil since ancient times, a belief still reflected in the hamaya (demon-breaking arrows) sold at Shinto shrines. During the Edo period, samurai families sent their daughters off to marriage with yagasuri kimono, carrying the auspicious meaning that "a shot arrow does not return" (i.e., the bride would not come back divorced). In the Meiji and Taisho eras (late 19th - early 20th century), the combination of yagasuri kimono with hakama became a hugely popular style among female students, becoming an iconic symbol of the modern "haikara-san" woman.',
    frequency: 3,
  },

  // -------------------------------------------------------------------------
  // 6. Kikkou -- Tortoise Shell
  // -------------------------------------------------------------------------
  kikkou: {
    type: 'kikkou',
    nameJa: '亀甲',
    nameEn: 'Kikkou (Tortoise Shell)',
    meaningJa:
      '正六角形を隙間なく敷き詰めた模様で、亀の甲羅に似ていることからこの名がある。「長寿」と「不老不死」の象徴。',
    meaningEn:
      'A tessellation of regular hexagons that resembles a tortoise shell, from which it takes its name. It symbolizes longevity and immortality.',
    historyJa:
      '「鶴は千年、亀は万年」という言葉に代表されるように、亀は古来より長寿の象徴である。亀甲模様は奈良時代にはすでに正倉院の宝物に見られ、格調高い吉祥文様として公家や武家の調度品、神社仏閣の装飾に用いられてきた。六角形の中に花を配した「亀甲花菱」や、三つの亀甲を組み合わせた「毘沙門亀甲」などのバリエーションも豊富である。',
    historyEn:
      'As the Japanese saying goes, "The crane lives a thousand years, the tortoise ten thousand years" -- the tortoise has been a symbol of longevity since ancient times. The hexagonal tortoise shell pattern can already be found among the Shosoin treasures from the Nara period (8th century). As a dignified auspicious motif, it has been used in furnishings of the court aristocracy and samurai, as well as in shrine and temple decoration. Many variations exist, such as "kikkou-hanabishi" (hexagons with flower motifs inside) and "bishamon-kikkou" (three interlocking hexagons, named after the Buddhist guardian deity Bishamonten).',
    frequency: 2,
  },

  // -------------------------------------------------------------------------
  // 7. Uroko -- Scales / Triangles
  // -------------------------------------------------------------------------
  uroko: {
    type: 'uroko',
    nameJa: '鱗',
    nameEn: 'Uroko (Scales)',
    meaningJa:
      '三角形を上下交互に並べた模様で、蛇や龍の鱗に見立てられる。「厄除け」「再生」の意味を持つ魔除けの文様。',
    meaningEn:
      'A pattern of triangles arranged in alternating rows, evoking the scales of snakes and dragons. It serves as a protective talisman symbolizing warding off evil and renewal/regeneration.',
    historyJa:
      '蛇は脱皮を繰り返すことから「再生」「不死」の象徴とされ、古来より信仰の対象であった。鱗模様は北条家の家紋「三つ鱗」にも採用されている。能の演目「道成寺」では、女の情念が蛇と化す場面で鱗模様の衣装が使われ、超自然的な力を表現する文様としても知られる。三角形には魔除けの力があるとされ、厄除けとして身につける風習があった。',
    historyEn:
      'Because snakes repeatedly shed their skin, they have been symbols of rebirth and immortality since ancient times and objects of spiritual reverence. The scale pattern was adopted as the family crest of the Hojo clan ("mitsu-uroko," three scales). In the Noh play "Dojoji," scale-patterned costumes are worn in the scene where a woman\'s passion transforms her into a serpent, making the pattern well-known as an expression of supernatural power. Triangles themselves were believed to possess the power to ward off evil, and there was a custom of wearing scale patterns as talismans for protection.',
    frequency: 2,
  },
};

// ---------------------------------------------------------------------------
// Convenience: ordered array of all encyclopedia entries
// ---------------------------------------------------------------------------

export const WAGARA_ENCYCLOPEDIA_LIST: WagaraInfo[] = [
  WAGARA_ENCYCLOPEDIA.ichimatsu,
  WAGARA_ENCYCLOPEDIA.asanoha,
  WAGARA_ENCYCLOPEDIA.seigaiha,
  WAGARA_ENCYCLOPEDIA.shippou,
  WAGARA_ENCYCLOPEDIA.yagasuri,
  WAGARA_ENCYCLOPEDIA.kikkou,
  WAGARA_ENCYCLOPEDIA.uroko,
];

/**
 * Look up the encyclopedia entry for a wagara type.
 */
export function getWagaraInfo(type: WagaraType): WagaraInfo {
  return WAGARA_ENCYCLOPEDIA[type];
}

/**
 * Get all discovered wagara encyclopedia entries for a given set of types.
 */
export function getDiscoveredEntries(
  discovered: WagaraType[],
): WagaraInfo[] {
  return discovered.map((t) => WAGARA_ENCYCLOPEDIA[t]);
}
