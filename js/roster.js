/* محارمي — character lineup app (NIKKE-style).
 * Sprites are the *-sil files; the full art is used as the faded panel backdrop.
 * Bios are empty by default and saved per character in DB('bios').
 */

const ROSTER = [
  { key: 'maid',             name: 'خادمتنا',       role: 'خادمة منزلنا',     sprite: 'maid-sil.webp',             art: 'maid.png',           tone: '#d9c27a' },
  { key: 'little-sister',    name: 'أختي الصغرى',  role: 'أختي الصغرى',     sprite: 'little-sister-sil.webp',    art: 'little-sister.png',  tone: '#ff9ec4' },
  { key: 'mom',              name: 'أمي',           role: 'أمي',               sprite: 'mom-sil.webp',              art: 'mom.png',            tone: '#ff6f9c' },
  { key: 'big-sister',       name: 'أختي الكبرى',  role: 'أختي الكبرى',     sprite: 'big-sis-sil.webp',          art: 'big-sister.png',     tone: '#6fa8ff' },
  { key: 'childhood-friend', name: 'صديقة طفولتي', role: 'صديقة طفولتي',    sprite: 'childhood-friend-sil.webp', art: 'child-friend.png',   tone: '#7ad7c9' },
];

const GALLERIES = {
  'big-sister': [
    {
      src: 'assets/family/big-sister/studying.jpg',
      title: 'أيام النيردة (studying)',
      comment: 'كانت غرفتها عبارة عن مقبرة كتب طبية، والشيء الوحيد اللي يثير اهتمامها هو حفظ أجزاء الجمجمة... سبحان مغير الأحوال!'
    },
    {
      src: 'assets/family/big-sister/GJv4wAwXAAA-K05.jpg',
      title: 'تمويل الأبحاث (GJv4wAwXAAA-K05)',
      comment: 'رايحة تدور "منحة بحثية" في الكلية، رجعت وهي بنفسها الأطروحة العلمية الحية اللي بيعملوا عليها التجربة!'
    },
    {
      src: 'assets/family/big-sister/internship.jpg',
      title: 'التدريب السريري الفاخر (internship)',
      comment: 'لما الأستاذ يقنعك إن ربطك على طاولة الفحص هو الطريقة الوحيدة لفهم الجهاز التناسلي الأنثوي بشكل عملي!'
    },
    {
      src: 'assets/family/big-sister/helping friends.jpg',
      title: 'خدمة المجتمع العلمي (helping friends)',
      comment: 'المعطف الأبيض بقى هو الفستان الوحيد، والأساتذة والطلاب الأغرياء عندهم اشتراك شهري في المختبر السري!'
    }
  ],

  'little-sister': [
    {
      src: 'assets/family/little-sister/she used to teach relegion.jpg',
      title: 'أيام الحجاب والوقار (she used to teach relegion)',
      comment: 'كانت تشرح دروس الدين والطهارة بالحجاب وبصوت مبحوح و3 مشاهدين فقط (أنا وأمي وحساب وهمي)... الصبر مفتاح الفرج!'
    },
    {
      src: 'assets/family/little-sister/average stream.jpg',
      title: 'البث المباشر المعتاد (average stream)',
      comment: 'لما خعت العباءة وقعدت في البانيو، السيرفر كاد ينفجر والتبرعات طارت للمريخ... العلم نور والماء بركة!'
    },
    {
      src: 'assets/family/little-sister/donation.jpg',
      title: 'كبير الداعمين VIP (donation)',
      comment: 'الداعم مجهز الشقة السريّة وكل تبرع بـ 5000 دولار يلزمه جلسة استرخاء خاصة ومراجعة دروس قديمة!'
    }
  ],

  'mom': [
    {
      src: 'assets/family/mother/before.png',
      title: 'أمي زمان (before)',
      comment: 'المسبحة ما تفارق إيدها والتلفزيون ما يشتغل إلا على القران... يا حليل أيام الهدوء والسكينة!'
    },
    {
      src: 'assets/family/mother/look at this husband.png',
      title: 'سبب التغيير الرئيسي (look at this husband)',
      comment: 'أبوي نايم على الأريكة من سنة 1998 وما يدري عن العالم... الإهمال والتجاهل يصنع المعجزات!'
    },
    {
      src: 'assets/family/mother/after.png',
      title: 'بعد التحديث الجديد (after)',
      comment: 'اكتشفت المواقع السريّة وقررت إن الحياة أقصر من إنها تقضيها في المطبخ وتغسيل الصحون!'
    },
    {
      src: 'assets/family/mother/in the club.jpg',
      title: 'ليالي النادي (in the club)',
      comment: 'رايحة تشتغل راقصة عشان الفلوس، انتهى بها المطاف تصرف فلوس أبوي على الزبائن من كثر الوناسة!'
    }
  ],

  'maid': [
    {
      src: 'assets/family/maid/ignore cleaning the house.jpg',
      title: 'إضراب عن المكنسة (ignore cleaning the house)',
      comment: 'المكنسة غطت في نوم عميق، والمجلس أتحول لصالون استقبال رسمي لرجال الحارة من الباب الخلفي!'
    },
    {
      src: 'assets/family/maid/all the day.jpg',
      title: 'دوام كامل 24/7 (all the day)',
      comment: 'الباب الخلفي مفتوح على مدار الساعة والمطبخ بقى غرفة عمليات... وتطالع فيني وتقول: كبّر عقلك يا ولد!'
    }
  ],

  'childhood-friend': [
    {
      src: 'assets/family/childhood/bullies.jpg',
      title: 'حمايتي من المتنمرين (bullies)',
      comment: 'تتفق مع المتنمرين في الغرفة المظلمة بشرط واحد: "أتركوا حبيبي بحاله!"... الوفاء في أبهى صوره!'
    },
    {
      src: 'assets/family/childhood/what the teacher saw.png',
      title: 'غرفة المدرسين المغلقة (what the teacher saw)',
      comment: 'الأستاذ كان نائم على 3 في المادة، خلت درجاتي 99% بقدرة قادر بعد جلسة سريّة مع الأستاذ!'
    },
    {
      src: 'assets/family/childhood/employer descution.jpg',
      title: 'مفاوضات الترقية (employer descution)',
      comment: 'مدير الشركة كل ما يحتاج "تقرير أداء"، هي تروح تخلصه في شقته وأنا ينزل لي البونص في الحساب!'
    }
  ]
};

const SVG_WATERMARKS = {
  'big-sister': `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="50" cy="50" r="42" stroke-dasharray="4 2"/><path d="M50 18v64M18 50h64"/><path d="M32 32l36 36M68 32L32 68" opacity="0.4"/><path d="M25 50c5-15 15-15 25 0s15 15 25 0" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="currentColor" fill-opacity="0.1"/></svg>`,
  'mom': `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M10 30l20 50h40l20-50-25 28-15-20-15 20L10 30z" stroke-width="2"/><circle cx="10" cy="30" r="4" fill="currentColor"/><circle cx="30" cy="58" r="3" fill="currentColor"/><circle cx="50" cy="38" r="5" fill="currentColor"/><circle cx="70" cy="58" r="3" fill="currentColor"/><circle cx="90" cy="30" r="4" fill="currentColor"/><rect x="25" y="83" width="50" height="6" rx="3" stroke-width="1.5"/></svg>`,
  'little-sister': `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="15" y="25" width="55" height="50" rx="10" stroke-width="2"/><polygon points="90 35 70 50 90 65 90 35" stroke-width="2"/><circle cx="42" cy="50" r="14" stroke-width="2"/><circle cx="42" cy="50" r="6" fill="currentColor" fill-opacity="0.2"/><path d="M15 85c20-8 30 8 50 0s20-8 20 0" stroke-width="1.5"/></svg>`,
  'maid': `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="35" cy="65" r="18" stroke-width="2"/><circle cx="35" cy="65" r="8"/><path d="M48 52L85 15M70 30l10 10M80 20l10 10" stroke-width="2.5"/><path d="M15 15c35 0 70 35 70 70" stroke-dasharray="3 3"/></svg>`,
  'childhood-friend': `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M50 30c-15-20-40 0-20 25l20 25 20-25c20-25-5-45-20-25z" stroke-width="2"/><path d="M30 65c-15 15-25 0-10-15s30 15 10 15zM70 65c15 15 25 0 10-15s-30 15-10 15z" stroke-width="1.5"/></svg>`
};

const SVG_ICONS = {
  back: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  save: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  bullet: `<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><polygon points="12 2 22 12 12 22 2 12"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

const THEME_HEADER_ICONS = {
  'big-sister': `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 12.5l3 3 7-7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="9"/></svg>`,
  'mom': `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-5-4 5-6-7z"/><rect x="4" y="18" width="16" height="2" rx="1"/></svg>`,
  'little-sister': `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="14" height="14" rx="3"/><polygon points="23 7 16 12 23 17 23 7"/><circle cx="9" cy="12" r="2.5"/></svg>`,
  'maid': `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M16 7l2 2M19 4l2 2"/></svg>`,
  'childhood-friend': `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`
};

const PARAM_ICONS = {
  'الاسم': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  'العمر': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  'العلاقة': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  'الحالة': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'الحالة الحالية': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'السمات': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  'التخصص الأصلي': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
  'المجال': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  'التضحيات': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  'العائلة': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  'المكان': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  'الموقف': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  'التحول': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`
};

const STORIES = {
  'big-sister': `### ملف الشخصية | PROFILE
- **الاسم:** أختي الكبرى
- **العمر:** 22 سنة
- **العلاقة:** [أختي الكبرى]
- **الحالة الحالية:** [عاهرة جامعية محترفة]
- **السمات:** **نيردة منطوية** ◄ **مادة بحثية حية**

---

### القصة والخلفية

كانت **أختي الكبرى** قبل سفرها إلى الجامعة فتاة *منطوية تماماً*. نيردة حقيقية، لا تهتم إلا بالكتب والمذاكرة.

> **«كانت تقضي أيامها ولياليها في غرفتها تدرس الطب، ترتدي نظارات سميكة وملابس فضفاضة، ولا تخرج إلا إلى المكتبة أو المحاضرات. لم يكن لها أصدقاء، ولم تفكر يوماً في الجنس أو الرجال.»**

#### التحول الفجائي
في الجامعة تغير كل شيء بطريقة غير متوقعة.

في الفصل الدراسي الأول، كانت تحتاج إلى تمويل لأبحاثها عن *الجهاز التناسلي الأنثوي*. تقدمت بطلب منحة بحثية عند أستاذ مشهور في قسم *علم الجنس السريري*. قبلها، لكنه اشترط عليها أن تشارك بنفسها كـ **"حالة دراسية حية"** في تجاربه.

في البداية كانت التجارب بسيطة:
- قياس ردود الفعل الجسدية أثناء قراءة نصوص إباحية قديمة.
- ارتداء أجهزة استشعار داخل ملابسها الداخلية أثناء المحاضرات.

بعد أسابيع، طلب منها الأستاذ أن تحضر جلسات خاصة في **مختبره السري** في الطابق السفلي من مبنى الكلية. هناك بدأت الأمور تتصاعد. كان يُدخل فيها أجهزة طبية معدلة، ويصور ردود فعل جسدها من الداخل بكاميرات دقيقة، ثم يطلب منها أن تمارس العادة السرية أمامه وهو يكتب الملاحظات.

#### الابتزاز والاستسلام
في إحدى الليالي، أحضر الأستاذ ثلاثة من زملائه الأثرياء (أطباء ورجال أعمال يدعمون أبحاثه). أخبرها أن **"التمويل الإضافي"** يتطلب مشاركتها الجسدية الكاملة. رفضت في البداية، لكنه هددها بنشر التسجيلات السابقة وفضحها أمام عمادة الكلية... **فاستسلمت**.

في تلك الليلة، ربطوها على طاولة الفحص الطبية. تناوب عليها الرجال الأربعة لساعات. أدخلوا فيها أدوات طبية حقيقية ومزيفة، صوروا كل شيء من زوايا متعددة، وأجبروها على ابتلاع سوائلهم ووصف شعورها بالتفصيل كما لو كانت تكتب تقريراً علمياً.

#### التحول الكامل
من تلك اللحظة تحولت.

أصبحت تذهب إلى المختبر ثلاث مرات أسبوعياً. في كل مرة يكون هناك زبائن جدد: أساتذة، طلاب أغنياء، وأحياناً رجال من خارج الجامعة يدفعون مبالغ خيالية مقابل **"جلسات بحثية خاصة"**.

- ترتدي المعطف الأبيض الطبي فقط فوق جسدها العاري.
- تستخدم المصطلحات الطبية أثناء الجنس.
- تسمح لهم بتصوير عمليات الإيلاج بالمنظار الداخلي.

لم تعد تدرس كثيراً. درجاتها انخفضت لكن المنحة والأموال أصبحت كافية. تحولت من نيردة منطوية إلى **عاهرة جامعية محترفة** بأسلوب فريد: تقدم نفسها كـ **"مادة بحثية حية"**، وتتعامل مع الزبائن كأنهم باحثون، وتوثق كل ليلة في دفتر ملاحظات طبي.

#### جلسات الإذلال الخاصة
أضافت زبائنها شرطاً جديداً مقابل مبالغ أعلى بكثير: أن ترتدي **الحجاب والعباءة السعودية الكاملة** أثناء الجلسات. كانوا يدفعون لها أضعاف الأجر العادي كي تظهر كفتاة سعودية محجبة متدينة، ثم يقومون بإذلالها بشكل متعمد تحت هذا المظهر.

يجبرونها على الركوع وهي محجبة تماماً، ويمزقون العباءة ببطء، ويبصقون على الحجاب، بينما يمارس عليها الجنس من الخلف. بعضهم يطلب منها أن تعتذر بصفتها "سعودية متخلفة" وأن تشكرهم على "تحريرها"، ويلعقوا أحذيتهم وهي لا تزال مرتدية الحجاب. آخرون يصوّرونها وهي تُجامَع بقوة وهي تلبس النقاب فقط، ويطلب منها أن تقول عبارات مهينة عن بلدها ودينها مقابل المال الإضافي. أصبحت هذه الجلسات من أكثر ما يطلبه الزبائن، وهي توافق دائماً لأن المبلغ يضاعف دخلها عدة مرات.`,

  'little-sister': `### ملف الشخصية | PROFILE
- **الاسم:** أختي الصغرى
- **العمر:** 20 سنة
- **العلاقة:** [أختي الصغرى]
- **الحالة الحالية:** [مستحمية عارية في البث المباشر]
- **التحول:** **دروس علمية ودينية** ◄ **جلسات خاصة بمبالغ ضخمة**

---

### القصة والخلفية

كانت **أختي الصغرى** في العشرين من عمرها، فتاة *هادئة* تحاول تقديم محتوى مفيد على الإنترنت.

> **«بدأت بقنوات تعليمية في العلوم والدين: تشرح آيات قرآنية بصوت هادئ، تتحدث عن التجارب العلمية البسيطة، وتضع فيديوهات عن الصلاة والأخلاق. كانت تظهر مرتدية الحجاب والملابس المحتشمة... لكن المشاهدات بقيت شبه معدومة.»**

#### طريق التغيير التدريجي
بعد أشهر من الفشل، بدأت تجرب تغييرات صغيرة:
- **المرحلة 1:** الشرح بجانب حوض استحمام فارغ في فيديو عن *دورة المياه*.
- **المرحلة 2:** غسل اليدين والوجه داخل الحمام في فيديو ديني عن *الطهارة*.
- **المرحلة 3:** الجلوس داخل الحوض وهو ممتلئ بملابس سباحة محتشمة تحت عباءة خفيفة.

#### البث العاري
بعد أسابيع، خلعت العباءة تماماً أثناء البث، وظهرت بملابس سباحة فقط داخل الحوض الممتلئ. المشاهدات قفزت فجأة والتبرعات زادت.

ثم بدأت تخلع ملابس السباحة تدريجياً أمام الكاميرا، حتى تحول المحتوى إلى **بث استحمام عاري شبه كامل**، مع حديث خفيف عن *"الاسترخاء والطهارة الجسدية"*.

الآن هي تبث بانتظام داخل الحوض العاري تماماً، تتحدث أحياناً عن مواضيع علمية أو دينية بطريقة ساخرة بينما تمسح الماء عن جسدها. المشاهدات بالآلاف، والتبرعات مستمرة.

#### المتبرع الكبير والجلسات السرية
أكبر المتبرعين لديها رجل ثري يظهر باسم مستعار. يتبرع بمبالغ كبيرة جداً في كل بث.

عرض عليها **جلسات خاصة سرية** خارج البث المباشر مقابل مبالغ ضخمة. فوافقت.

الآن يلتقيان في شقة مستأجرة. يطلب منها أن ترتدي **الحجاب والملابس الدينية** أولاً، ثم يأمرها بخلعها ببطء أمامه وهي داخل حوض مملوء، ويمارس معها الجنس داخل الماء وخارجه، ويطلب منها تكرار العبارات الدينية القديمة وهي تُجامَع.

تقبل دون تردد، وتعتبره مجرد مصدر دخل إضافي بعد أن اكتشفت أن جسدها يحقق ما لم تحققه كل دروسها العلمية والدينية.`,

  'mom': `### ملف الشخصية | PROFILE
- **الاسم:** أمي
- **العمر:** ثلاثينيات متأخرة
- **العلاقة:** [أمي] (ربة منزل ◄ راقصة نادٍ إباحي)
- **الحالة:** [إدمان الإثارة والجنس الجماعي]
- **العائلة:** أنا، أختي الكبرى، أختي الصغرى، أبي (زوجها)

---

### القصة والخلفية

**أمي** امرأة شابة جميلة وأنيقة. كانت في السابق امرأة متدينة ملتزمة تصلي وتصوم وتهتم ببيتها وأطفالها.

> **«لكن بعد فترة طويلة من التجاهل والإهمال من أبي، بدأت تتغير تدريجياً... اكتشفت مواقع إباحية وزاد إدمانها، وأصبحت تتحدث بطريقة أكثر جرأة وترتدي ملابس كاشفة.»**

#### الدخول إلى عالم النوادي
عندما سافرت **أختي الكبرى** إلى الجامعة، وأصبحت **أختي الصغرى** مشغولة بصديقاتها، وجدت أمي نفسها وحيدة معظم الوقت.

تعرفت على صاحب نادي للرقص الإباحي عرض عليها العمل راقصة هناك مقابل مبلغ كبير. وافقت، وفي ليلتها الأولى أنفقت كل المبلغ على الزبائن داخل النادي، وقضت الليلة كلها في غرف خاصة معهم، حيث تناوب عليها الرجال بأشكال مختلفة.

الآن هي تعمل في النادي بشكل شبه مجاني، لا تهتم بالمال بل تستمتع بالعمل نفسه، وتستخدم أموال أبي لتغطية نفقات المنزل بينما تنفق ما تحصله على الزبائن.

#### الطقوس الدينية والأجهزة المخفية
تطورت عاداتها بشكل ملحوظ:
- **جنس الجمعة:** تحب أن يمارس الرجال الجنس معها يوم الجمعة تحديداً، أثناء وجود أبي وأنا في المسجد لصلاة الجمعة.
- **ملابس الصلاة المخبأة:** ترتدي ملابس الصلاة (الحجاب والعباءة) فوق ملابس داخلية تحتوي على ألعاب جنسية واهتزازات مخبأة، وتصلي وهي تشعر بالاهتزازات كتحدٍ وإثارة إضافية.

تستمر في العمل بالمعرض عدة ليالٍ في الأسبوع، وتعود متأخرة أو تجلب رجالاً إلى المنزل عندما يكون أبي غائباً.`,

  'maid': `### ملف الشخصية | PROFILE
- **الاسم:** الخادمة
- **العمر:** منتصف الثلاثينيات
- **العلاقة:** [خادمة منزلنا] (مديرة بيت الدعارة)
- **المكان:** [منزل عائلتنا]
- **الموقف:** **تحويل المنزل إلى مقر زبائن علني**

---

### القصة والخلفية

كانت **الخادمة في منزلنا** امرأة في منتصف الثلاثينيات، تعمل لدينا منذ سنوات. في البداية كانت هادئة ومطيعة، تنظف وتطبخ وتغسل الملابس. لكن مع تحول **أمي وأختيّ**، تغيرت هي أيضاً.

> **«بدأت تستخدم منزلنا كبيت دعارة حقيقي. عندما يغيب أبي أو ينام، تفتح الباب الخلفي لزبائنها... رجال مختلفون يدخلون غرف النوم والحمامات والمطبخ.»**

تأخذ منهم أجوراً نقدية وتسمح لهم باستخدام أي غرفة، وتترك الآثار في سلة المهملات ورائحة العطر والرطوبة تعلق في الهواء.

#### المواجهة وسخرية الواقع
في أحد الأيام وجدتها في المطبخ مع رجلين على طاولة الطعام. عندما رأتني واقفاً عند الباب لم تتوقف، بل قالت بصوت عالٍ:

> «انظر جيداً يا ولد. هذا البيت صار بيت دعارة بفضل عائلتك. أمك راقصة في النادي، أختك الكبرى عاهرة جامعية، والصغيرة تبث عريها على الإنترنت. وأنت واقف تتفرج كأنك محترم. استمتع يا حبيبي... هذا نصيبك فتعود عليه.»

ثم عادت تمارس الجنس أمامي دون خجل وهي تضحك وتنظُر إليّ عمداً.

منذ ذلك اليوم أصبحت تفعل ذلك أمامي أكثر، وتناديني أحياناً لأشاهد أو تترك الباب مفتوحاً، مكررة أن المنزل لم يعد بيتاً بل مكاناً للكسب من الأجساد.`,

  'childhood-friend': `### ملف الشخصية | PROFILE
- **الاسم:** صديقة الطفولة
- **العمر:** في مثل عمري
- **العلاقة:** [صديقة سرية / حبيبة]
- **التضحيات:** [استغلال جسدها لحمايتي وتوظيفي]
- **التحول:** **سرية تماماً** ◄ **تضحية جسدية مطلقة**

---

### القصة والخلفية

أنا أحبها بجنون منذ كنا أطفالاً، وهي تحبني أيضاً، لكننا نخفي علاقتنا تماماً عن الجميع. أتحدث عنها دائماً كأنها مجرد صديقة طفولة طيبة، بينما في الحقيقة أنام معها سراً منذ سنوات.

> **«أتذكر كيف ساعدتني في المدرسة بطرق لا يصدقها أحد. عندما كنت أتعرض للتنمر، دخلت مع الأولاد إلى غرفة فارغة وسمحت لهم بأن يفعلوا بها ما يريدون بشرط أن يتوقفوا عن لمسي نهائياً.»**

#### التضحيات المتتالية
- **في المدرسة:** أرضت المتنمرين للتوقف عن إيذاي.
- **مع المعلمة:** مارست الجنس مع المعلمة في غرفة المدرسين لمنع رسوبي في المادة.
- **في التوظيف:** نامت مع المسؤولين عن التوظيف واحداً تلو الآخر حتى اختارت أحدهم وركعت أمامه ليعطيني الوظيفة.

#### العلاقات المستمرة
الآن هي ما زالت تنام مع ذلك المسؤول من وقت لآخر كلما احتجت إلى علاوة أو ترقية. تقضي الليل كله معه ثم تعود في الصباح وتخبرني بالتفاصيل وهي تضحك.

تقول لي إنها تفعل ذلك من أجلي فقط، وإنها تضع مصلحتي فوق كل شيء. وأنا أستمع إليها وأحتضنها في السرير السري، وأشكرها بحرارة، ثم أمارس معها الجنس كأنها لم تكن مع رجل آخر قبل ساعات.`
};

function renderMarkdown(md, chKey = 'big-sister') {
  if (!md) return '';

  // Clean out any raw markdown image tags (even multiline) and any lines referencing assets/family
  let cleanMd = md
    .replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, '')
    .replace(/^.*assets\/family.*$/gim, '')
    .replace(/!\[.*?\]/g, '');

  let html = cleanMd
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/&lt;u&gt;/g, '<u>').replace(/&lt;\/u&gt;/g, '</u>')
    .replace(/➔/g, '◄')
    .replace(/«(.*?)»/g, "<span class='bio-dialogue'>«$1»</span>")
    .replace(/"(.*?)"/g, "<span class='bio-quote-inline'>\"$1\"</span>")
    .replace(/\[(.*?)\]/g, "<span class='bio-badge'>$1</span>")

    .replace(/^### (.*$)/gim, `<h3 class='bio-h3'>${THEME_HEADER_ICONS[chKey] || ''} <span>$1</span></h3>`)
    .replace(/^#### (.*$)/gim, `<h4 class='bio-h4'><span>$1</span></h4>`)
    .replace(/^## (.*$)/gim, `<h2 class='bio-h2'>$1</h2>`)
    .replace(/^# (.*$)/gim, `<h1 class='bio-h1'>$1</h1>`)

    .replace(/^---$/gim, "<hr class='bio-hr'>")
    .replace(/^&gt;\s?(.*$)/gim, `<blockquote class='bio-quote-card'>${SVG_ICONS.quote}<div>$1</div></blockquote>`)

    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong class='bio-bold-italic'>$1</strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong class='bio-bold'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em class='bio-italic'>$1</em>")
    .replace(/\_(.*?)\_/g, "<em class='bio-italic'>$1</em>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>");

  const lines = html.split('\n');
  let inStatGrid = false;
  let inBulletList = false;
  let result = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      let content = trimmed.slice(2);
      const statMatch = content.match(/^<strong class='bio-bold'>(.*?):?<\/strong>\s*(.*)/);
      
      if (statMatch) {
        if (inBulletList) { inBulletList = false; result.push("</ul>"); }
        if (!inStatGrid) {
          inStatGrid = true;
          result.push("<div class='bio-stat-grid'>");
        }
        const key = statMatch[1].replace(/:$/, '').trim();
        const val = statMatch[2];
        const iconSvg = PARAM_ICONS[key] || SVG_ICONS.bullet;
        result.push(`
          <div class='bio-stat-card'>
            <div class='bio-stat-icon-wrapper'>${iconSvg}</div>
            <div class='bio-stat-info'>
              <span class='bio-stat-label-text'>${key}</span>
              <span class='bio-stat-val-text'>${val}</span>
            </div>
          </div>`);
      } else {
        if (inStatGrid) { inStatGrid = false; result.push("</div>"); }
        if (!inBulletList) {
          inBulletList = true;
          result.push("<ul class='bio-bullet-list'>");
        }
        result.push(`<li class='bio-bullet-item'><span class='bio-bullet-icon'>${SVG_ICONS.bullet}</span><div>${content}</div></li>`);
      }
    } else {
      if (inStatGrid) { inStatGrid = false; result.push("</div>"); }
      if (inBulletList) { inBulletList = false; result.push("</ul>"); }

      if (trimmed === '') {
        result.push("<div class='bio-spacer'></div>");
      } else if (!trimmed.startsWith('<h') && !trimmed.startsWith('<hr') && !trimmed.startsWith('<blockquote')) {
        result.push(`<p class='bio-p'>${line}</p>`);
      } else {
        result.push(line);
      }
    }
  }
  if (inStatGrid) result.push("</div>");
  if (inBulletList) result.push("</ul>");

  // Render Photo Gallery Grid if character has pictures
  const items = GALLERIES[chKey] || [];
  if (items.length > 0) {
    let galleryHtml = `
      <div class="bio-gallery-title-wrapper">
        <h3 class="bio-h3" style="margin:0; border:none; padding:0;">${SVG_ICONS.camera} <span>معرض الصور والأرشيف | PHOTO GALLERY</span></h3>
      </div>
      <div class="bio-gallery-grid">`;
    
    items.forEach((item, idx) => {
      galleryHtml += `
        <div class="bio-gallery-card" data-idx="${idx}">
          <div class="bio-gallery-img-container">
            <img src="${item.src}" alt="${item.title}" loading="lazy">
          </div>
          <div class="bio-gallery-card-body">
            <div class="bio-gallery-card-title">${SVG_ICONS.camera} <span>${item.title}</span></div>
            <div class="bio-gallery-card-comment">${item.comment}</div>
          </div>
        </div>`;
    });

    galleryHtml += `</div>`;
    result.push(galleryHtml);
  }

  return result.join('');
}

function openLightbox(item, tone) {
  const modal = document.createElement('div');
  modal.className = 'roster-lightbox-backdrop';
  modal.style.setProperty('--tone', tone);
  modal.innerHTML = `
    <div class="roster-lightbox-content">
      <button class="roster-lightbox-close" title="إغلاق">${SVG_ICONS.close}</button>
      <div class="roster-lightbox-img-wrap">
        <img src="${item.src}" alt="${item.title}">
      </div>
      <div class="roster-lightbox-meta">
        <div class="roster-lightbox-title">${SVG_ICONS.camera} <span>${item.title}</span></div>
        <div class="roster-lightbox-desc">${item.comment}</div>
      </div>
    </div>`;

  const close = () => modal.remove();
  modal.querySelector('.roster-lightbox-close').onclick = close;
  modal.onclick = (e) => { if (e.target === modal) close(); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  addEventListener('keydown', onKey);
  document.body.appendChild(modal);
}

const ART = 'assets/family/';

const cutout = (() => {
  const cache = new Map();
  const NEAR = 236;
  const EDGE = 205;

  function process(img) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);

    const { width: W, height: H } = c;
    const image = ctx.getImageData(0, 0, W, H);
    const px = image.data;
    const seen = new Uint8Array(W * H);
    const stack = new Int32Array(W * H);
    let top = 0;

    const white = (p) => {
      const i = p << 2;
      return px[i] >= NEAR && px[i + 1] >= NEAR && px[i + 2] >= NEAR;
    };
    const push = (p) => {
      if (!seen[p] && white(p)) { seen[p] = 1; stack[top++] = p; }
    };

    for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
    for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }

    while (top) {
      const p = stack[--top];
      px[(p << 2) + 3] = 0;
      const x = p % W;
      if (x > 0) push(p - 1);
      if (x < W - 1) push(p + 1);
      if (p >= W) push(p - W);
      if (p < W * H - W) push(p + W);
    }

    for (let p = 0; p < W * H; p++) {
      const i = p << 2;
      if (!px[i + 3]) continue;
      const x = p % W;
      const bare = (x > 0 && !px[((p - 1) << 2) + 3])
        || (x < W - 1 && !px[((p + 1) << 2) + 3])
        || (p >= W && !px[((p - W) << 2) + 3])
        || (p < W * H - W && !px[((p + W) << 2) + 3]);
      if (!bare) continue;
      const lum = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114);
      if (lum > EDGE) px[i + 3] = Math.max(0, Math.round(255 - (lum - EDGE) * (255 / (255 - EDGE))));
    }

    ctx.putImageData(image, 0, 0);
    return c.toDataURL('image/png');
  }

  return (src) => {
    if (cache.has(src)) return cache.get(src);

    const job = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try { resolve(process(img)); } catch { resolve(src); }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });

    cache.set(src, job);
    return job;
  };
})();

Apps.mahram = {
  title: 'محارمي',
  glyph: Icons.roster,
  width: 940,
  height: 560,
  mount(body) {
    body.style.padding = '0';
    body.style.overflow = 'hidden';

    const lineup = document.createElement('div');
    lineup.className = 'roster';
    lineup.innerHTML = '<div class="roster-head">محارمي · ROSTER</div>';
    body.appendChild(lineup);

    for (const ch of ROSTER) {
      const panel = document.createElement('div');
      panel.className = 'roster-panel';
      panel.style.setProperty('--art', `url("${new URL(ART + ch.art, location.href).href}")`);
      panel.style.setProperty('--tone', ch.tone);
      panel.innerHTML = `
        <img class="roster-sprite" alt="">
        <div class="roster-plate">
          <div class="nm"><span></span></div>
          <div class="rl"></div>
        </div>`;
      panel.querySelector('.nm span').textContent = ch.name;
      panel.querySelector('.rl').textContent = ch.role;

      cutout(ART + ch.sprite).then((url) => { panel.querySelector('.roster-sprite').src = url; });
      panel.onclick = () => select(ch, panel);
      lineup.appendChild(panel);
    }

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');

    function select(ch, panel) {
      if (lineup.classList.contains('picking')) return;
      lineup.classList.add('picking');
      panel.classList.add('picked');

      const flash = document.createElement('div');
      flash.className = 'roster-flash';
      flash.addEventListener('animationend', () => flash.remove(), { once: true });
      lineup.appendChild(flash);

      setTimeout(() => detail(ch), reduced.matches ? 0 : 230);
    }

    function release() {
      lineup.classList.remove('picking');
      for (const p of lineup.querySelectorAll('.picked')) p.classList.remove('picked');
    }

    async function detail(ch) {
      const view = document.createElement('div');
      view.className = `roster-detail theme-${ch.key}`;
      view.style.setProperty('--tone', ch.tone);
      view.innerHTML = `
        <img alt="" class="roster-detail-sprite">
        <div class="info roster-detail-container">
          <div class="roster-detail-watermark">${SVG_WATERMARKS[ch.key] || ''}</div>
          
          <div class="roster-hud-nav">
            <button class="roster-btn-prof roster-back">${SVG_ICONS.back} <span>الرجوع</span></button>
          </div>

          <div class="roster-title-block">
            <h2 class="roster-title-main"><span>${ch.name}</span></h2>
            <div class="roster-role-badge">${THEME_HEADER_ICONS[ch.key] || ''} <span>${ch.role}</span></div>
          </div>

          <div class="roster-artistic-stream"></div>
        </div>`;

      view.querySelector('.roster-detail-sprite').src = await cutout(ART + ch.sprite);

      const showcaseStream = view.querySelector('.roster-artistic-stream');

      const saved = await DB.get('bios', ch.key);
      let rawContent = saved?.body || STORIES[ch.key] || '';
      if (rawContent.includes('![') || rawContent.includes('assets/family') || rawContent.includes('ابنتي') || rawContent.includes('الدور:')) {
        rawContent = STORIES[ch.key] || '';
      }
      await DB.put('bios', { id: ch.key, name: ch.name, body: rawContent });

      showcaseStream.innerHTML = renderMarkdown(rawContent, ch.key);

      // Attach Lightbox Handlers
      showcaseStream.onclick = (e) => {
        const card = e.target.closest('.bio-gallery-card');
        if (card) {
          const idx = parseInt(card.dataset.idx, 10);
          const items = GALLERIES[ch.key] || [];
          if (items[idx]) {
            openLightbox(items[idx], ch.tone);
          }
        }
      };

      [...view.querySelector('.info').children].forEach((el, i) => el.style.setProperty('--i', i));

      let closing = false;
      const close = () => {
        if (closing) return;
        closing = true;
        removeEventListener('keydown', onKey);
        view.classList.add('out');

        const done = () => { view.remove(); release(); };
        view.addEventListener('animationend', done, { once: true });
        setTimeout(done, 400);
      };

      const onKey = (e) => {
        if (!view.isConnected) return removeEventListener('keydown', onKey);
        if (e.key === 'Escape') close();
      };
      addEventListener('keydown', onKey);
      view.querySelector('.roster-back').onclick = close;

      body.appendChild(view);
    }
  },
};
