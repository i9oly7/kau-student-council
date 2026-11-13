/* =========================================================
   script.js — تفاعلات الصفحة الرئيسية: الهيكل، عرض الأعضاء،
   البحث والتصفية، «من يمثّلني؟»، والاستبيانات.
   يعتمد على data.js و common.js — لا تحتاج لتعديل هذا الملف.
   ========================================================= */

/* ---------- أدوات خاصة بالصفحة الرئيسية ---------- */

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

// بطاقة قابلة للضغط إذا كان للشخص ملف شخصي، وإلا بطاقة عادية
function cardWrapper(person, className, inner, ariaName) {
  const url = profileURL(person);
  return url
    ? `<a class="${className} is-link" href="${escapeHTML(url)}" aria-label="عرض الملف الشخصي: ${ariaName}">${inner}</a>`
    : `<article class="${className}">${inner}</article>`;
}

// تمييز رابط القسم الظاهر حاليًا في القائمة العلوية
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
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ---------- هيكل المجلس ---------- */
(function renderStructure() {
  const org = document.querySelector(".org");

  // بطاقة كبيرة لكل من الرئيس والأمين وأعضاء القيادات
  function topCard(person, label, extraClass) {
    if (!person) return "";
    const name = escapeHTML(person.name || "");
    const position = escapeHTML(person.position || "");
    const inner = portraitHTML({
      photo: person.photo,
      avatar: person.avatar,
      name,
      title: position,
      label,
      cta: Boolean(person.id)
    });
    return cardWrapper(person, `org-card ${extraClass}`, inner, name || position);
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
  const hasName = Boolean(member.name && member.name.trim());
  const name = hasName ? escapeHTML(member.name) : "";
  const inner = portraitHTML({
    photo: member.photo,
    avatar: member.avatar,
    name: hasName ? name : "يُعلن قريبًا",
    title: escapeHTML(member.role || ""),
    subtitle: escapeHTML(member.college || ""),
    pending: !hasName,
    cta: hasName && Boolean(member.id)
  });
  // لا نفتح ملفًا شخصيًا لمقعد لم يُعلن اسمه بعد
  return cardWrapper(hasName ? member : null, "member-card", inner, name);
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

// إذا فُتحت الصفحة برابط مثل index.html#members نضبط التمرير بعد رسم البطاقات
if (location.hash) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
}