/* =========================================================
   profile.js — صفحة الملف الشخصي (profile.html)
   تعرض بيانات شخص واحد حسب الرابط، مثال: profile.html?id=ziyad
   يعتمد على data.js و common.js — لا تحتاج لتعديل هذا الملف.
   ========================================================= */

(function renderProfile() {
  const root = document.getElementById("profile");
  const id = new URLSearchParams(location.search).get("id") || "";

  // ترتيب الأشخاص: القيادات ثم الممثلون، ولكل فئة تنقّل خاص بها
  const groupLabels = { chair: "رئيس المجلس", secretary: "أمين المجلس", leader: "عضو من قيادات الجامعة" };
  const leaderList = leadership.filter((p) => p.id);
  const memberList = members.filter((m) => m.id && m.name && m.name.trim());

  let person = leaderList.find((p) => p.id === id);
  let isLeader = Boolean(person);
  if (!person) person = memberList.find((m) => m.id === id);

  if (!person) {
    document.title = "الصفحة غير موجودة | المجلس الاستشاري الطلابي";
    root.innerHTML = `
      <div class="profile-missing reveal">
        <h1>لم نجد هذا الملف الشخصي</h1>
        <p class="muted">قد يكون الرابط غير صحيح أو تم تحديث بيانات العضو.</p>
        <a href="index.html#members" class="btn btn-primary">عرض كل الأعضاء</a>
      </div>`;
    observeReveal(root);
    return;
  }

  const list = isLeader ? leaderList : memberList;
  const index = list.indexOf(person);
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const backURL = isLeader ? "index.html#structure" : "index.html#members";
  const backLabel = isLeader ? "هيكل المجلس" : "كل الأعضاء";

  const name = escapeHTML(person.name || person.position || "");
  const title = escapeHTML(isLeader ? person.position : person.role);
  const isFemale = !isLeader && String(person.role || "").startsWith("ممثلة");
  const badge = isLeader ? groupLabels[person.group] || "" : (isFemale ? "ممثلة الطلبة في المجلس" : "ممثل الطلبة في المجلس");
  document.title = `${person.name || person.position} | المجلس الاستشاري الطلابي`;

  // النبذة: للقيادات فقط — الممثلون من الطلاب بلا خانة نبذة
  // نحافظ على الأسطر الجديدة إن وُجدت
  const bioText = isLeader && person.bio && person.bio.trim()
    ? `<p class="profile-bio">${escapeHTML(person.bio).replace(/\n/g, "<br>")}</p>`
    : isLeader
      ? `<p class="muted">سيُضاف التعريف قريبًا.</p>`
      : "";
  const bioSection = isLeader
    ? `<section class="profile-block">
          <h2>نبذة</h2>
          ${bioText}
        </section>`
    : "";

  // الكليات التي يمثّلها (للممثلين فقط)
  let represents = "";
  if (!isLeader) {
    const cat = categoryById[person.category];
    if (cat) {
      represents = `
        <section class="profile-block">
          <h2>يمثّل طلاب</h2>
          <p class="profile-cat">${escapeHTML(cat.name)}</p>
          <ul class="chip-list">
            ${(cat.colleges || []).map((c) => `<li>${escapeHTML(c)}</li>`).join("")}
          </ul>
        </section>`;
    }
  }

  // وسائل التواصل: لا يظهر إلا ما له قيمة صحيحة
  const buttons = [];
  const phone = normalizePhone(person.phone);
  const whatsapp = normalizePhone(person.whatsapp);
  if (phone) buttons.push(`<a class="contact-btn" href="tel:+${phone}">${icons.phone}اتصال</a>`);
  if (whatsapp) buttons.push(`<a class="contact-btn whatsapp" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener noreferrer">${icons.whatsapp}واتساب</a>`);
  if (isEmail(person.email)) buttons.push(`<a class="contact-btn" href="mailto:${escapeHTML(person.email)}">${icons.email}البريد</a>`);
  [["x", "منصة X", icons.x], ["linkedin", "LinkedIn", icons.linkedin], ["website", "الصفحة الرسمية", icons.link]].forEach(([key, label, icon]) => {
    const url = safeURL(person[key]);
    if (url) buttons.push(`<a class="contact-btn" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${icon}${label}</a>`);
  });
  const contact = buttons.length
    ? `<div class="profile-contact">${buttons.join("")}</div>`
    : `<p class="muted">وسائل التواصل غير متاحة حاليًا. يمكنك التواصل مع أمانة المجلس عبر القنوات الرسمية أسفل الصفحة.</p>`;

  const navCard = (p, dir) => `
    <a class="profile-nav-link" href="${escapeHTML(profileURL(p))}">
      <span class="muted small">${dir}</span>
      <strong>${escapeHTML(p.name || p.position)}</strong>
    </a>`;

  root.innerHTML = `
    <nav class="breadcrumb reveal" aria-label="مسار التنقل">
      <a href="index.html">الرئيسية</a>
      <span aria-hidden="true">/</span>
      <a href="${backURL}">${backLabel}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${name}</span>
    </nav>

    <div class="profile-layout">
      <div class="profile-photo reveal">
        ${portraitHTML({ photo: person.photo, avatar: person.avatar, name, bare: true })}
      </div>

      <div class="profile-body reveal">
        <span class="eyebrow">${escapeHTML(badge)}</span>
        <h1>${name}</h1>
        <p class="profile-title">${title}</p>
        ${!isLeader && person.college ? `<p class="muted">${escapeHTML(person.college)}</p>` : ""}

        ${bioSection}

        ${represents}

        <section class="profile-block">
          <h2>التواصل</h2>
          ${contact}
        </section>

        <div class="profile-actions">
          <a href="index.html#surveys" class="btn btn-primary">شارك مقترحك</a>
          <a href="${backURL}" class="btn btn-outline">العودة إلى ${backLabel}</a>
        </div>
      </div>
    </div>

    ${list.length > 1 ? `
      <div class="profile-nav reveal">
        ${navCard(prev, "→ السابق")}
        ${navCard(next, "التالي ←")}
      </div>` : ""}
  `;

  handleBrokenPhotos(root);
  observeReveal(root);
})();