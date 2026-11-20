/* =========================================================
   data.js — ملف البيانات
   عدّل هذا الملف فقط لتحديث الأعضاء والاستبيانات ووسائل التواصل.
   المصدر: دليل «قواعد عمل واختصاص المجلس الاستشاري الطلابي بجامعة الملك عبدالعزيز»
   (الإصدار الأول ١٤٤٧هـ / ٢٠٢٥م — إعداد عمادة شؤون الطلاب)
   ========================================================= */

/* ---------- معلومات عامة ووسائل التواصل الرسمية ----------
   اترك أي قيمة فارغة "" لإخفائها من الموقع.
   logo: مسار ملف الشعار الرسمي بعد الحصول عليه من العمادة، مثال: "images/logo.png"
         إذا تُرك فارغًا يظهر رمز المجلس البديل.
   وسائل التواصل التالية هي وسائل عمادة شؤون الطلاب (أمانة المجلس) كما وردت في الدليل.
*/
const COUNCIL_INFO = {
    logo: "images/logo.png.png",
  website: "https://www.kau.edu.sa",
  email: "dsa@kau.sa",
  x: "https://x.com/st_affairs",
  snapchat: "https://www.snapchat.com/add/st_affairs",
  instagram: ""
};

/* ---------- هيكل المجلس: الرئيس والأمين وأعضاء القيادات ----------
   يظهر في قسم «هيكل المجلس».
   group:    "chair" رئيس المجلس / "secretary" أمين المجلس / "leader" عضو من قيادات الجامعة
   position: المنصب كما في الدليل
   name:     الاسم — اتركه "" ليظهر المنصب فقط
   photo:    مسار الصورة، مثال: "images/leaders/chair.jpg" — اتركه "" لعرض رمز بديل
   لإضافة عضو آخر من القيادات: انسخ أحد أسطر "leader" وعدّل المنصب.
   ملاحظة: صفحات القيادات تعرض الاسم والمنصب فقط — بلا نبذة ولا وسائل تواصل،
           لأن ممثلي الطلبة هم حلقة التواصل مع المجلس.
*/
const LEADERSHIP = [
  { id: "kabli",  group: "chair",     position: "نائب رئيس الجامعة للشؤون التعليمية",          name: "د. محمد بن رضا كابلي",        photo: "images/leaders/kabli.jpg"  },
  { id: "fouad",  group: "secretary", position: "عميد شؤون الطلاب",                            name: "أ.د. فؤاد بن عبد العزيز أبو لبن", photo: "images/leaders/FOuad.jpg" },
  { id: "omody",  group: "leader",    position: "نائب رئيس الجامعة للحياة الجامعية والتشغيل", name: "د. محمد بن أحمد العمودي",      photo: "images/leaders/omody.jpg"  },
  { id: "ghamdi", group: "leader",    position: "عميد عمادة القبول والتسجيل",                  name: "د.جمعان بن صالح الغامدي",      photo: "images/leaders/ghamdi.jpg" },
  { id: "sulami", group: "leader",    position: "وكيل عمادة الدراسات العليا",                  name: "د.عبدالوهاب بن مستور السلمي",  photo: "images/leaders/sulami.png" },
  { id: "musab",  group: "leader",    position: "الرئيس التنفيذي للاتصال المؤسسي",             name: "د.مصعب بن فالح الحربي",       photo: "images/leaders/musab.jpg"  }
];
/* ---------- فئات التمثيل والكليات التابعة لها ----------
   حسب «توزيع المرشحين والمرشحات حسب الكليات والفروع الأكاديمية» في الدليل.
   id:       معرّف الفئة (لا تغيّره، تستخدمه بيانات الأعضاء)
   name:     اسم الفئة كما يظهر في الموقع
   colleges: الكليات التابعة للفئة (تظهر في قائمة «اعثر على ممثلك»)
*/
const CATEGORIES = [
  {
    id: "health",
    name: "الكليات الصحية",
    colleges: ["كلية الطب", "كلية طب الأسنان", "كلية التمريض", "كلية الصيدلة", "كلية العلوم الطبية التطبيقية", "كلية علوم التأهيل الطبي"]
  },
  {
    id: "engineering",
    name: "الكليات الهندسية والحاسوبية",
    colleges: ["كلية الهندسة", "كلية الحاسبات وتقنية المعلومات", "كلية العمارة والتخطيط"]
  },
  {
    id: "science",
    name: "الكليات العلمية",
    colleges: ["كلية العلوم", "كلية التعدين", "كلية الاقتصاد والإدارة", "كلية الدراسات البحرية", "كلية علوم البحار", "كلية العلوم البيئية", "كلية علوم الإنسان والتصاميم"]
  },
  {
    id: "humanities",
    name: "الكليات الأدبية",
    colleges: ["كلية الحقوق", "كلية الآداب والعلوم الإنسانية", "كلية الاتصال والإعلام", "كلية السياحة"]
  },
  {
    id: "rabigh",
    name: "كليات فرع رابغ",
    colleges: ["كلية الهندسة فرع رابغ", "كلية العلوم والآداب برابغ", "كلية الحاسبات وتقنية المعلومات برابغ", "كلية العلوم الطبية التطبيقية فرع رابغ", "كلية الطب فرع رابغ"]
  },
  {
    id: "graduate",
    name: "الدراسات العليا",
    colleges: ["طلبة الدراسات العليا في جميع الكليات"]
  },
  {
    id: "international",
    name: "الطلبة الدوليون",
    colleges: ["الطلبة الدوليون في جميع الكليات"]
  },
  {
    id: "disability",
    name: "الطلبة ذوو الإعاقة",
    colleges: ["الطلبة ذوو الإعاقة في جميع الكليات"]
  }
];

/* ---------- الأعضاء من الطلاب والطالبات ----------
   المقاعد التالية مأخوذة من «هيكل المجلس الاستشاري الطلابي» في الدليل.
   أضف بيانات كل عضو في مقعده بعد اعتماد التشكيل:

   name:     الاسم الكامل — اتركه "" ليظهر «يُعلن قريبًا»
   category: معرّف الفئة من القائمة أعلاه (health / engineering / science / humanities / rabigh / graduate / international / disability)
   role:     الصفة داخل المجلس
   college:  كلية العضو (اختياري)
   photo:    مسار الصورة، مثال: "images/members/name.jpg" — اتركه "" لعرض رمز بديل
   avatar:   نوع الرمز البديل عند غياب الصورة: "hijab" لرمز محجبة — احذفه لاستخدام الرمز العام
   phone:    رقم الاتصال المصرّح بنشره بالصيغة الدولية، مثال: "+9665XXXXXXXX" — اتركه "" لإخفاء زر الاتصال
   whatsapp: رقم واتساب المعتمد بالصيغة الدولية — اتركه "" لإخفاء زر واتساب
   email:    البريد الجامعي (اختياري) — اتركه "" لإخفائه

   ⚠️ لا تنشر أي رقم أو بريد إلا بموافقة العضو.
*/
const MEMBERS = [
  { id: "aseel",   name: "أصيل علاء الدين محمد",    category: "health",        role: "ممثل الكليات الصحية",               photo: "images/members/aseel.jpg.png", college: "", phone: "", whatsapp: "561196759", email: "amohammed0388@stu.kau.edu.sa" },
  { id: "sultana", name: "سلطانة بندر آل مساعد",    category: "health",        role: "ممثلة الكليات الصحية",              photo: "images/members/sultanah.jpg",                             college: "", phone: "", whatsapp: "", email: "salmusaad0003@stu.kau.edu.sa" },
  { id: "ziyad",   name: "زياد محمد الغامدي",       category: "engineering",   role: "ممثل الكليات الهندسية والحاسوبية",  photo: "images/members/ziyad.jpeg",    college: "", phone: "", whatsapp: "", email: "zalghamdi0106@stu.kau.edu.sa" },
  { id: "jood",    name: "جود خالد بالخير",         category: "engineering",   role: "ممثلة الكليات الهندسية والحاسوبية", photo: "images/members/jood.jpg",                             college: "", phone: "", whatsapp: "", email: "jbalkhair0001@stu.kau.edu.sa" },
  { id: "battal",  name: "بتال فيصل الغامدي",       category: "science",       role: "ممثل الكليات العلمية",              photo: "images/members/battal.jpg",                             college: "", phone: "", whatsapp: "", email: "balghamdi0600@stu.kau.edu.sa" },
  { id: "ghala",   name: "غلا محمد جباري",          category: "science",       role: "ممثلة الكليات العلمية",             photo: "images/members/ghala.jpg",                             college: "", phone: "", whatsapp: "", email: "GJABBARY0001@stu.kau.edu.sa" },
  { id: "badr",    name: "بدر شبل العتيبي",         category: "humanities",    role: "ممثل الكليات الأدبية",              photo: "images/members/badr.jpg",                             college: "", phone: "", whatsapp: "", email: "balotaibi0240@stu.kau.edu.sa" },
  { id: "abeer",   name: "عبير صالح المنصوري",      category: "humanities",    role: "ممثلة الكليات الأدبية",             photo: "", avatar: "hijab",            college: "", phone: "", whatsapp: "", email: "aalmansouri0010@stu.kau.edu.sa" },
  { id: "turki",   name: "تركي أيمن قشلان",         category: "rabigh",        role: "ممثل كليات فرع رابغ",               photo: "images/members/turki.jpg",                             college: "", phone: "", whatsapp: "", email: "tqashlan@stu.kau.edu.sa" },
  { id: "jana",    name: "جنى مازن عالم",           category: "rabigh",        role: "ممثلة كليات فرع رابغ",              photo: "images/members/jana.jpg",                             college: "", phone: "", whatsapp: "", email: "JAALEM@stu.kau.edu.sa" },
  { id: "marwan",  name: "مروان عبدالرحمن الغامدي", category: "graduate",      role: "ممثل الدراسات العليا",              photo: "images/members/marwan.jpg",                             college: "", phone: "", whatsapp: "", email: "malghamdi2449@stu.kau.edu.sa" },
  { id: "abrar",   name: "أبرار أكرم الكعبي",       category: "graduate",      role: "ممثلة الدراسات العليا",             photo: "images/members/abrar.jpg",                             college: "", phone: "", whatsapp: "", email: "aalkaabi0013@stu.kau.edu.sa" },
  { id: "saber",   name: "صابر ريحان",              category: "international", role: "ممثل الطلبة الدوليين",              photo: "images/members/saber.jpg",                             college: "", phone: "", whatsapp: "", email: "srayhan@stu.kau.edu.sa" },
  { id: "yousef",  name: "يوسف حسن شراحيلي",        category: "disability",    role: "ممثل الطلبة ذوي الإعاقة",           photo: "images/members/yousef.jpg",                             college: "", phone: "", whatsapp: "", email: "ysharahili0002@stu.kau.edu.sa" }
];

/* ---------- الاستبيانات ----------
   id:          معرّف فريد بالإنجليزية بدون مسافات
   title:       عنوان الاستبيان
   description: وصف مختصر
   audience:    الفئة المستهدفة
   start:       تاريخ الفتح بصيغة "YYYY-MM-DD" — اتركه "" إن كان مفتوحًا من الآن
                (قبل هذا اليوم تظهر حالته «قريبًا» تلقائيًا)
   deadline:    تاريخ الانتهاء بصيغة "YYYY-MM-DD" — اتركه "" إن لم يوجد
                (تتحوّل حالته تلقائيًا إلى «منتهٍ» بعد انتهاء هذا اليوم)
   status:      "open" مفتوح · "soon" قريبًا · "closed" منتهٍ
   url:         رابط النموذج الخارجي (Microsoft Forms أو Google Forms) يبدأ بـ https://
                اتركه "" وسيظهر للطالب أن الاستبيان غير متاح حاليًا

   ⚠️ الاستبيانات التالية أمثلة تجريبية، وروابطها فارغة حتى تضيف الروابط الحقيقية.
*/
const SURVEYS = [
  {
    id: "health-colleges-suggestions",
    title: "حصر المقترحات لتطوير تجربة الطالب بالكليات الصحية",
    description: "شاركنا مقترحاتك لتطوير تجربتك الجامعية في الكليات الصحية، ليرفعها المجلس إلى الجهات المعنية.",
    audience: "طلاب وطالبات الكليات الصحية",
    start: "",
    deadline: "",
    status: "open",
    url: "https://forms.gle/bku7W6GW3E3J43WE8"
  }
  /* لإضافة استطلاع جديد: انسخ الكتلة أعلاه بين قوسين { } وضع بعدها فاصلة. */
];