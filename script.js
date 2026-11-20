/* =========================================================
   script.js — تفاعلات الصفحة الرئيسية:
   المؤشرات، هيكل المجلس، أداة «من يمثّلني؟»، دليل الممثلين،
   والاستطلاعات.
   يعتمد على data.js و common.js — لا تحتاج لتعديل هذا الملف.
   ========================================================= */

/* ---------- أدوات خاصة بالصفحة الرئيسية ---------- */

// توحيد الحروف العربية لتحسين البحث (أ/إ/آ → ا، ة → ه، ى → ي، وإزالة التشكيل)
function normalizeArabic(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
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

/* الحالة الفعلية للاستطلاع:
   "soon"   — لم يُفتح بعد (status: "soon" أو تاريخ بدء لم يحن)
   "open"   — مفتوح
   "closed" — منتهٍ (status: "closed" أو تجاوز الموعد النهائي) */
function getSurveyStatus(survey) {
  if (survey.status === "soon") return "soon";
  if (survey.status !== "open") return "closed";
  if (survey.start) {
    const begin = new Date(survey.start + "T00:00:00");
    if (!isNaN(begin) && begin > new Date()) return "soon";
  }
  if (survey.deadline) {
    const end = new Date(survey.deadline + "T23:59:59");
    if (!isNaN(end) && end < new Date()) return "closed";
  }
  return "open";
}

const STATUS_LABEL = { open: "مفتوح", soon: "قريبًا", closed: "منتهٍ" };

// الممثلون الذين أُعلنت أسماؤهم
const namedMembers = members.filter((m) => m.name && m.name.trim());

// صورة دائرية صغيرة لشخص (الهيكل والدليل والنافذة)
function avatarHTML(person) {
  const src = safeImagePath(person.photo);
  return `<span class="avatar${person.avatar === "hijab" ? " is-hijab" : ""}">
      <span class="avatar-fallback" aria-hidden="true">${fallbackIcon(person.avatar)}</span>
      ${src ? `<img src="${escapeHTML(src)}" alt="" loading="lazy">` : ""}
    </span>`;
}

/* ---------- تمييز القسم الظاهر حاليًا ---------- */
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

/* ---------- النوافذ المنبثقة ---------- */
const modal = document.getElementById("modal");
const contactModal = document.getElementById("contactModal");
let lastFocused = null;

function openModal(title, text) {
  lastFocused = document.activeElement;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalText").textContent = text;
  modal.hidden = false;
  modal.querySelector(".modal-box .btn").focus();
}

function closeAnyModal() {
  [modal, contactModal].forEach((m) => { if (m && !m.hidden) m.hidden = true; });
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".modal [data-close]").forEach((el) =>
  el.addEventListener("click", closeAnyModal)
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAnyModal();
});

/* ---------- مؤشرات الواجهة الافتتاحية ---------- */
(function renderHeroStats() {
  const list = document.getElementById("heroStats");
  if (!list) return;
  const stats = [
    [leadership.length, "قيادات جامعية"],
    [categories.length, "فئات تمثيل"],
    [members.length, "ممثلًا وممثلة"]
  ];
  list.innerHTML = stats
    .map(([num, label]) => `<li><strong>${num}</strong><span>${label}</span></li>`)
    .join("");
})();

/* ---------- هيكل المجلس: ثلاثة مستويات ---------- */
(function renderStructure() {
  // بطاقة مختصرة: صورة واسم ومنصب فقط — بلا صفحة تفصيلية
  function personHTML(person) {
    return `
      <article class="person">
        ${avatarHTML(person)}
        <h4>${escapeHTML(person.name || "")}</h4>
        <p>${escapeHTML(person.position || person.role || "")}</p>
      </article>`;
  }

  const chairs = leadership.filter((p) => p.group === "chair" || p.group === "secretary");
  const leaders = leadership.filter((p) => p.group === "leader");

  document.getElementById("levelChair").innerHTML = chairs.map(personHTML).join("");
  document.getElementById("levelLeaders").innerHTML = leaders.map(personHTML).join("");

  // المستوى الثالث: ملخّص يحيل إلى الدليل بدل تكرار البطاقات
  document.getElementById("levelStudents").innerHTML = `
    <p><strong>${members.length}</strong> ممثلًا وممثلة عن <strong>${categories.length}</strong> فئات تمثيل:
    ممثل وممثلة لكل من الكليات الصحية والهندسية والحاسوبية والعلمية والأدبية وفرع رابغ والدراسات العليا،
    وممثل للطلبة الدوليين، وممثل للطلبة ذوي الإعاقة.</p>
    <a href="#directory" class="btn btn-primary btn-sm">عرض دليل الممثلين</a>`;

  document.querySelectorAll(".levels .avatar").forEach((a) => {
    const img = a.querySelector("img");
    if (img) img.addEventListener("error", () => img.remove(), { once: true });
  });
})();

/* ---------- أداة «من يمثّلني؟» ---------- */
const collegeInput = document.getElementById("collegeInput");
const collegeOptions = document.getElementById("collegeOptions");
const collegeClear = document.getElementById("collegeClear");
const finderHint = document.getElementById("finderHint");
const finderResults = document.getElementById("finderResults");

// كل الكليات مع فئتها، من CATEGORIES في data.js
const collegeIndex = categories.flatMap((cat) =>
  (cat.colleges || []).map((college) => ({
    college,
    categoryId: cat.id,
    key: normalizeArabic(college + " " + cat.name)
  }))
);

function repsOf(categoryId) {
  return namedMembers.filter((m) => m.category === categoryId);
}

// هل للعضو وسيلة تواصل منشورة؟
function hasContact(member) {
  return Boolean(isEmail(member.email) || normalizePhone(member.whatsapp) || normalizePhone(member.phone));
}

// الصفة المختصرة كما تظهر تحت الاسم
function shortRole(member) {
  return String(member.role || "").startsWith("ممثلة") ? "ممثلة" : "ممثل";
}

// شبكة الممثلين: صورة دائرية واسم وصفة مختصرة، والضغط يفتح نافذة التواصل
function repGridHTML(reps) {
  return `<div class="rep-grid">${reps.map((member) => {
    const able = hasContact(member);
    return `
      <${able ? "button type=\"button\"" : "div"} class="rep-person${able ? "" : " is-plain"}"
        ${able ? `data-contact="${escapeHTML(member.id)}"` : ""}>
        ${avatarHTML(member)}
        <h4>${escapeHTML(member.name)}</h4>
        <p>${shortRole(member)}</p>
      </${able ? "button" : "div"}>`;
  }).join("")}</div>`;
}

// رأس المجموعة: اسم الفئة يمينًا وزر «تواصل» يسارًا
function groupHeadHTML(cat, reps) {
  const able = reps.some(hasContact);
  return `
    <div class="dir-head">
      <h3 class="dir-title">${escapeHTML(cat.name)}</h3>
      ${able ? `<button type="button" class="dir-contact" data-group="${escapeHTML(cat.id)}">
        ${icons.email}<span>تواصل</span></button>` : ""}
    </div>`;
}

function bindBrokenAvatars(root) {
  root.querySelectorAll(".avatar img").forEach((img) =>
    img.addEventListener("error", () => img.remove(), { once: true })
  );
}

function showReps(categoryId, collegeName) {
  const cat = categoryById[categoryId];
  const reps = repsOf(categoryId);
  if (!cat) return;

  finderResults.innerHTML = `
    <div class="finder-card">
      <p class="finder-for"><strong>${escapeHTML(collegeName)}</strong> ضمن <strong>${escapeHTML(cat.name)}</strong></p>
      ${reps.length
        ? repGridHTML(reps)
        : `<p class="muted">لم تُعلن أسماء ممثلي هذه الفئة بعد.</p>`}
    </div>`;

  bindBrokenAvatars(finderResults);
}

function hideOptions() {
  collegeOptions.hidden = true;
  collegeOptions.innerHTML = "";
  collegeInput.setAttribute("aria-expanded", "false");
}

function renderOptions() {
  const query = normalizeArabic(collegeInput.value);
  collegeClear.hidden = !collegeInput.value;

  if (query.length < 2) {
    hideOptions();
    finderHint.textContent = "اكتب أول حرفين من اسم كليتك لتظهر لك الخيارات.";
    return;
  }

  const matches = collegeIndex.filter((c) => c.key.includes(query)).slice(0, 8);
  if (!matches.length) {
    hideOptions();
    finderHint.textContent = "لا توجد كلية بهذا الاسم. جرّب كلمة أقصر، مثل «طب» أو «هندسة».";
    return;
  }

  finderHint.textContent = "اختر كليتك من القائمة.";
  collegeOptions.innerHTML = matches
    .map((c) => `<li role="option" tabindex="0" data-cat="${escapeHTML(c.categoryId)}"
      data-college="${escapeHTML(c.college)}">${escapeHTML(c.college)}</li>`)
    .join("");
  collegeOptions.hidden = false;
  collegeInput.setAttribute("aria-expanded", "true");
}

function pickOption(li) {
  collegeInput.value = li.dataset.college;
  collegeClear.hidden = false;
  hideOptions();
  finderHint.textContent = "";
  showReps(li.dataset.cat, li.dataset.college);
}

if (collegeInput) {
  collegeInput.addEventListener("input", renderOptions);
  collegeInput.addEventListener("focus", renderOptions);

  collegeOptions.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-cat]");
    if (li) pickOption(li);
  });
  collegeOptions.addEventListener("keydown", (e) => {
    const li = e.target.closest("li[data-cat]");
    if (li && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pickOption(li); }
  });

  // Enter في حقل البحث يختار أول نتيجة
  collegeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = collegeOptions.querySelector("li[data-cat]");
      if (first) pickOption(first);
    } else if (e.key === "ArrowDown") {
      const first = collegeOptions.querySelector("li[data-cat]");
      if (first) { e.preventDefault(); first.focus(); }
    }
  });

  collegeClear.addEventListener("click", () => {
    collegeInput.value = "";
    collegeClear.hidden = true;
    finderResults.innerHTML = "";
    hideOptions();
    finderHint.textContent = "اكتب أول حرفين من اسم كليتك لتظهر لك الخيارات.";
    collegeInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".finder")) hideOptions();
  });
}

/* ---------- نافذة مراسلة الممثل ---------- */
const cmCopied = document.getElementById("cmCopied");
let cmEmailValue = "";

function openContact(memberId) {
  const member = namedMembers.find((m) => m.id === memberId);
  if (!member) return;

  lastFocused = document.activeElement;
  cmEmailValue = isEmail(member.email) ? member.email : "";

  document.getElementById("cmAvatar").innerHTML = avatarHTML(member);
  document.getElementById("cmName").textContent = member.name;
  document.getElementById("cmRole").textContent = member.role || "";

  const emailRow = document.querySelector(".cm-email-row");
  document.getElementById("cmEmail").textContent = cmEmailValue || "—";
  emailRow.hidden = !cmEmailValue;
  cmCopied.textContent = "";

  const actions = [];
  if (cmEmailValue) {
    actions.push(`<a class="btn btn-primary btn-block" href="mailto:${escapeHTML(cmEmailValue)}">${icons.email} فتح البريد</a>`);
  }
  const whatsapp = normalizePhone(member.whatsapp);
  if (whatsapp) {
    actions.push(`<a class="btn btn-outline btn-block" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener noreferrer">${icons.whatsapp} واتساب</a>`);
  }
  const phone = normalizePhone(member.phone);
  if (phone) {
    actions.push(`<a class="btn btn-outline btn-block" href="tel:+${phone}">${icons.phone} اتصال</a>`);
  }
  document.getElementById("cmActions").innerHTML = actions.join("");

  contactModal.hidden = false;
  contactModal.querySelector(".modal-x").focus();
}

document.getElementById("cmCopy").addEventListener("click", async () => {
  if (!cmEmailValue) return;
  try {
    await navigator.clipboard.writeText(cmEmailValue);
    cmCopied.textContent = "تم نسخ البريد ✓";
  } catch {
    // متصفحات قديمة أو سياق غير آمن: ننسخ بالطريقة التقليدية
    const area = document.createElement("textarea");
    area.value = cmEmailValue;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    document.body.removeChild(area);
    cmCopied.textContent = ok ? "تم نسخ البريد ✓" : "تعذّر النسخ — انسخ البريد يدويًا.";
  }
});

// زر «تواصل» على مستوى الفئة: يفتح الممثل مباشرة إن كان واحدًا،
// وإلا يعرض اختيارًا بين ممثلي الفئة.
function openGroupContact(categoryId) {
  const cat = categoryById[categoryId];
  const reps = repsOf(categoryId).filter(hasContact);
  if (!cat || !reps.length) return;
  if (reps.length === 1) return openContact(reps[0].id);

  lastFocused = document.activeElement;
  cmEmailValue = "";

  document.getElementById("cmAvatar").innerHTML = "";
  document.getElementById("cmName").textContent = cat.name;
  document.getElementById("cmRole").textContent = "اختر الممثل الذي تود مراسلته";
  document.querySelector(".cm-email-row").hidden = true;
  cmCopied.textContent = "";

  document.getElementById("cmActions").innerHTML = reps
    .map((m) => `<button type="button" class="btn btn-outline btn-block" data-contact="${escapeHTML(m.id)}">
      ${escapeHTML(m.name)} — ${shortRole(m)}</button>`)
    .join("");

  contactModal.hidden = false;
  contactModal.querySelector(".modal-x").focus();
}

// أزرار التواصل في نتائج الأداة وفي الدليل
document.addEventListener("click", (e) => {
  const person = e.target.closest("[data-contact]");
  if (person) return openContact(person.dataset.contact);
  const group = e.target.closest("[data-group]");
  if (group) openGroupContact(group.dataset.group);
});

/* ---------- دليل الممثلين ---------- */
(function renderDirectory() {
  const root = document.getElementById("directoryList");
  if (!root) return;

  const groups = categories
    .map((cat) => ({ cat, reps: repsOf(cat.id) }))
    .filter((g) => g.reps.length);

  root.innerHTML = groups.map(({ cat, reps }) => `
    <section class="dir-group">
      ${groupHeadHTML(cat, reps)}
      ${repGridHTML(reps)}
    </section>`).join("");

  bindBrokenAvatars(root);

  const pill = document.getElementById("directoryCount");
  if (pill) pill.textContent = `${namedMembers.length} ممثلًا`;
})();

/* ---------- الاستطلاعات ---------- */
const surveyStrip = document.getElementById("surveyStrip");
const surveyPanel = document.getElementById("surveyPanel");
const surveysEmpty = document.getElementById("surveysEmpty");
const surveys = typeof SURVEYS !== "undefined" && Array.isArray(SURVEYS) ? SURVEYS : [];

// المفتوحة أولًا ثم القادمة ثم المنتهية
const statusOrder = { open: 0, soon: 1, closed: 2 };
const orderedSurveys = surveys
  .map((survey, index) => ({ survey, index }))
  .sort((a, b) => statusOrder[getSurveyStatus(a.survey)] - statusOrder[getSurveyStatus(b.survey)]);

let activeSurvey = 0;

function renderSurveyPanel() {
  const entry = orderedSurveys[activeSurvey];
  if (!entry) { surveyPanel.innerHTML = ""; return; }

  const { survey, index } = entry;
  const status = getSurveyStatus(survey);
  const deadline = survey.deadline ? formatDate(survey.deadline) : "";

  let action;
  if (status === "open") {
    action = `<button type="button" class="btn btn-primary btn-block" data-survey="${index}">شارك في الاستطلاع</button>`;
  } else if (status === "soon") {
    action = `<button type="button" class="btn btn-block" disabled>يُفتح قريبًا</button>`;
  } else {
    action = `<button type="button" class="btn btn-block" disabled>انتهى الاستطلاع</button>`;
  }

  surveyPanel.innerHTML = `
    <article class="survey-card is-${status}">
      <div class="survey-top">
        <span class="status status-${status}">${STATUS_LABEL[status]}</span>
      </div>
      <h3>${escapeHTML(survey.title)}</h3>
      <p>${escapeHTML(survey.description || "")}</p>
      <ul class="survey-meta">
        ${survey.audience ? `<li><strong>الفئة المستهدفة:</strong> ${escapeHTML(survey.audience)}</li>` : ""}
        ${deadline ? `<li><strong>آخر موعد:</strong> ${escapeHTML(deadline)}</li>` : ""}
      </ul>
      ${action}
    </article>`;
}

function renderSurveys() {
  if (!orderedSurveys.length) {
    surveysEmpty.hidden = false;
    surveyStrip.innerHTML = "";
    surveyPanel.innerHTML = "";
    return;
  }
  surveysEmpty.hidden = true;

  surveyStrip.innerHTML = orderedSurveys.map(({ survey }, i) => {
    const status = getSurveyStatus(survey);
    return `<button type="button" role="tab" class="survey-tab${i === activeSurvey ? " is-active" : ""}"
        aria-selected="${i === activeSurvey}" data-tab="${i}">
        <span class="survey-tab-title">${escapeHTML(survey.title)}</span>
        <span class="status status-${status}">${STATUS_LABEL[status]}</span>
      </button>`;
  }).join("");

  renderSurveyPanel();
}

surveyStrip.addEventListener("click", (e) => {
  const tab = e.target.closest("[data-tab]");
  if (!tab) return;
  activeSurvey = Number(tab.dataset.tab);
  renderSurveys();
});

surveyPanel.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-survey]");
  if (!btn) return;
  const survey = surveys[Number(btn.dataset.survey)];
  const url = survey && safeURL(survey.url);

  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    openModal("الاستطلاع غير متاح حاليًا", "لم يُضَف رابط هذا الاستطلاع بعد. يُرجى المحاولة لاحقًا أو متابعة إعلانات المجلس.");
  }
});

renderSurveys();

// إذا فُتحت الصفحة برابط مثل index.html#represent نضبط التمرير بعد رسم المحتوى
if (location.hash) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
}
