/* =========================================================
   script.js — التفاعلات: القائمة، عرض الأعضاء، البحث والتصفية،
   «من يمثّلني؟»، الاستبيانات، والحركات عند التمرير.
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

// توحيد الحروف العربية لتحسين البحث (أ/إ/آ → ا، ة → ه، ى → ي، وإزالة التشكيل)
function normalizeArabic(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
}

// تنسيق التاريخ بالعربية
function formatDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  if (isNaN(date)) return "";
  return date.toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
}

// الحالة الفعلية للاستبيان: يُغلق تلقائيًا بعد انتهاء يوم الموعد النهائي
function getSurveyStatus(survey) {
  if (survey.status !== "open") return "closed";
  if (survey.deadline) {
    const end = new Date(survey.deadline + "T23:59:59");
    if (!isNaN(end) && end < new Date()) return "closed";
  }
  return "open";
}

const icons = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4 7.3V17h16V7.3z"/></svg>',
  person: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"/></svg>'
};

const info = typeof COUNCIL_INFO !== "undefined" ? COUNCIL_INFO : {};

// بطاقة بصورة كاملة والاسم فوقها (للقيادات والممثلين)
// options: { photo, name, title, subtitle, label, pending }
function portraitHTML({ photo, name, title, subtitle, label, pending }) {
  const src = safeImagePath(photo);
  return `
    <div class="portrait">
      <div class="portrait-fallback" aria-hidden="true">${icons.person}</div>
      ${src ? `<img src="${escapeHTML(src)}" alt="صورة ${name || title}" loading="lazy">` : ""}
      ${label ? `<span class="portrait-label">${label}</span>` : ""}
      <div class="portrait-text">
        <h3 class="${pending ? "is-pending" : ""}">${name || title}</h3>
        ${name && title ? `<p>${title}</p>` : ""}
        ${subtitle ? `<p class="portrait-sub">${subtitle}</p>` : ""}
      </div>
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
  if (!logo) return;
  const mark = document.getElementById("brandMark");
  const img = new Image();
  img.alt = "";
  img.onload = () => { mark.innerHTML = ""; mark.appendChild(img); };
  img.src = logo; // إذا لم يُعثر على الملف يبقى الرمز البديل
})();

/* ---------- القائمة العلوية ---------- */
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  mainNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "فتح القائمة");
}

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
});

// إغلاق القائمة عند اختيار رابط (في الجوال)
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeMenu(); closeModal(); }
});

// ظل الشريط وزر العودة للأعلى عند التمرير
const backToTop = document.getElementById("backToTop");
function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
  backToTop.classList.toggle("is-visible", window.scrollY > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// تمييز رابط القسم الظاهر حاليًا
const navLinks = document.querySelectorAll(".nav-link");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) =>
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id)
      );
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- النافذة المنبثقة ---------- */
const modal = document.getElementById("modal");
let lastFocused = null;

function openModal(title, text) {
  lastFocused = document.activeElement;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalText").textContent = text;
  modal.hidden = false;
  modal.querySelector(".modal-box .btn").focus();
}
function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  if (lastFocused) lastFocused.focus();
}
modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));

/* ---------- هيكل المجلس ---------- */
(function renderStructure() {
  const leadership = typeof LEADERSHIP !== "undefined" && Array.isArray(LEADERSHIP) ? LEADERSHIP : [];
  const org = document.querySelector(".org");

  // بطاقة كبيرة لكل من الرئيس والأمين وأعضاء القيادات
  function topCard(person, label, extraClass) {
    if (!person) return "";
    return `
      <article class="org-card ${extraClass}">
        ${portraitHTML({
          photo: person.photo,
          name: escapeHTML(person.name || ""),
          title: escapeHTML(person.position || ""),
          label
        })}
      </article>`;
  }

  document.getElementById("orgChair").innerHTML =
    topCard(leadership.find((p) => p.group === "chair"), "رئيس المجلس", "org-top");
  document.getElementById("orgSecretary").innerHTML =
    topCard(leadership.find((p) => p.group === "secretary"), "أمين المجلس", "org-mid");

  document.getElementById("orgLeaders").innerHTML = leadership
    .filter((p) => p.group === "leader")
    .map((p) => topCard(p, "", ""))
    .join("");

  handleBrokenPhotos(org);
})();

/* ---------- أعضاء المجلس ---------- */
const membersGrid = document.getElementById("membersGrid");
const membersEmpty = document.getElementById("membersEmpty");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("memberSearch");
const categoryFilter = document.getElementById("categoryFilter");
const contactCollege = document.getElementById("contactCollege");

const categories = typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES) ? CATEGORIES : [];
const members = typeof MEMBERS !== "undefined" && Array.isArray(MEMBERS) ? MEMBERS : [];
const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

// قائمة الفئات في قسم الأعضاء
categories.forEach((cat) => categoryFilter.add(new Option(cat.name, cat.id)));

// قائمة «من يمثّلني؟»: الكليات مجمّعة حسب الفئة
categories.forEach((cat) => {
  const group = document.createElement("optgroup");
  group.label = cat.name;
  (cat.colleges || []).forEach((college) => group.appendChild(new Option(college, cat.id)));
  contactCollege.appendChild(group);
});

// نص البحث لكل عضو: الاسم والصفة والكلية واسم الفئة وكلياتها
function searchableText(member) {
  const cat = categoryById[member.category] || {};
  return normalizeArabic([member.name, member.role, member.college, cat.name, ...(cat.colleges || [])].join(" "));
}

function memberCardHTML(member) {
  const cat = categoryById[member.category] || {};
  const hasName = Boolean(member.name && member.name.trim());
  const name = hasName ? escapeHTML(member.name) : "";
  const label = name || escapeHTML(member.role);
  const phone = normalizePhone(member.phone);
  const whatsapp = normalizePhone(member.whatsapp);
  const email = isEmail(member.email) ? member.email : "";

  const buttons = [];
  if (phone) {
    buttons.push(`<a class="contact-btn" href="tel:+${phone}" aria-label="اتصال بـ ${label}">${icons.phone}اتصال</a>`);
  }
  if (whatsapp) {
    buttons.push(`<a class="contact-btn whatsapp" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="مراسلة ${label} عبر واتساب">${icons.whatsapp}واتساب</a>`);
  }
  if (email) {
    buttons.push(`<a class="contact-btn" href="mailto:${escapeHTML(email)}" aria-label="مراسلة ${label} بالبريد">${icons.email}بريد</a>`);
  }

  const contact = buttons.length
    ? buttons.join("")
    : `<p class="no-contact">وسيلة التواصل غير متاحة حاليًا</p>`;

  return `
    <article class="member-card">
      ${portraitHTML({
        photo: member.photo,
        name: hasName ? name : "يُعلن قريبًا",
        title: escapeHTML(member.role || ""),
        subtitle: escapeHTML(member.college || (member.role ? "" : cat.name || "")),
        pending: !hasName
      })}
      <div class="member-contact">${contact}</div>
    </article>`;
}


function renderMembers() {
  const query = normalizeArabic(searchInput.value);
  const category = categoryFilter.value;

  const filtered = members.filter((m) => {
    const matchesText = !query || searchableText(m).includes(query);
    const matchesCategory = !category || m.category === category;
    return matchesText && matchesCategory;
  });

  membersGrid.innerHTML = filtered.map(memberCardHTML).join("");

  handleBrokenPhotos(membersGrid);

  membersEmpty.hidden = filtered.length > 0;
  resultsCount.textContent = members.length
    ? `عدد النتائج: ${filtered.length} من ${members.length}`
    : "لم تُضف بيانات الأعضاء بعد.";
}

searchInput.addEventListener("input", renderMembers);
categoryFilter.addEventListener("change", renderMembers);
document.getElementById("resetFilters").addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";
  renderMembers();
  searchInput.focus();
});

// «من يمثّلني؟»: عرض ممثلي فئة الكلية المختارة في قسم الأعضاء
document.getElementById("showCollegeMembers").addEventListener("click", () => {
  const hint = document.getElementById("contactHint");
  const categoryId = contactCollege.value;
  if (!categoryId) {
    hint.textContent = "الرجاء اختيار كليتك أو فئتك أولًا.";
    contactCollege.focus();
    return;
  }
  const cat = categoryById[categoryId];
  hint.textContent = `يمثّلك في المجلس ممثلو فئة «${cat.name}».`;
  searchInput.value = "";
  categoryFilter.value = categoryId;
  renderMembers();
  document.getElementById("members").scrollIntoView({ behavior: "smooth" });
});

renderMembers();

/* ---------- الاستبيانات ---------- */
const surveysGrid = document.getElementById("surveysGrid");
const surveysEmpty = document.getElementById("surveysEmpty");
const surveys = typeof SURVEYS !== "undefined" && Array.isArray(SURVEYS) ? SURVEYS : [];
let surveyFilter = "all";

function surveyCardHTML(survey, index) {
  const isOpen = getSurveyStatus(survey) === "open";
  const deadline = survey.deadline ? formatDate(survey.deadline) : "";

  const button = isOpen
    ? `<button type="button" class="btn btn-primary btn-block" data-survey="${index}">شارك في الاستبيان</button>`
    : `<button type="button" class="btn btn-block" disabled>الاستبيان مغلق</button>`;

  return `
    <article class="survey-card ${isOpen ? "" : "is-closed"}">
      <div class="survey-top">
        <span class="status ${isOpen ? "status-open" : "status-closed"}">${isOpen ? "مفتوح" : "مغلق"}</span>
      </div>
      <h3>${escapeHTML(survey.title)}</h3>
      <p>${escapeHTML(survey.description)}</p>
      <ul class="survey-meta">
        ${survey.audience ? `<li><strong>الفئة المستهدفة:</strong> ${escapeHTML(survey.audience)}</li>` : ""}
        ${deadline ? `<li><strong>آخر موعد:</strong> ${escapeHTML(deadline)}</li>` : ""}
      </ul>
      ${button}
    </article>`;
}

function renderSurveys() {
  const items = surveys
    .map((survey, index) => ({ survey, index }))
    .filter(({ survey }) => surveyFilter === "all" || getSurveyStatus(survey) === surveyFilter)
    // المفتوحة أولًا
    .sort((a, b) => (getSurveyStatus(a.survey) === "open" ? -1 : 0) - (getSurveyStatus(b.survey) === "open" ? -1 : 0));

  surveysGrid.innerHTML = items.map(({ survey, index }) => surveyCardHTML(survey, index)).join("");
  surveysEmpty.hidden = items.length > 0;
}

// عند الضغط على «شارك في الاستبيان»
surveysGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-survey]");
  if (!btn) return;
  const survey = surveys[Number(btn.dataset.survey)];
  const url = survey && safeURL(survey.url);

  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    openModal("الاستبيان غير متاح حاليًا", "لم يُضَف رابط هذا الاستبيان بعد. يُرجى المحاولة لاحقًا أو متابعة إعلانات المجلس.");
  }
});

document.querySelectorAll(".survey-tabs .tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    surveyFilter = tab.dataset.status;
    document.querySelectorAll(".survey-tabs .tab").forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-pressed", String(active));
    });
    renderSurveys();
  });
});

renderSurveys();

/* ---------- وسائل التواصل الرسمية في التذييل ---------- */
(function renderOfficialContacts() {
  const list = document.getElementById("officialContacts");
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

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- الحركة عند التمرير ---------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
