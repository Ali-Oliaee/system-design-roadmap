/**
 * نگاشت فارسیِ گروه ها و دسته ها.
 * کلیدها دقیقاً همان متن انگلیسی داخل roadmap.txt هستند.
 */

export const GROUPS = {
  'Core Roadmap': {
    id: 'core',
    title: 'مسیر اصلی',
    summary: 'ستون فقرات طراحی سیستم — از مبانی کامپیوتر تا مصاحبهٔ فنی.',
    order: 1,
  },
  'Engineering Tracks': {
    id: 'tracks',
    title: 'مسیرهای تخصصی',
    summary: 'عمق بخشی بر اساس نقش: فرانت اند، بک اند و موبایل.',
    order: 2,
  },
  'Concepts & Glossary': {
    id: 'concepts',
    title: 'مفاهیم و واژه نامه',
    summary: 'تعریف های کوتاه و دقیق برای مرور سریع پیش از مصاحبه.',
    order: 3,
  },
};

/** category (انگلیسی) → { title, slug?, summary } */
export const SECTIONS = {
  'Computer Fundamentals': {
    title: 'مبانی کامپیوتر',
    summary: 'شبکه، سیستم عامل و ساختارهای پایه ای که هر تصمیم معماری روی آن ها سوار می شود.',
  },
  Security: {
    title: 'امنیت',
    summary: 'رمزنگاری، احراز هویت، نشست و توکن — از کوکی تا OAuth 2.0.',
  },
  'DevOps and CI/CD': {
    title: 'DevOps و CI/CD',
    summary: 'کانتینر، Kubernetes، خط لولهٔ استقرار و الگوهای انتشار.',
  },
  'How it Works?': {
    title: 'چطور کار می کند؟',
    summary: 'کالبدشکافی سرویس ها و پروتکل های آشنا؛ از داخل چه خبر است.',
  },
  'Cloud & Distributed Systems': {
    title: 'ابر و سیستم های توزیع شده',
    summary: 'مقیاس پذیری، هماهنگی، CAP و الگوهای زیرساخت ابری.',
  },
  'Software Development': {
    title: 'توسعهٔ نرم افزار',
    summary: 'کیفیت کد، تست، الگوهای برنامه نویسی و جریان کار تیمی.',
  },
  'DevTools & Productivity': {
    title: 'ابزارها و بهره وری',
    summary: 'Git، ویرایشگر، دیباگ و ابزارهایی که سرعت تیم را می سازند.',
  },
  'Software Architecture': {
    title: 'معماری نرم افزار',
    summary: 'میکروسرویس، مونولیت، DDD و تصمیم های بلندمدت ساختاری.',
  },
  'Payment and Fintech': {
    title: 'پرداخت و فین تک',
    summary: 'تسویه، درگاه، idempotency و دقت پولی در سیستم های مالی.',
  },
  'Caching & Performance': {
    title: 'کش و کارایی',
    summary: 'لایه های کش، سیاست حذف، تأخیر و گلوگاه های واقعی.',
  },
  'Database and Storage': {
    title: 'پایگاه داده و ذخیره سازی',
    summary: 'SQL و NoSQL، ایندکس، شاردینگ، تراکنش و موتورهای ذخیره سازی.',
  },
  'API and Web Development': {
    title: 'API و توسعهٔ وب',
    summary: 'REST، GraphQL، gRPC، وب هوک و قراردادهای پایدار بین سرویس ها.',
  },
  'AI and Machine Learning': {
    title: 'هوش مصنوعی و یادگیری ماشین',
    summary: 'زیرساخت مدل، بردار، RAG و جای گیری ML در معماری سیستم.',
  },
  'Real World Case Studies': {
    title: 'مطالعات موردی واقعی',
    summary: 'معماری شرکت های بزرگ؛ چه ساختند و چرا همان را ساختند.',
  },
  'Technical Interviews': {
    title: 'مصاحبه های فنی',
    summary: 'چارچوب پاسخ دهی، سؤال های پرتکرار و تمرین طراحی سیستم.',
  },

  'Frontend Engineering': {
    title: 'مهندسی فرانت اند',
    summary: 'رندر، حالت، بسته بندی، کارایی مرورگر و معماری کلاینت.',
  },
  'Backend Engineering': {
    title: 'مهندسی بک اند',
    summary: 'سرویس نویسی، همروندی، صف، پایگاه داده و قابلیت اتکا.',
  },
  'Mobile Engineering': {
    title: 'مهندسی موبایل',
    summary: 'کلاینت آفلاین اول، همگام سازی، نوتیفیکیشن و محدودیت های دستگاه.',
  },

  'Networking & Protocols': {
    title: 'شبکه و پروتکل ها',
    summary: 'از فریم و پکت تا TLS و QUIC — واژگان دقیق لایه های شبکه.',
  },
  'Real-Time & Messaging': {
    title: 'بلادرنگ و پیام رسانی',
    summary: 'پولینگ، WebSocket، SSE، صف و استریم رویداد.',
  },
  'API Design & Reliability': {
    title: 'طراحی API و پایداری',
    summary: 'نسخه بندی، idempotency، تلاش مجدد، محدودسازی نرخ و قطع کنندهٔ مدار.',
  },
  'Data & Storage': {
    title: 'داده و ذخیره سازی',
    slug: 'data-storage-concepts',
    summary: 'مدل داده، ایندکس، تراکنش و سازوکارهای درونی موتورهای ذخیره سازی.',
  },
  'Security, Auth & Identity': {
    title: 'امنیت، احراز هویت و هویت',
    summary: 'هش، امضا، نشست، توکن و مرزهای اعتماد.',
  },
  'Distributed Systems': {
    title: 'سیستم های توزیع شده',
    summary: 'اجماع، ساعت، پارتیشن، سازگاری و شکست های جزئی.',
  },
  'Observability & Delivery': {
    title: 'مشاهده پذیری و تحویل',
    summary: 'لاگ، متریک، ترِیس، SLO و الگوهای انتشار امن.',
  },
};

/** ترجمهٔ نام دسته وقتی در دو گروه تکرار شده باشد */
export const SECTION_SLUG_OVERRIDES = {
  // «Caching & Performance» هم در مسیر اصلی است هم در واژه نامه
  'concepts::Caching & Performance': 'caching-performance-concepts',
};
