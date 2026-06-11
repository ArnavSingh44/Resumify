const isProduction = process.env.NODE_ENV === 'production';
const puppeteer = isProduction ? require('puppeteer-core') : require('puppeteer');

// Convert hex color to rgba
const hexToRgba = (hex, alpha) => {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return `rgba(37, 99, 235, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const generatePdfUtil = async (resumeData) => {
  const template = resumeData.template || 'modern';
  const themeColor = resumeData.themeColor || '#2563eb';
  const fontFamily = resumeData.fontFamily || 'sans';
  const d = resumeData;

  const fontMap = {
    sans: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    serif: "'Georgia', 'Times New Roman', serif",
    mono: "'Courier New', Courier, monospace",
  };
  const fontStack = fontMap[fontFamily] || fontMap.sans;
  const themeLight = hexToRgba(themeColor, 0.08);
  const themeMid = hexToRgba(themeColor, 0.25);

  const sectionOrder = d.sectionOrder || ['summary', 'experience', 'skills', 'projects', 'education'];

  // ─────────────────────────────────────────────────────────────────
  // MODERN TEMPLATE  (mirrors ModernTemplate in ResumePreview.jsx)
  // ─────────────────────────────────────────────────────────────────
  const modernStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fontStack};
      color: #1f2937;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { padding: 20mm; min-height: 297mm; background: white; }
    header {
      margin-bottom: 2rem;
      border-bottom: 4px solid ${themeColor};
      padding-bottom: 1rem;
    }
    h1 {
      font-size: 3rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.05em;
      color: #111827;
      line-height: 1;
    }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      column-gap: 1rem;
      row-gap: 0.25rem;
      margin-top: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
    }
    .section { margin-bottom: 1.5rem; }
    .section-title {
      font-size: 1.125rem;
      font-weight: 700;
      text-transform: uppercase;
      border-bottom: 2px solid ${themeColor};
      margin-bottom: 0.625rem;
      padding-bottom: 2px;
      letter-spacing: 0.025em;
      color: #111827;
    }
    .space-y > * + * { margin-top: 1rem; }
    .space-y-sm > * + * { margin-top: 0.75rem; }
    .row-between { display: flex; justify-content: space-between; align-items: baseline; }
    .item-title { font-weight: 700; color: #111827; font-size: 0.9375rem; }
    .date-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      white-space: nowrap;
      margin-left: 1rem;
      flex-shrink: 0;
    }
    .desc-italic {
      font-size: 0.875rem;
      margin-top: 0.25rem;
      color: #374151;
      line-height: 1.625;
      font-style: italic;
    }
    .body-text { font-size: 0.875rem; line-height: 1.625; color: #374151; }
    .body-text-sm { font-size: 0.875rem; color: #374151; line-height: 1.625; }
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2rem;
      row-gap: 0.5rem;
      font-size: 0.875rem;
      color: #374151;
    }
    .link-text { font-size: 0.75rem; font-weight: 700; color: ${themeColor}; margin-left: 1rem; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
    .tag {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 500;
      background-color: ${themeLight};
      color: ${themeColor};
    }
    .bold-dark { font-weight: 700; color: #111827; font-size: 0.9375rem; }
    .small-gray { font-size: 0.75rem; color: #6b7280; margin-left: 1rem; flex-shrink: 0; }
    .gpa-text { color: #6b7280; font-weight: normal; margin-left: 0.5rem; font-size: 0.875rem; }
  `;

  const modernSection = (id) => {
    switch (id) {
      case 'summary': return d.summary ? `
        <section class="section">
          <h2 class="section-title">Summary</h2>
          <p class="body-text">${d.summary}</p>
        </section>` : '';
      case 'experience': return d.experience?.length ? `
        <section class="section">
          <h2 class="section-title">Experience</h2>
          <div class="space-y">
            ${d.experience.map(exp => `
              <div>
                <div class="row-between">
                  <h3 class="item-title">${exp.role} at ${exp.company}</h3>
                  <span class="date-label">${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p class="desc-italic">${exp.description || ''}</p>
              </div>`).join('')}
          </div>
        </section>` : '';
      case 'skills': return d.skills?.length ? `
        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            ${d.skills.map(s => `<p><strong>${s.category}:</strong> ${(s.items || []).join(', ')}</p>`).join('')}
          </div>
        </section>` : '';
      case 'projects': return d.projects?.length ? `
        <section class="section">
          <h2 class="section-title">Projects</h2>
          <div class="space-y">
            ${d.projects.map(proj => `
              <div>
                <div class="row-between">
                  <h3 class="item-title">${proj.name}</h3>
                  ${proj.link ? `<span class="link-text">${proj.link}</span>` : ''}
                </div>
                <p class="body-text-sm">${proj.description || ''}</p>
                ${proj.tech?.length ? `<div class="tags">${proj.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
              </div>`).join('')}
          </div>
        </section>` : '';
      case 'education': return d.education?.length ? `
        <section class="section">
          <h2 class="section-title">Education</h2>
          <div class="space-y-sm">
            ${d.education.map(edu => `
              <div>
                <div class="row-between bold-dark">
                  <span>${edu.degree} in ${edu.field}${edu.gpa ? ` <span class="gpa-text">(GPA: ${edu.gpa})</span>` : ''}</span>
                  <span class="small-gray">${edu.year}</span>
                </div>
                <div class="body-text-sm">${edu.school}</div>
              </div>`).join('')}
          </div>
        </section>` : '';
      default: {
        const section = d[id];
        if (!section?.items?.length) return '';
        return `
          <section class="section">
            <h2 class="section-title">${section.title}</h2>
            <div class="space-y-sm">
              ${section.items.map(item => `
                <div class="row-between">
                  <span class="item-title">${item.title}</span>
                  <span class="small-gray">${item.detail}</span>
                </div>`).join('')}
            </div>
          </section>`;
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // CLASSIC TEMPLATE  (mirrors ClassicTemplate in ResumePreview.jsx)
  // ─────────────────────────────────────────────────────────────────
  const classicStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fontStack};
      color: #000;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { padding: 20mm; min-height: 297mm; background: white; }
    header {
      margin-bottom: 3rem;
      text-align: center;
      border-bottom: 1px solid ${themeMid};
      padding-bottom: 2rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    h1 {
      font-size: 3rem;
      font-weight: 400;
      letter-spacing: 0.1em;
      color: ${themeColor};
      margin-bottom: 1rem;
    }
    .contact-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      column-gap: 1.5rem;
      row-gap: 0.5rem;
      font-size: 0.75rem;
      font-style: italic;
      color: #6b7280;
    }
    .section { margin-bottom: 2rem; }
    .section-title {
      font-size: 1.125rem;
      font-weight: 700;
      text-transform: uppercase;
      text-align: center;
      border-bottom: 1px solid ${themeMid};
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      letter-spacing: 0.1em;
      color: ${themeColor};
    }
    .space-y > * + * { margin-top: 1.5rem; }
    .space-y-sm > * + * { margin-top: 1rem; }
    .row-between { display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; font-size: 0.875rem; }
    .company-name { color: #111827; }
    .date-label { color: #6b7280; text-transform: uppercase; font-size: 0.75rem; margin-left: 1rem; flex-shrink: 0; }
    .role-italic { font-style: italic; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .body-text { font-size: 0.875rem; color: #374151; line-height: 1.625; text-align: justify; }
    .item-title { font-weight: 700; font-size: 0.875rem; color: #111827; }
    .skill-cat { font-weight: 900; text-transform: uppercase; font-size: 0.75rem; opacity: 0.6; margin-right: 0.5rem; }
    .body-sm { font-size: 0.875rem; line-height: 1.5; }
    .tech-list { font-size: 10px; margin-top: 0.5rem; font-weight: 700; font-style: italic; text-transform: uppercase; letter-spacing: -0.025em; color: ${themeColor}; }
    .school-name { color: #111827; }
    .degree-text { font-style: italic; font-size: 0.875rem; }
    .small-gray { font-size: 0.75rem; color: #6b7280; margin-left: 1rem; flex-shrink: 0; }
  `;

  const classicSection = (id) => {
    switch (id) {
      case 'summary': return d.summary ? `
        <section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="body-text" style="padding: 0 2rem; font-style: italic;">${d.summary}</p>
        </section>` : '';
      case 'experience': return d.experience?.length ? `
        <section class="section">
          <h2 class="section-title">Experience</h2>
          <div class="space-y">
            ${d.experience.map(exp => `
              <div>
                <div class="row-between">
                  <span class="company-name">${exp.company}</span>
                  <span class="date-label">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div class="role-italic">${exp.role}</div>
                <p class="body-text">${exp.description || ''}</p>
              </div>`).join('')}
          </div>
        </section>` : '';
      case 'skills': return d.skills?.length ? `
        <section class="section">
          <h2 class="section-title">Expertise</h2>
          <div class="space-y-sm">
            ${d.skills.map(s => `<p class="body-sm"><strong class="skill-cat">${s.category}:</strong> ${(s.items || []).join(', ')}</p>`).join('')}
          </div>
        </section>` : '';
      case 'projects': return d.projects?.length ? `
        <section class="section">
          <h2 class="section-title">Public Projects</h2>
          <div class="space-y">
            ${d.projects.map(proj => `
              <div>
                <div class="item-title">${proj.name}</div>
                <p class="body-text">${proj.description || ''}</p>
                ${proj.tech?.length ? `<div class="tech-list">${proj.tech.join(' • ')}</div>` : ''}
              </div>`).join('')}
          </div>
        </section>` : '';
      case 'education': return d.education?.length ? `
        <section class="section">
          <h2 class="section-title">Academic Background</h2>
          <div class="space-y-sm">
            ${d.education.map(edu => `
              <div>
                <div class="row-between">
                  <span class="school-name">${edu.school}</span>
                  <span class="small-gray">${edu.year}</span>
                </div>
                <div class="degree-text">${edu.degree} in ${edu.field}${edu.gpa ? ` <span style="color:#9ca3af;">(GPA: ${edu.gpa})</span>` : ''}</div>
              </div>`).join('')}
          </div>
        </section>` : '';
      default: {
        const section = d[id];
        if (!section?.items?.length) return '';
        return `
          <section class="section">
            <h2 class="section-title">${section.title}</h2>
            <div class="space-y-sm">
              ${section.items.map(item => `
                <div class="row-between">
                  <span class="item-title">${item.title}</span>
                  <span class="small-gray">${item.detail}</span>
                </div>`).join('')}
            </div>
          </section>`;
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // MINIMALIST TEMPLATE  (mirrors MinimalistTemplate)
  // ─────────────────────────────────────────────────────────────────
  const minimalistStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fontStack};
      color: #111827;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { padding: 24mm; min-height: 297mm; background: white; }
    header { margin-bottom: 5rem; }
    h1 { font-size: 3.75rem; font-weight: 300; margin-bottom: 1rem; letter-spacing: -0.05em; color: ${themeColor}; line-height: 1; }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      column-gap: 2rem;
      row-gap: 0.5rem;
      font-size: 10px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }
    .section { margin-bottom: 3rem; }
    .section-title {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.4em;
      color: #9ca3af;
      margin-bottom: 1.5rem;
    }
    .work-item { display: grid; grid-template-columns: 1fr 3fr; gap: 1rem; margin-bottom: 3rem; }
    .work-date { font-size: 0.75rem; font-weight: 500; color: #9ca3af; text-transform: uppercase; padding-top: 0.25rem; }
    .work-role { font-weight: 700; font-size: 1.125rem; margin-bottom: 0.25rem; }
    .work-company { font-weight: 700; font-size: 0.875rem; color: ${themeColor}; margin-bottom: 1rem; }
    .work-desc { font-size: 0.875rem; color: #6b7280; line-height: 1.625; font-weight: 300; }
    .edu-item { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .edu-school { font-weight: 700; }
    .edu-degree { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
    .edu-year { font-size: 0.75rem; font-weight: 700; color: #d1d5db; padding-top: 0.25rem; }
    .proj-item { margin-bottom: 2.5rem; }
    .proj-name { font-weight: 700; font-size: 1.125rem; margin-bottom: 0.75rem; }
    .proj-desc { font-size: 0.875rem; color: #6b7280; line-height: 1.625; font-weight: 300; margin-bottom: 1rem; }
    .tags { display: flex; flex-wrap: wrap; gap: 1rem; }
    .tag { font-size: 9px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 8px; background: #f9fafb; border-radius: 4px; color: ${themeColor}; }
    .skills-wrap { display: flex; flex-wrap: wrap; column-gap: 3rem; row-gap: 2rem; }
    .skill-group { }
    .skill-cat { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #d1d5db; margin-bottom: 0.75rem; letter-spacing: -0.025em; }
    .skill-list { font-size: 0.875rem; color: #374151; }
    .skill-item { font-weight: 500; margin-bottom: 0.25rem; }
    .body-text { font-size: 1rem; line-height: 1.625; color: #374151; font-weight: 300; }
    .custom-item { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }
    .custom-title { font-size: 0.875rem; font-weight: 700; color: #111827; }
    .custom-detail { font-size: 0.75rem; font-weight: 500; color: #9ca3af; text-transform: uppercase; }
  `;

  const minimalistSection = (id) => {
    switch (id) {
      case 'summary': return d.summary ? `
        <section class="section">
          <h2 class="section-title">Bio</h2>
          <p class="body-text">${d.summary}</p>
        </section>` : '';
      case 'experience': return d.experience?.length ? `
        <section class="section">
          <h2 class="section-title">Work</h2>
          ${d.experience.map(exp => `
            <div class="work-item">
              <div class="work-date">${exp.startDate} - ${exp.current ? 'Now' : exp.endDate}</div>
              <div>
                <div class="work-role">${exp.role}</div>
                <div class="work-company">${exp.company}</div>
                <div class="work-desc">${exp.description || ''}</div>
              </div>
            </div>`).join('')}
        </section>` : '';
      case 'skills': return d.skills?.length ? `
        <section class="section">
          <h2 class="section-title">Core</h2>
          <div class="skills-wrap">
            ${d.skills.map(s => `
              <div class="skill-group">
                <div class="skill-cat">${s.category}</div>
                <div class="skill-list">
                  ${(s.items || []).map(item => `<div class="skill-item">${item}</div>`).join('')}
                </div>
              </div>`).join('')}
          </div>
        </section>` : '';
      case 'projects': return d.projects?.length ? `
        <section class="section">
          <h2 class="section-title">Works</h2>
          ${d.projects.map(proj => `
            <div class="proj-item">
              <div class="proj-name">${proj.name}</div>
              <div class="proj-desc">${proj.description || ''}</div>
              ${proj.tech?.length ? `<div class="tags">${proj.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
            </div>`).join('')}
        </section>` : '';
      case 'education': return d.education?.length ? `
        <section class="section">
          <h2 class="section-title">Edu</h2>
          ${d.education.map(edu => `
            <div class="edu-item">
              <div>
                <div class="edu-school">${edu.school}</div>
                <div class="edu-degree">${edu.degree} in ${edu.field}</div>
              </div>
              <div class="edu-year">${edu.year}</div>
            </div>`).join('')}
        </section>` : '';
      default: {
        const section = d[id];
        if (!section?.items?.length) return '';
        return `
          <section class="section">
            <h2 class="section-title">${section.title}</h2>
            ${section.items.map(item => `
              <div class="custom-item">
                <span class="custom-title">${item.title}</span>
                <span class="custom-detail">${item.detail}</span>
              </div>`).join('')}
          </section>`;
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // EXECUTIVE TEMPLATE  (mirrors ExecutiveTemplate)
  // ─────────────────────────────────────────────────────────────────
  const executiveStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fontStack};
      color: #111827;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { padding: 20mm; min-height: 297mm; background: white; border: 12mm solid #f9fafb; }
    header { margin-bottom: 3rem; border-bottom: 2px solid ${themeColor}; padding-bottom: 2.5rem; }
    h1 { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; color: #111827; margin-bottom: 1rem; }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      column-gap: 1.5rem;
      row-gap: 0.5rem;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #9ca3af;
    }
    .contact-link { color: ${themeColor}; }
    .section { margin-bottom: 2.5rem; }
    .section-title {
      font-size: 0.875rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-left: 4px solid ${themeColor};
      padding-left: 1rem;
      margin-bottom: 1.5rem;
      color: ${themeColor};
    }
    .body-text { font-size: 13px; line-height: 1.625; color: #374151; text-align: justify; }
    .exp-item { margin-bottom: 2rem; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }
    .exp-role { font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: -0.025em; font-size: 0.875rem; }
    .exp-date { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-left: 1rem; flex-shrink: 0; }
    .exp-company { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #6b7280; margin-bottom: 0.75rem; }
    .exp-desc { font-size: 13px; color: #4b5563; line-height: 1.625; text-align: justify; border-left: 1px solid #f3f4f6; padding-left: 1rem; }
    .edu-item { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .edu-school { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #111827; }
    .edu-degree { font-size: 13px; color: #4b5563; margin-top: 0.25rem; }
    .edu-year { font-size: 10px; font-weight: 700; color: #9ca3af; flex-shrink: 0; margin-left: 1rem; }
    .proj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .proj-name { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #111827; margin-bottom: 0.5rem; }
    .proj-desc { font-size: 0.75rem; color: #4b5563; line-height: 1.625; text-align: justify; }
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
    .skill-cat { font-size: 10px; text-transform: uppercase; font-weight: 900; color: #9ca3af; margin-bottom: 0.5rem; }
    .skill-list { font-size: 11px; color: #374151; }
    .skill-item { font-weight: 600; margin-bottom: 0.25rem; }
    .custom-item { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem; }
    .custom-title { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #111827; }
    .custom-detail { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; }
    footer { margin-top: 2.5rem; padding-top: 2.5rem; border-top: 1px solid #f3f4f6; font-style: italic; font-size: 9px; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900; }
  `;

  const executiveSection = (id) => {
    switch (id) {
      case 'summary': return d.summary ? `
        <section class="section">
          <h2 class="section-title">Profile</h2>
          <p class="body-text">${d.summary}</p>
        </section>` : '';
      case 'experience': return d.experience?.length ? `
        <section class="section">
          <h2 class="section-title">Experience</h2>
          ${d.experience.map(exp => `
            <div class="exp-item">
              <div class="exp-header">
                <span class="exp-role">${exp.role}</span>
                <span class="exp-date">${exp.startDate} - ${exp.current ? 'Now' : exp.endDate}</span>
              </div>
              <div class="exp-company">${exp.company}</div>
              <div class="exp-desc">${exp.description || ''}</div>
            </div>`).join('')}
        </section>` : '';
      case 'skills': return d.skills?.length ? `
        <section class="section">
          <h2 class="section-title">Expertise</h2>
          <div class="skills-grid">
            ${d.skills.map(s => `
              <div>
                <div class="skill-cat">${s.category}</div>
                <div class="skill-list">
                  ${(s.items || []).map(item => `<div class="skill-item">${item}</div>`).join('')}
                </div>
              </div>`).join('')}
          </div>
        </section>` : '';
      case 'projects': return d.projects?.length ? `
        <section class="section">
          <h2 class="section-title">Key Projects</h2>
          <div class="proj-grid">
            ${d.projects.map(proj => `
              <div>
                <div class="proj-name">${proj.name}</div>
                <div class="proj-desc">${proj.description || ''}</div>
              </div>`).join('')}
          </div>
        </section>` : '';
      case 'education': return d.education?.length ? `
        <section class="section">
          <h2 class="section-title">Education</h2>
          ${d.education.map(edu => `
            <div class="edu-item">
              <div>
                <div class="edu-school">${edu.school}</div>
                <div class="edu-degree">${edu.degree} in ${edu.field}</div>
              </div>
              <div class="edu-year">${edu.year}</div>
            </div>`).join('')}
        </section>` : '';
      default: {
        const section = d[id];
        if (!section?.items?.length) return '';
        return `
          <section class="section">
            <h2 class="section-title">${section.title}</h2>
            ${section.items.map(item => `
              <div class="custom-item">
                <span class="custom-title">${item.title}</span>
                <span class="custom-detail">${item.detail}</span>
              </div>`).join('')}
          </section>`;
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Build HTML document based on selected template
  // ─────────────────────────────────────────────────────────────────
  const googleFonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">`;

  let styles, sectionFn, headerHtml, footerHtml = '';

  if (template === 'classic') {
    styles = classicStyles;
    sectionFn = classicSection;
    headerHtml = `
      <header>
        <h1>${d.personalInfo?.name || 'Your Name'}</h1>
        <div class="contact-row">
          ${d.personalInfo?.email ? `<span>${d.personalInfo.email}</span>` : ''}
          ${d.personalInfo?.phone ? `<span>${d.personalInfo.phone}</span>` : ''}
          ${d.personalInfo?.location ? `<span>${d.personalInfo.location}</span>` : ''}
          ${d.personalInfo?.linkedin ? `<span>LinkedIn</span>` : ''}
          ${d.personalInfo?.github ? `<span>GitHub</span>` : ''}
        </div>
      </header>`;
  } else if (template === 'minimalist') {
    styles = minimalistStyles;
    sectionFn = minimalistSection;
    headerHtml = `
      <header>
        <h1>${d.personalInfo?.name || 'Your Name'}</h1>
        <div class="contact-row">
          ${d.personalInfo?.location ? `<span>${d.personalInfo.location}</span>` : ''}
          ${d.personalInfo?.email ? `<span>${d.personalInfo.email}</span>` : ''}
          ${d.personalInfo?.phone ? `<span>${d.personalInfo.phone}</span>` : ''}
          ${d.personalInfo?.linkedin ? `<span>li</span>` : ''}
          ${d.personalInfo?.github ? `<span>gh</span>` : ''}
        </div>
      </header>`;
  } else if (template === 'executive') {
    styles = executiveStyles;
    sectionFn = executiveSection;
    headerHtml = `
      <header>
        <h1>${d.personalInfo?.name || 'Your Name'}</h1>
        <div class="contact-row">
          ${d.personalInfo?.email ? `<span>${d.personalInfo.email}</span>` : ''}
          ${d.personalInfo?.phone ? `<span>${d.personalInfo.phone}</span>` : ''}
          ${d.personalInfo?.location ? `<span>${d.personalInfo.location}</span>` : ''}
          ${d.personalInfo?.linkedin ? `<span class="contact-link">LI</span>` : ''}
          ${d.personalInfo?.github ? `<span class="contact-link">GH</span>` : ''}
        </div>
      </header>`;
    footerHtml = `<footer>Private &amp; Confidential \\ Generated by Resumify Elite</footer>`;
  } else {
    // Default: modern
    styles = modernStyles;
    sectionFn = modernSection;
    headerHtml = `
      <header>
        <h1>${d.personalInfo?.name || 'Your Name'}</h1>
        <div class="contact-row">
          ${d.personalInfo?.email ? `<span>${d.personalInfo.email}</span>` : ''}
          ${d.personalInfo?.phone ? `<span>${d.personalInfo.phone}</span>` : ''}
          ${d.personalInfo?.location ? `<span>${d.personalInfo.location}</span>` : ''}
          ${d.personalInfo?.linkedin ? `<span>LinkedIn</span>` : ''}
          ${d.personalInfo?.github ? `<span>GitHub</span>` : ''}
        </div>
      </header>`;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${googleFonts}
  <style>${styles}</style>
</head>
<body>
  <div class="page">
    ${headerHtml}
    ${sectionOrder.map(id => sectionFn(id)).join('')}
    ${footerHtml}
  </div>
</body>
</html>`;

  // ─────────────────────────────────────────────────────────────────
  // Launch Puppeteer and render PDF
  // ─────────────────────────────────────────────────────────────────
  let browser;
  if (isProduction) {
    const chromium = require('@sparticuz/chromium');
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } else {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  return pdfBuffer;
};

module.exports = generatePdfUtil;
