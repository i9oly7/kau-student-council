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
    logo: "images/logo.png",
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
*/
const LEADERSHIP = [
  { group: "chair",     position: "نائب رئيس الجامعة للشؤون التعليمية",            name: "د. محمد بن رضا كابلي", photo: "images/leaders/kabli.jpg" },
  { group: "secretary", position: "عميد شؤون الطلاب",                              name: "أ.د. فؤاد بن أحمد ابولبن", photo: "images/leaders/FOuad.jpg" },
  { group: "leader",    position: "نائب رئيس الجامعة للحياة الجامعية والتشغيل",   name: "د. محمد بن أحمد العمودي", photo: "images/leaders/omody.jpg" },
  { group: "leader",    position: "عميد عمادة القبول والتسجيل",                    name: "د.جمعان بن صالح الغامدي", photo: "images/leaders/ghamdi.jpg" },
  { group: "leader",    position: "وكيل عمادة الدراسات العليا",                    name: "د.عبدالوهاب بن مستور السلمي", photo: "" },
  { group: "leader",    position: "الرئيس التنفيذي للاتصال المؤسسي", name: "د.مصعب بن فالح الحربي", photo: "images/leaders/musab.jpg" }
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
    colleges: ["كلية العلوم", "كلية علوم الأرض", "كلية الدراسات البحرية", "كلية علوم البحار", "كلية العلوم البيئية", "كلية علوم الإنسان والتصاميم"]
  },
  {
    id: "humanities",
    name: "الكليات الأدبية",
    colleges: ["كلية الاقتصاد والإدارة", "كلية الحقوق", "كلية الآداب والعلوم الإنسانية", "كلية الاتصال والإعلام", "كلية السياحة"]
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
   phone:    رقم الاتصال المصرّح بنشره بالصيغة الدولية، مثال: "+9665XXXXXXXX" — اتركه "" لإخفاء زر الاتصال
   whatsapp: رقم واتساب المعتمد بالصيغة الدولية — اتركه "" لإخفاء زر واتساب
   email:    البريد الجامعي (اختياري) — اتركه "" لإخفائه

   ⚠️ لا تنشر أي رقم أو بريد إلا بموافقة العضو.
*/
const MEMBERS = [
  { name: "أصيل بن علاء الدين محمد", category: "health",        role: "ممثل الكليات الصحية",                college: "", photo: "images/members/aseel.jpg.png", phone: "", whatsapp: "", email: "" },
  { name: "سلطانة المنصور", category: "health",        role: "ممثلة الكليات الصحية",               college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "engineering",   role: "ممثل الكليات الهندسية والحاسوبية",   college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "engineering",   role: "ممثلة الكليات الهندسية والحاسوبية",  college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "science",       role: "ممثل الكليات العلمية",               college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "science",       role: "ممثلة الكليات العلمية",              college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "بدر العتيبي", category: "humanities",    role: "ممثل الكليات الأدبية",               college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "عبير المنصوري", category: "humanities",    role: "ممثلة الكليات الأدبية",              college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "rabigh",        role: "ممثل كليات فرع رابغ",                college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "rabigh",        role: "ممثلة كليات فرع رابغ",               college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "مروان الغامدي", category: "graduate",      role: "ممثل الدراسات العليا",               college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "graduate",      role: "ممثلة الدراسات العليا",              college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "international", role: "ممثل/ة الطلبة الدوليين",             college: "", photo: "", phone: "", whatsapp: "", email: "" },
  { name: "", category: "disability",    role: "ممثل/ة الطلبة ذوي الإعاقة",          college: "", photo: "", phone: "", whatsapp: "", email: "" }
];

/* ---------- الاستبيانات ----------
   id:          معرّف فريد بالإنجليزية بدون مسافات
   title:       عنوان الاستبيان
   description: وصف مختصر
   audience:    الفئة المستهدفة
   deadline:    تاريخ الانتهاء بصيغة "YYYY-MM-DD" — اتركه "" إن لم يوجد
                (يُغلق الاستبيان تلقائيًا في الموقع بعد انتهاء هذا اليوم)
   status:      "open" مفتوح أو "closed" مغلق
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
    deadline: "",
    status: "open",
    url: "https://forms.gle/bku7W6GW3E3J43WE8"
  }
];