/* معرفة — a Wikipedia-style encyclopedia, Saudi themed.
 *
 * Content ships as seed articles below. Anything the user edits is stored in
 * DB('wiki') as wikitext keyed by article id and overrides the seed; deleting
 * the row restores the original, so the seed is never mutated.
 *
 * Wikitext is deliberately tiny:
 *   == heading ==     starts a section
 *   blank-line split  paragraphs
 *   [[id]] / [[id|label]]  internal link (unknown id renders red, like a stub)
 */

const WIKI = { name: 'معرفة', tag: 'الموسوعة الحرة' };

const WIKI_CATS = {
  geo: 'جغرافيا',
  city: 'مدن',
  hist: 'تاريخ',
  cult: 'ثقافة وتراث',
  econ: 'اقتصاد',
  people: 'شخصيات',
};

const WIKI_ARTICLES = [
  {
    id: 'ksa', t: 'المملكة العربية السعودية', cat: 'geo', glyph: '🇸🇦',
    lead: [
      'المملكة العربية السعودية دولة تقع في جنوب غرب آسيا، وتشغل نحو أربعة أخماس شبه الجزيرة العربية، وهي أكبر دول الشرق الأوسط مساحة. عاصمتها [[riyadh]] وأكبر مدنها، ولغتها الرسمية العربية، وعملتها الريال السعودي.',
      'تضم المملكة أقدس موقعين في الإسلام: [[makkah|المسجد الحرام في مكة المكرمة]] و[[madinah|المسجد النبوي في المدينة المنورة]]، ويقصدهما ملايين الحجاج والمعتمرين سنويًا.',
    ],
    box: [
      ['العاصمة', 'الرياض'],
      ['التأسيس', '23 سبتمبر 1932'],
      ['نظام الحكم', 'ملكي'],
      ['اللغة الرسمية', 'العربية'],
      ['العملة', 'الريال السعودي (SAR)'],
      ['المناطق الإدارية', '13 منطقة'],
      ['التوقيت', 'UTC+3'],
    ],
    secs: [
      { h: 'التاريخ', p: [
        'قامت على أرض المملكة ثلاث دول سعودية: الأولى عام 1727م وعاصمتها [[diriyah]]، والثانية عام 1824م، ثم الدولة السعودية الثالثة التي بدأت باستعادة [[abdulaziz|الملك عبدالعزيز]] للرياض عام 1902م.',
        'أُعلن توحيد البلاد باسم المملكة العربية السعودية في 23 سبتمبر 1932م، ويُحتفل بهذا اليوم سنويًا بوصفه اليوم الوطني.',
      ] },
      { h: 'الجغرافيا', p: [
        'تطل المملكة على [[redsea|البحر الأحمر]] غربًا والخليج العربي شرقًا. تتنوع تضاريسها بين سهل تهامة الساحلي وجبال السروات في الغرب وهضبة نجد في الوسط و[[rubalkhali]] في الجنوب الشرقي.',
        'المناخ صحراوي حار جاف في معظم المناطق، معتدل في المرتفعات الجنوبية الغربية مثل [[abha|أبها]] حيث تهطل الأمطار الموسمية.',
      ] },
      { h: 'الاقتصاد', p: [
        'يقوم الاقتصاد تقليديًا على النفط عبر [[aramco]]، وتعمل [[vision2030]] على تنويع مصادر الدخل بتوسيع قطاعات السياحة والترفيه والصناعة والتعدين والخدمات اللوجستية.',
      ] },
    ],
    see: ['riyadh', 'vision2030', 'abdulaziz', 'diriyah'],
  },

  {
    id: 'riyadh', t: 'الرياض', cat: 'city', glyph: '🏙️',
    lead: [
      'الرياض عاصمة [[ksa|المملكة العربية السعودية]] وأكبر مدنها سكانًا، وتقع في وسط هضبة نجد على ارتفاع نحو 600 متر عن سطح البحر. اسمها مشتق من «الروضة»، وهي الأرض الخصبة التي يجتمع فيها ماء المطر.',
    ],
    box: [
      ['المنطقة', 'منطقة الرياض'],
      ['التأسيس الحديث', '1902م'],
      ['الارتفاع', '~600 م'],
      ['أبرز المعالم', 'المصمك · المملكة · الفيصلية'],
    ],
    secs: [
      { h: 'التاريخ', p: [
        'نشأت الرياض قرب موقع مدينة حجر اليمامة القديمة. وفي 15 يناير 1902م استعادها [[abdulaziz|الملك عبدالعزيز]] في معركة [[masmak|قصر المصمك]]، فكانت نقطة انطلاق الدولة السعودية الثالثة.',
        'تحولت المدينة خلال القرن العشرين من بلدة مسوّرة إلى عاصمة سياسية وإدارية ومالية، وانتقلت إليها الوزارات من [[jeddah]] تدريجيًا.',
      ] },
      { h: 'المعالم', p: [
        'من أبرز معالمها برج المملكة وبرج الفيصلية ومركز الملك عبدالله المالي وحي [[diriyah|الدرعية]] التاريخي المجاور، إضافة إلى وادي حنيفة ومتحف المملكة الوطني.',
      ] },
    ],
    see: ['ksa', 'diriyah', 'masmak'],
  },

  {
    id: 'makkah', t: 'مكة المكرمة', cat: 'city', glyph: '🕋',
    lead: [
      'مكة المكرمة أقدس مدن الإسلام، وفيها المسجد الحرام الذي تتوسطه الكعبة المشرفة قبلة المسلمين في صلاتهم. تقع غرب [[ksa|المملكة]] في وادٍ محاط بالجبال على بعد نحو 70 كم من [[jeddah]].',
    ],
    box: [
      ['المنطقة', 'منطقة مكة المكرمة'],
      ['المكانة', 'أقدس مدن الإسلام'],
      ['أبرز معالمها', 'المسجد الحرام · الكعبة'],
      ['الموسم', 'الحج والعمرة'],
    ],
    secs: [
      { h: 'المسجد الحرام', p: [
        'يُعد المسجد الحرام أكبر مسجد في العالم مساحةً، وقد توسّع عبر العصور توسعات متتالية لاستيعاب أعداد المصلين المتزايدة، وأضخمها التوسعات السعودية الحديثة.',
      ] },
      { h: 'الحج', p: [
        'يقصد المدينة سنويًا ملايين الحجاج لأداء الحج في شهر ذي الحجة، إضافة إلى المعتمرين على مدار العام. وتشمل المشاعر المقدسة منى وعرفات ومزدلفة.',
      ] },
    ],
    see: ['madinah', 'ksa'],
  },

  {
    id: 'madinah', t: 'المدينة المنورة', cat: 'city', glyph: '🕌',
    lead: [
      'المدينة المنورة ثاني أقدس المدن في الإسلام، وفيها المسجد النبوي الذي بناه النبي محمد ﷺ بعد الهجرة إليها عام 622م. كان اسمها قبل ذلك «يثرب».',
    ],
    box: [
      ['المنطقة', 'منطقة المدينة المنورة'],
      ['الهجرة النبوية', '622م'],
      ['أبرز معالمها', 'المسجد النبوي · قباء · أُحد'],
    ],
    secs: [
      { h: 'المعالم', p: [
        'إلى جانب المسجد النبوي، تضم المدينة مسجد قباء وهو أول مسجد بُني في الإسلام، وجبل أُحد وموقع غزوة الخندق، ومزارع النخيل المشهورة بتمر العجوة.',
      ] },
      { h: 'المكانة التاريخية', p: [
        'كانت المدينة عاصمة الدولة الإسلامية الأولى، ومنها انطلق الفتح الإسلامي في عهد الخلفاء الراشدين قبل انتقال العاصمة لاحقًا.',
      ] },
    ],
    see: ['makkah', 'ksa'],
  },

  {
    id: 'jeddah', t: 'جدة', cat: 'city', glyph: '⛵',
    lead: [
      'جدة مدينة ساحلية على [[redsea|البحر الأحمر]] وتُلقّب بـ«عروس البحر الأحمر»، وهي البوابة التاريخية لحجاج بيت الله الحرام والميناء الرئيس لغرب [[ksa|المملكة]].',
    ],
    box: [
      ['المنطقة', 'منطقة مكة المكرمة'],
      ['اللقب', 'عروس البحر الأحمر'],
      ['التراث العالمي', 'جدة التاريخية (البلد) — 2014'],
      ['أبرز المعالم', 'نافورة الملك فهد · الكورنيش'],
    ],
    secs: [
      { h: 'جدة التاريخية', p: [
        'تُعرف باسم «البلد»، وتتميز ببيوتها المبنية من الحجر المنقبي وواجهاتها الخشبية المعروفة بـ«الرواشين». أُدرجت في قائمة التراث العالمي لليونسكو عام 2014م.',
      ] },
      { h: 'المدينة الحديثة', p: [
        'تحتضن جدة نافورة الملك فهد وهي من أعلى النوافير في العالم، وكورنيشًا ممتدًا يضم منحوتات لفنانين عالميين، وتُقام فيها فعاليات ثقافية ورياضية كبرى.',
      ] },
    ],
    see: ['makkah', 'redsea'],
  },

  {
    id: 'diriyah', t: 'الدرعية', cat: 'hist', glyph: '🏛️',
    lead: [
      'الدرعية مدينة تاريخية شمال غرب [[riyadh]] على ضفاف وادي حنيفة، وكانت عاصمة الدولة السعودية الأولى التي تأسست عام 1727م.',
    ],
    box: [
      ['الموقع', 'وادي حنيفة، شمال غرب الرياض'],
      ['عاصمة', 'الدولة السعودية الأولى (1727م)'],
      ['التراث العالمي', 'حي الطريف — 2010'],
      ['الطراز', 'العمارة النجدية الطينية'],
    ],
    secs: [
      { h: 'حي الطريف', p: [
        'أُدرج حي الطريف في قائمة التراث العالمي لليونسكو عام 2010م، ويضم قصر سلوى وعددًا من القصور والمساجد المبنية بالطين على الطراز النجدي.',
      ] },
      { h: 'المشروع الحديث', p: [
        'تشهد الدرعية اليوم مشروع تطوير كبير ضمن مستهدفات [[vision2030]] يحولها إلى وجهة ثقافية وسياحية مع الحفاظ على نسيجها التاريخي.',
      ] },
    ],
    see: ['riyadh', 'masmak', 'vision2030'],
  },

  {
    id: 'masmak', t: 'قصر المصمك', cat: 'hist', glyph: '🏰',
    lead: [
      'قصر المصمك حصن طيني في وسط [[riyadh]]، بُني في أواخر القرن التاسع عشر، واشتهر بأنه موقع معركة استعادة الرياض على يد [[abdulaziz|الملك عبدالعزيز]] عام 1902م.',
    ],
    box: [
      ['الموقع', 'وسط الرياض'],
      ['مادة البناء', 'الطين واللبن'],
      ['الحدث', 'استعادة الرياض 1902م'],
      ['الوضع الحالي', 'متحف'],
    ],
    secs: [
      { h: 'العمارة', p: [
        'يتكوّن القصر من أربعة أبراج ركنية وفناء داخلي ومسجد، وجدرانه سميكة من الطين المدعّم بجذوع الأثل، وبابه الرئيس ما يزال يحمل أثر رأس الرمح من المعركة.',
      ] },
    ],
    see: ['riyadh', 'abdulaziz', 'diriyah'],
  },

  {
    id: 'abdulaziz', t: 'الملك عبدالعزيز آل سعود', cat: 'people', glyph: '👑',
    lead: [
      'عبدالعزيز بن عبدالرحمن آل سعود، مؤسس [[ksa|المملكة العربية السعودية]] وأول ملوكها. بدأ مسيرته باستعادة [[riyadh]] عام 1902م، وأتم توحيد البلاد عام 1932م.',
    ],
    box: [
      ['الميلاد', 'الرياض، 1876م'],
      ['استعادة الرياض', '1902م'],
      ['إعلان المملكة', '1932م'],
      ['الوفاة', 'الطائف، 1953م'],
    ],
    secs: [
      { h: 'التوحيد', p: [
        'استغرقت مسيرة التوحيد ثلاثة عقود ضمّت خلالها نجد والأحساء وحائل والحجاز وعسير تحت حكم واحد، وأُعلن قيام المملكة العربية السعودية في 23 سبتمبر 1932م.',
      ] },
      { h: 'اكتشاف النفط', p: [
        'في عهده مُنح امتياز التنقيب عن النفط عام 1933م، وتدفق النفط تجاريًا من بئر الدمام رقم 7 عام 1938م، فبدأ تحول اقتصادي شامل قادته لاحقًا [[aramco]].',
      ] },
    ],
    see: ['ksa', 'masmak', 'aramco'],
  },

  {
    id: 'vision2030', t: 'رؤية السعودية 2030', cat: 'econ', glyph: '🎯',
    lead: [
      'رؤية السعودية 2030 خطة تحول وطني أُطلقت في 25 أبريل 2016م، تهدف إلى تنويع الاقتصاد وتقليل الاعتماد على النفط وتطوير القطاعات غير النفطية والخدمات العامة.',
    ],
    box: [
      ['الإطلاق', '25 أبريل 2016م'],
      ['المحاور', 'مجتمع حيوي · اقتصاد مزدهر · وطن طموح'],
      ['أبرز المشاريع', 'نيوم · القدية · البحر الأحمر · الدرعية'],
    ],
    secs: [
      { h: 'المحاور', p: [
        'تقوم الرؤية على ثلاثة محاور: مجتمع حيوي، واقتصاد مزدهر، ووطن طموح، وتتفرع عنها برامج تنفيذية مثل برنامج جودة الحياة وبرنامج تطوير الصناعة الوطنية.',
      ] },
      { h: 'المشاريع الكبرى', p: [
        'تشمل المشاريع الكبرى [[neom]] في [[tabuk|تبوك]]، ومشروع القدية الترفيهي قرب [[riyadh]]، ومشروع البحر الأحمر السياحي، وتطوير [[diriyah]] و[[ula|العلا]].',
      ] },
    ],
    see: ['neom', 'aramco', 'diriyah'],
  },

  {
    id: 'neom', t: 'نيوم', cat: 'econ', glyph: '🌆',
    lead: [
      'نيوم مشروع تطوير عملاق في شمال غرب [[ksa|المملكة]] بمنطقة [[tabuk|تبوك]] على [[redsea|البحر الأحمر]]، أُعلن عنه عام 2017م ضمن [[vision2030]].',
    ],
    box: [
      ['الإعلان', '2017م'],
      ['الموقع', 'شمال غرب المملكة — تبوك'],
      ['المكونات', 'ذا لاين · تروجينا · أوكساجون · سندالة'],
    ],
    secs: [
      { h: 'المكونات', p: [
        '«ذا لاين» مدينة خطية ممتدة، و«تروجينا» وجهة جبلية للرياضات الشتوية، و«أوكساجون» مجمع صناعي عائم، و«سندالة» وجهة سياحية في البحر الأحمر.',
      ] },
    ],
    see: ['vision2030', 'tabuk', 'redsea'],
  },

  {
    id: 'aramco', t: 'أرامكو السعودية', cat: 'econ', glyph: '🛢️',
    lead: [
      'شركة الزيت العربية السعودية (أرامكو) شركة طاقة وكيميائيات مقرها الظهران في المنطقة الشرقية، وتُعد من أكبر منتجي النفط في العالم.',
    ],
    box: [
      ['المقر', 'الظهران'],
      ['الامتياز الأول', '1933م'],
      ['أول تدفق تجاري', 'بئر الدمام رقم 7 — 1938م'],
      ['السعودة الكاملة', '1980م'],
    ],
    secs: [
      { h: 'النشأة', p: [
        'بدأت القصة بمنح امتياز التنقيب عام 1933م في عهد [[abdulaziz|الملك عبدالعزيز]]، ثم تدفق النفط تجاريًا من بئر الدمام رقم 7 المعروف بـ«بئر الخير» عام 1938م.',
        'آلت ملكية الشركة بالكامل إلى الدولة عام 1980م، وطُرحت حصة منها في السوق المالية السعودية عام 2019م.',
      ] },
      { h: 'حقل الغوار', p: [
        'يُعد حقل الغوار في المنطقة الشرقية أكبر حقل نفط تقليدي بري في العالم، وهو العمود الفقري للإنتاج السعودي منذ خمسينيات القرن الماضي.',
      ] },
    ],
    see: ['ksa', 'vision2030', 'abdulaziz'],
  },

  {
    id: 'ula', t: 'العلا', cat: 'hist', glyph: '🪨',
    lead: [
      'العلا محافظة في [[madinah|منطقة المدينة المنورة]] تشتهر بمواقعها الأثرية وتكويناتها الصخرية، وفيها موقع الحِجر (مدائن صالح) أول موقع سعودي يُدرج في قائمة التراث العالمي عام 2008م.',
    ],
    box: [
      ['المنطقة', 'منطقة المدينة المنورة'],
      ['التراث العالمي', 'الحِجر — 2008'],
      ['الحضارات', 'دادان · لحيان · الأنباط'],
      ['معالم طبيعية', 'جبل الفيل · وادي العلا'],
    ],
    secs: [
      { h: 'الحِجر', p: [
        'يضم الموقع أكثر من مئة مقبرة منحوتة في الصخر تعود إلى الأنباط، أشهرها «قصر الفريد»، إضافة إلى نقوش وآبار ومنشآت مائية.',
      ] },
      { h: 'العلا اليوم', p: [
        'تُطوَّر العلا كوجهة ثقافية وسياحية ضمن [[vision2030]]، وتستضيف فعاليات موسمية ومعارض فنية في الهواء الطلق مثل «مرايا».',
      ] },
    ],
    see: ['madinah', 'vision2030'],
  },

  {
    id: 'rubalkhali', t: 'الربع الخالي', cat: 'geo', glyph: '🏜️',
    lead: [
      'الربع الخالي أكبر صحراء رملية متصلة في العالم، ويمتد في جنوب شرق شبه الجزيرة العربية بين [[ksa|السعودية]] وعُمان والإمارات واليمن.',
    ],
    box: [
      ['المساحة', 'نحو 650,000 كم²'],
      ['الدول', 'السعودية · عُمان · الإمارات · اليمن'],
      ['أعلى الكثبان', 'تتجاوز 250 م'],
    ],
    secs: [
      { h: 'الطبيعة', p: [
        'تغطيه كثبان رملية طولية وهلالية قد يتجاوز ارتفاع بعضها 250 مترًا، وتتخللها السبخات المالحة. الأمطار فيه نادرة جدًا ودرجات الحرارة من الأعلى عالميًا.',
      ] },
      { h: 'الاستكشاف', p: [
        'ظل الربع الخالي من آخر البقاع التي لم تُستكشف حتى ثلاثينيات القرن العشرين، وتُظهر الدراسات الجيولوجية أنه احتضن بحيرات قديمة قبل آلاف السنين.',
      ] },
    ],
    see: ['ksa', 'aramco'],
  },

  {
    id: 'ardah', t: 'العرضة النجدية', cat: 'cult', glyph: '⚔️',
    lead: [
      'العرضة النجدية فن أدائي سعودي تقليدي يجمع بين الشعر والطبول والصفوف الراقصة حاملة السيوف، وكانت قديمًا تُؤدى قبل الحرب ثم صارت رمزًا للاحتفالات الوطنية.',
    ],
    box: [
      ['المنشأ', 'نجد'],
      ['المكونات', 'الشعر · الطبول · السيف'],
      ['اليونسكو', 'التراث الثقافي غير المادي — 2015'],
    ],
    secs: [
      { h: 'الأداء', p: [
        'تُؤدى بصفين متقابلين يتبادلان إنشاد قصيدة حماسية على إيقاع طبول التخمير والثكاكين، ويتوسطهما حامل البيرق.',
        'أُدرجت العرضة في قائمة اليونسكو للتراث الثقافي غير المادي عام 2015م.',
      ] },
    ],
    see: ['qahwa', 'ksa'],
  },

  {
    id: 'qahwa', t: 'القهوة العربية', cat: 'cult', glyph: '☕',
    lead: [
      'القهوة العربية رمز للكرم في [[ksa|المملكة]] والجزيرة العربية، تُقدَّم في دلّة وتُصب في فناجين صغيرة، وغالبًا مع التمر والهيل.',
    ],
    box: [
      ['الأدوات', 'الدلّة · الفنجان · المحماسة'],
      ['الإضافات', 'الهيل · الزعفران · القرنفل'],
      ['اليونسكو', 'التراث الثقافي غير المادي — 2015'],
    ],
    secs: [
      { h: 'التقاليد', p: [
        'يُصب الفنجان أقل من نصفه دلالة على الترحيب المتكرر، ويهزّ الضيف الفنجان إشارة إلى الاكتفاء. تُقدَّم القهوة باليد اليمنى ابتداءً من كبير المجلس.',
        'أُدرجت ضمن قائمة اليونسكو للتراث الثقافي غير المادي عام 2015م بوصفها رمزًا للكرم.',
      ] },
    ],
    see: ['ardah', 'ksa'],
  },

  {
    id: 'redsea', t: 'البحر الأحمر', cat: 'geo', glyph: '🌊',
    lead: [
      'البحر الأحمر مسطح مائي يفصل بين شبه الجزيرة العربية وأفريقيا، ويشكّل الساحل الغربي لـ[[ksa|المملكة]] بطول يقارب 1800 كم.',
    ],
    box: [
      ['الطول التقريبي', '2250 كم'],
      ['الساحل السعودي', '~1800 كم'],
      ['أبرز المدن', 'جدة · ينبع · ضباء'],
    ],
    secs: [
      { h: 'البيئة البحرية', p: [
        'يضم البحر الأحمر شعابًا مرجانية من الأغنى عالميًا بالتنوع الحيوي، وتتميز مرجانياته بقدرتها العالية على تحمل ارتفاع حرارة المياه.',
      ] },
      { h: 'التنمية', p: [
        'تُطوَّر على ساحله مشاريع سياحية كبرى مثل مشروع البحر الأحمر وأمالا و[[neom]] ضمن [[vision2030]].',
      ] },
    ],
    see: ['jeddah', 'neom'],
  },

  {
    id: 'arar', t: 'عرعر', cat: 'city', glyph: '🌵',
    lead: [
      'عرعر عاصمة منطقة الحدود الشمالية في شمال [[ksa|المملكة]]، قرب الحدود مع العراق. نشأت المدينة الحديثة في خمسينيات القرن العشرين على مسار خط أنابيب التابلاين.',
    ],
    box: [
      ['المنطقة', 'الحدود الشمالية'],
      ['النشأة الحديثة', 'خمسينيات القرن العشرين'],
      ['الإحداثيات', '30.97° شمالًا، 41.04° شرقًا'],
    ],
    secs: [
      { h: 'الاقتصاد', p: [
        'تعتمد المدينة على التجارة الحدودية والخدمات والزراعة، وتُعد منفذ جديدة عرعر بوابة برية مهمة نحو العراق.',
      ] },
      { h: 'المناخ', p: [
        'مناخها صحراوي بارد شتاءً حار جاف صيفًا، وتتساقط عليها الثلوج أحيانًا في أشد الليالي برودة.',
      ] },
    ],
    see: ['ksa', 'rubalkhali'],
  },

  {
    id: 'abha', t: 'أبها', cat: 'city', glyph: '⛰️',
    lead: [
      'أبها عاصمة منطقة عسير جنوب غرب [[ksa|المملكة]]، تقع على ارتفاع يقارب 2200 متر في جبال السروات، وتشتهر باعتدال صيفها وضبابها.',
    ],
    box: [
      ['المنطقة', 'عسير'],
      ['الارتفاع', '~2200 م'],
      ['أبرز المعالم', 'جبل السودة · قرية رجال ألمع'],
    ],
    secs: [
      { h: 'السياحة', p: [
        'تُعد وجهة صيفية رئيسة، ويجاورها جبل السودة أعلى قمم المملكة، وقرية رجال ألمع التراثية بمبانيها الحجرية متعددة الطوابق.',
      ] },
      { h: 'فن القط العسيري', p: [
        'يشتهر البيت العسيري بفن «القط» وهو زخارف هندسية ملونة ترسمها النساء على الجدران، وأُدرج في قائمة اليونسكو للتراث غير المادي عام 2017م.',
      ] },
    ],
    see: ['ksa', 'qahwa'],
  },

  {
    id: 'tabuk', t: 'تبوك', cat: 'city', glyph: '🏔️',
    lead: [
      'تبوك مدينة ومنطقة في شمال غرب [[ksa|المملكة]] على [[redsea|البحر الأحمر]]، وتضم مشروع [[neom]] وجزيرة تيران وشواطئ خليج العقبة.',
    ],
    box: [
      ['المنطقة', 'تبوك'],
      ['أبرز المعالم', 'قلعة تبوك · جبال اللوز'],
      ['المشاريع', 'نيوم'],
    ],
    secs: [
      { h: 'الطبيعة', p: [
        'تشتهر بجبال اللوز التي تكتسي بالثلوج شتاءً، وبسهولها الزراعية المنتجة للورد والفواكه، وبساحل بكر على خليج العقبة.',
      ] },
    ],
    see: ['neom', 'redsea', 'ksa'],
  },
];

const WIKI_INDEX = new Map(WIKI_ARTICLES.map((a) => [a.id, a]));

/* ---------- wikitext ---------- */

const wkEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* [[id]] and [[id|label]] -> internal links; unknown ids render as stubs. */
const wkText = (s) => wkEsc(s).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
  const hit = WIKI_INDEX.get(id.trim());
  const text = wkEsc(label || hit?.t || id);
  return hit
    ? `<a class="wk-a" data-go="${wkEsc(id.trim())}">${text}</a>`
    : `<a class="wk-a wk-red" title="مقالة غير موجودة">${text}</a>`;
});

const wkSerialize = (a) => [
  ...a.lead,
  ...a.secs.flatMap((s) => [`== ${s.h} ==`, ...s.p]),
].join('\n\n');

function wkParse(txt, seed) {
  const lead = [];
  const secs = [];
  let cur = null;

  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const head = /^==\s*(.+?)\s*==$/.exec(line);
    if (head) { cur = { h: head[1], p: [] }; secs.push(cur); continue; }
    (cur ? cur.p : lead).push(line);
  }
  return { ...seed, lead, secs };
}

/* ---------- app ---------- */

Apps.wiki = {
  title: 'معرفة',
  glyph: Icons.wiki,
  width: 1000,
  height: 640,

  async mount(body) {
    body.style.padding = '0';
    body.innerHTML = `
      <div class="wk" dir="rtl">
        <header class="wk-top">
          <div class="wk-brand" data-go="__home">
            <span class="wk-mark">م</span>
            <span class="wk-name">${WIKI.name}<small>${WIKI.tag}</small></span>
          </div>
          <label class="wk-search">
            <span>🔍</span>
            <input type="search" placeholder="ابحث في ${WIKI_ARTICLES.length} مقالة…" autocomplete="off">
          </label>
          <button class="wk-btn" data-do="random" title="مقالة عشوائية">🎲 عشوائي</button>
          <button class="wk-btn" data-do="back" title="رجوع">↩ رجوع</button>
        </header>

        <div class="wk-main">
          <nav class="wk-side"></nav>
          <article class="wk-body"></article>
        </div>
      </div>`;

    const $ = (sel) => body.querySelector(sel);
    const side = $('.wk-side');
    const view = $('.wk-body');
    const query = $('.wk-search input');

    const edits = new Map();       // id -> wikitext
    const history = [];
    let current = null;
    let editing = false;

    for (const row of await DB.list('wiki')) edits.set(row.id, row.body);

    /* Seed merged with the user's edit, if any. */
    const read = (id) => {
      const seed = WIKI_INDEX.get(id);
      if (!seed) return null;
      const edit = edits.get(id);
      return edit === undefined ? seed : wkParse(edit, seed);
    };

    const plain = (a) => [a.t, ...a.lead, ...a.secs.flatMap((s) => [s.h, ...s.p])].join(' ');

    /* ----- sidebar ----- */
    function renderSide(term = '') {
      const q = term.trim();
      const hits = q
        ? WIKI_ARTICLES.filter((a) => plain(read(a.id)).includes(q))
        : WIKI_ARTICLES;

      side.innerHTML = '';
      if (q) {
        const head = document.createElement('div');
        head.className = 'wk-side-head';
        head.textContent = `نتائج البحث (${hits.length})`;
        side.appendChild(head);
      }

      const groups = q
        ? { '': hits }
        : Object.fromEntries(Object.keys(WIKI_CATS).map((c) => [c, hits.filter((a) => a.cat === c)]));

      for (const [cat, items] of Object.entries(groups)) {
        if (!items.length) continue;
        if (cat) {
          const head = document.createElement('div');
          head.className = 'wk-side-head';
          head.textContent = WIKI_CATS[cat];
          side.appendChild(head);
        }
        for (const a of items) {
          const link = document.createElement('button');
          link.className = 'wk-side-a' + (a.id === current ? ' on' : '');
          link.dataset.go = a.id;
          link.innerHTML = `<span class="g">${a.glyph}</span><span></span>`;
          link.lastElementChild.textContent = a.t;
          side.appendChild(link);
        }
      }

      if (!side.children.length) side.innerHTML = '<p class="wk-empty">لا نتائج.</p>';
    }

    /* ----- home ----- */
    function renderHome() {
      current = null;
      editing = false;
      // Featured article rotates once a day, same for everyone on that date.
      const day = Math.floor(Date.now() / 864e5);
      const star = read(WIKI_ARTICLES[day % WIKI_ARTICLES.length].id);

      view.innerHTML = `
        <div class="wk-hero">
          <h1>مرحبًا بك في <b>${WIKI.name}</b></h1>
          <p>${WIKI.tag} — ${WIKI_ARTICLES.length} مقالة عن المملكة العربية السعودية، تاريخها وجغرافيتها وتراثها واقتصادها.</p>
        </div>

        <section class="wk-feature">
          <div class="wk-feature-head">مقالة اليوم المختارة</div>
          <div class="wk-feature-row">
            <span class="wk-feature-glyph">${star.glyph}</span>
            <div>
              <h2><a class="wk-a" data-go="${star.id}">${wkEsc(star.t)}</a></h2>
              <p>${wkText(star.lead[0])}</p>
            </div>
          </div>
        </section>

        <div class="wk-cats"></div>`;

      const cats = view.querySelector('.wk-cats');
      for (const [key, label] of Object.entries(WIKI_CATS)) {
        const items = WIKI_ARTICLES.filter((a) => a.cat === key);
        const card = document.createElement('div');
        card.className = 'wk-cat';
        card.innerHTML = `<h3>${label} <small>${items.length}</small></h3><ul></ul>`;
        const ul = card.querySelector('ul');
        for (const a of items) {
          const li = document.createElement('li');
          li.innerHTML = `<a class="wk-a" data-go="${a.id}"></a>`;
          li.firstElementChild.textContent = a.t;
          ul.appendChild(li);
        }
        cats.appendChild(card);
      }
      renderSide(query.value);
    }

    /* ----- article ----- */
    function renderArticle(id) {
      const a = read(id);
      if (!a) return renderHome();
      current = id;
      editing = false;

      const edited = edits.has(id);
      view.innerHTML = `
        <div class="wk-head">
          <h1>${wkEsc(a.t)}</h1>
          <div class="wk-sub">من ${WIKI.name}، ${WIKI.tag}${edited ? ' · <span class="wk-badge">معدَّلة محليًا</span>' : ''}</div>
          <div class="wk-tools">
            <button class="wk-btn" data-do="edit">✎ تحرير</button>
            ${edited ? '<button class="wk-btn" data-do="restore">⟲ استعادة الأصل</button>' : ''}
          </div>
        </div>

        <aside class="wk-box">
          <div class="wk-box-head">${wkEsc(a.t)}</div>
          <div class="wk-box-art"><span>${a.glyph}</span></div>
          <table></table>
        </aside>

        <div class="wk-toc"><b>المحتويات</b><ol></ol></div>
        <div class="wk-prose"></div>
        <div class="wk-see"></div>
        <div class="wk-foot">
          <span class="wk-chip">تصنيف: ${WIKI_CATS[a.cat]}</span>
          <span class="wk-chip">المعرّف: ${wkEsc(a.id)}</span>
        </div>`;

      const table = view.querySelector('.wk-box table');
      for (const [k, v] of a.box) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<th></th><td></td>';
        tr.firstElementChild.textContent = k;
        tr.lastElementChild.textContent = v;
        table.appendChild(tr);
      }

      const prose = view.querySelector('.wk-prose');
      prose.innerHTML = a.lead.map((p) => `<p>${wkText(p)}</p>`).join('');

      const toc = view.querySelector('.wk-toc ol');
      a.secs.forEach((s, i) => {
        prose.insertAdjacentHTML('beforeend',
          `<h2 id="wk-s${i}">${wkEsc(s.h)}</h2>` + s.p.map((p) => `<p>${wkText(p)}</p>`).join(''));
        const li = document.createElement('li');
        li.innerHTML = '<a class="wk-a"></a>';
        li.firstElementChild.textContent = s.h;
        li.firstElementChild.onclick = () => view.querySelector(`#wk-s${i}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
        toc.appendChild(li);
      });
      if (!a.secs.length) view.querySelector('.wk-toc').remove();

      const see = view.querySelector('.wk-see');
      const links = (a.see || []).filter((x) => WIKI_INDEX.has(x));
      if (links.length) {
        see.innerHTML = '<h2>طالع أيضًا</h2><ul></ul>';
        const ul = see.querySelector('ul');
        for (const x of links) {
          const li = document.createElement('li');
          li.innerHTML = `<a class="wk-a" data-go="${x}"></a>`;
          li.firstElementChild.textContent = WIKI_INDEX.get(x).t;
          ul.appendChild(li);
        }
      } else see.remove();

      view.scrollTop = 0;
      renderSide(query.value);
    }

    /* ----- editor ----- */
    function renderEditor(id) {
      const a = read(id);
      editing = true;
      view.innerHTML = `
        <div class="wk-head">
          <h1>تحرير: ${wkEsc(a.t)}</h1>
          <div class="wk-sub">استخدم <code>== عنوان ==</code> لبدء قسم، وسطرًا فارغًا بين الفقرات، و<code>[[معرّف]]</code> لوصلة داخلية.</div>
        </div>
        <textarea class="wk-edit" spellcheck="false"></textarea>
        <div class="wk-tools">
          <button class="wk-btn wk-primary" data-do="save">حفظ</button>
          <button class="wk-btn" data-do="cancel">إلغاء</button>
          <span class="wk-note">يُحفظ محليًا فقط.</span>
        </div>`;
      view.querySelector('textarea').value = wkSerialize(a);
      view.scrollTop = 0;
    }

    /* ----- navigation ----- */
    function go(id, push = true) {
      if (push) history.push(current);   // null means "home"
      if (id === '__home') renderHome();
      else renderArticle(id);
    }

    view.onclick = async (e) => {
      const link = e.target.closest('[data-go]');
      if (link) return go(link.dataset.go);

      const act = e.target.closest('[data-do]')?.dataset.do;
      if (act === 'edit') return renderEditor(current);
      if (act === 'cancel') return renderArticle(current);
      if (act === 'save') {
        const txt = view.querySelector('textarea').value;
        edits.set(current, txt);
        await DB.put('wiki', { id: current, name: WIKI_INDEX.get(current).t, body: txt });
        return renderArticle(current);
      }
      if (act === 'restore') {
        edits.delete(current);
        await DB.del('wiki', current);
        return renderArticle(current);
      }
    };

    side.onclick = (e) => {
      const link = e.target.closest('[data-go]');
      if (link) go(link.dataset.go);
    };

    $('.wk-brand').onclick = () => go('__home');
    $('[data-do=random]').onclick = () => {
      const pool = WIKI_ARTICLES.filter((a) => a.id !== current);
      go(pool[Math.floor(Math.random() * pool.length)].id);
    };
    $('[data-do=back]').onclick = () => {
      if (editing && current) return renderArticle(current);
      const prev = history.pop();
      go(prev || '__home', false);
    };

    let debounce;
    query.oninput = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderSide(query.value), 120);
    };
    query.onkeydown = (e) => {
      if (e.key !== 'Enter') return;
      const first = side.querySelector('[data-go]');
      if (first) go(first.dataset.go);
    };

    renderHome();
  },
};
