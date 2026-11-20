/* =========================================================
   common.js — أدوات وتفاعلات مشتركة بين كل صفحات الموقع:
   الرئيسية (index.html) والملف الشخصي (profile.html).
   يعتمد على البيانات الموجودة في data.js — لا تحتاج لتعديل هذا الملف.
   ========================================================= */

document.documentElement.classList.remove("no-js");

/* ---------- أدوات مساعدة ---------- */

// حماية النصوص قبل إدراجها في الصفحة
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// تحويل الأرقام العربية إلى إنجليزية وإزالة المسافات والرموز
function normalizePhone(raw) {
  if (!raw) return "";
  const western = String(raw).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  const digits = western.replace(/\D/g, "").replace(/^00/, "");
  // نقبل فقط الأرقام بطول منطقي (8 إلى 15 رقمًا حسب المعيار الدولي)
  return digits.length >= 8 && digits.length <= 15 ? digits : "";
}

// السماح فقط بروابط http/https الصحيحة
function safeURL(raw) {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

// نقبل مسارًا داخليًا مثل images/members/a.jpg أو رابط https فقط
function safeImagePath(raw) {
  if (!raw) return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(raw) ? safeURL(raw) : raw;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}

const icons = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4 7.3V17h16V7.3z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0zM8.5 19a4.5 4.5 0 0 1-3.2-7.7l2.1-2.1a1 1 0 0 1 1.4 1.4l-2.1 2.1a2.5 2.5 0 0 0 3.5 3.5l2.1-2.1a1 1 0 0 1 1.4 1.4l-2.1 2.1A4.5 4.5 0 0 1 8.5 19zm7.4-4.8a1 1 0 0 1-.7-1.7l2.1-2.1a2.5 2.5 0 0 0-3.5-3.5l-2.1 2.1a1 1 0 0 1-1.4-1.4l2.1-2.1a4.5 4.5 0 0 1 6.4 6.4l-2.1 2.1a1 1 0 0 1-.8.2z"/></svg>',
  person: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"/></svg>',
  // رمز بديل لعضوة ترتدي الحجاب — يُستخدم عند avatar: "hijab"
  personHijab: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-opacity=".55" d="M12 1.6C8 1.6 5 4.5 5 8.6c0 2 .5 3.4 1.2 4.5-2.2 1-3.7 2.9-4.1 5.3l-.5 3.4c-.1.6.4 1.2 1 1.2h18.8c.6 0 1.1-.6 1-1.2l-.5-3.4c-.4-2.4-1.9-4.3-4.1-5.3.7-1.1 1.2-2.5 1.2-4.5 0-4.1-3-7-7-7Z"/><path d="M12 4.5c2 0 3.5 1.9 3.5 4.3S14 13.2 12 13.2 8.5 11.2 8.5 8.8 10 4.5 12 4.5Z"/></svg>'
};

// اختيار الرمز البديل حسب avatar في بيانات الشخص
function fallbackIcon(avatar) {
  return avatar === "hijab" ? icons.personHijab : icons.person;
}

const info = typeof COUNCIL_INFO !== "undefined" ? COUNCIL_INFO : {};
const leadership = typeof LEADERSHIP !== "undefined" && Array.isArray(LEADERSHIP) ? LEADERSHIP : [];
const members = typeof MEMBERS !== "undefined" && Array.isArray(MEMBERS) ? MEMBERS : [];
const categories = typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES) ? CATEGORIES : [];
const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

// رابط صفحة الملف الشخصي لشخص ما (فارغ إذا لم يكن له id)
function profileURL(person) {
  return person && person.id ? `profile.html?id=${encodeURIComponent(person.id)}` : "";
}

// بطاقة بصورة كاملة والاسم فوقها (للقيادات والممثلين)
// options: { photo, avatar, name, title, subtitle, label, pending, cta, bare }
// bare:   صورة فقط بدون النص فوقها (تُستخدم في صفحة الملف الشخصي)
// avatar: نوع الرمز البديل عند غياب الصورة — "hijab" أو اتركه فارغًا للرمز العام
function portraitHTML({ photo, avatar, name, title, subtitle, label, pending, cta, bare }) {
  const src = safeImagePath(photo);
  return `
    <div class="portrait${bare ? " is-bare" : ""}">
      <div class="portrait-fallback${avatar === "hijab" ? " is-hijab" : ""}" aria-hidden="true">${fallbackIcon(avatar)}</div>
      ${src ? `<img src="${escapeHTML(src)}" alt="صورة ${name || title}" loading="lazy">` : ""}
      ${label ? `<span class="portrait-label">${label}</span>` : ""}
      ${bare ? "" : `<div class="portrait-text">
        <h3 class="${pending ? "is-pending" : ""}">${name || title}</h3>
        ${name && title ? `<p>${title}</p>` : ""}
        ${subtitle ? `<p class="portrait-sub">${subtitle}</p>` : ""}
        ${cta ? `<span class="portrait-cta" aria-hidden="true">عرض الملف ←</span>` : ""}
      </div>`}
    </div>`;
}

// إذا لم تُحمَّل صورة (مسار خاطئ مثلًا) نحذفها ليظهر الرمز البديل
function handleBrokenPhotos(container) {
  container.querySelectorAll(".portrait img").forEach((img) => {
    img.addEventListener("error", () => img.remove(), { once: true });
  });
}

/* ---------- الشعار (إن وُجد) ---------- */
(function renderLogo() {
  const logo = safeImagePath(info.logo);
  const mark = document.getElementById("brandMark");
  if (!logo || !mark) return;
  const img = new Image();
  img.alt = "";
  // لا نُدرج الصورة إلا بعد نجاح التحميل، فتبقى المساحة فارغة إن لم يُعثر على الملف
  img.onload = () => { mark.innerHTML = ""; mark.appendChild(img); };
  img.src = logo;
})();

/* ---------- الشريط العلوي ---------- */
// لا توجد قائمة منسدلة: التبويبات ظاهرة دائمًا (أعلى الشاشة في الحاسب،
// وفي شريط سفلي ثابت على الجوال).
const header = document.getElementById("siteHeader");

// ظل الشريط وزر العودة للأعلى عند التمرير
const backToTop = document.getElementById("backToTop");
function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
  if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- وسائل التواصل الرسمية في التذييل ---------- */
(function renderOfficialContacts() {
  const list = document.getElementById("officialContacts");
  if (!list) return;
  const items = [];

  if (isEmail(info.email)) {
    items.push(`<li><a href="mailto:${escapeHTML(info.email)}">${escapeHTML(info.email)}</a></li>`);
  }
  [["website", "موقع الجامعة"], ["x", "منصة X"], ["snapchat", "Snapchat"], ["instagram", "Instagram"]].forEach(([key, label]) => {
    const url = safeURL(info[key]);
    if (url) items.push(`<li><a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${label}</a></li>`);
  });

  list.innerHTML = items.length
    ? items.join("")
    : `<li class="placeholder">ستُضاف وسائل التواصل الرسمية قريبًا.</li>`;
})();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- الحركة عند التمرير ---------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeReveal(root = document) {
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
}
observeReveal();