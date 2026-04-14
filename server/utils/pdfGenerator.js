const isProduction = process.env.NODE_ENV === 'production';
const puppeteer = isProduction ? require('puppeteer-core') : require('puppeteer');

const generatePdfUtil = async (resumeData) => {
  const template = resumeData.template || 'modern';

  let styles = `
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; font-size: 14px; line-height: 1.4; overflow-wrap: break-word; word-wrap: break-word; }
    h1 { margin: 0 0 5px 0; font-size: 28px; color: #111; }
    h2 { border-bottom: 1px solid #000; font-size: 16px; margin-top: 20px; padding-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
    .contact { font-size: 13px; color: #444; margin-bottom: 20px; }
    .section { margin-bottom: 15px; }
    .title { font-weight: bold; font-size: 15px; }
    .meta { font-style: italic; color: #555; font-size: 13px; float: right; }
    .clear { clear: both; }
    p { margin: 5px 0; }
  `;

  if (template === 'classic') {
    styles = `
      body { font-family: 'Georgia', serif; color: #000; margin: 0; padding: 50px; font-size: 13px; line-height: 1.6; overflow-wrap: break-word; word-wrap: break-word; }
      h1 { margin: 0 0 10px 0; font-size: 32px; text-align: center; text-transform: uppercase; letter-spacing: 2px; }
      h2 { border-bottom: 1px solid #ccc; font-size: 14px; margin-top: 25px; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 2px; text-align: center; font-weight: bold; }
      .contact { font-size: 12px; text-align: center; margin-bottom: 30px; font-style: italic; }
      .section { margin-bottom: 20px; }
      .title-row { font-weight: bold; display: flex; justify-content: space-between; font-size: 14px; }
      .role { font-style: italic; margin-bottom: 5px; }
      p { margin: 5px 0; text-align: justify; }
    `;
  } else if (template === 'minimalist') {
    styles = `
      body { font-family: 'Arial', sans-serif; color: #1a1a1a; margin: 0; padding: 50px; font-size: 13px; line-height: 1.6; overflow-wrap: break-word; word-wrap: break-word; }
      h1 { margin: 0 0 5px 0; font-size: 42px; font-weight: 300; }
      .tagline { color: #2563eb; text-transform: uppercase; letter-spacing: 3px; font-size: 11px; margin-bottom: 40px; font-weight: 600; }
      h2 { font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #9ca3af; margin-top: 35px; margin-bottom: 15px; font-weight: 900; }
      .section { margin-bottom: 30px; border-left: 2px solid #f3f4f6; padding-left: 25px; margin-left: 5px; position: relative; }
      .section::before { content: ''; position: absolute; width: 8px; height: 8px; background: #e5e7eb; border-radius: 50%; left: -5px; top: 5px; }
      .title-row { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px; font-size: 15px; }
      .company { color: #2563eb; font-weight: 600; margin-bottom: 8px; }
      .skills-container { display: flex; flex-wrap: wrap; gap: 20px; }
      .skill-group { margin-bottom: 10px; }
      .skill-label { font-size: 9px; text-transform: uppercase; color: #9ca3af; font-weight: bold; margin-bottom: 4px; }
      p { margin: 5px 0; color: #4b5563; font-weight: 300; }
    `;
  }

  const renderSkills = () => {
    if (!resumeData.skills || resumeData.skills.length === 0) return '';
    if (template === 'minimalist') {
      return `
        <h2>Capabilities</h2>
        <div class="skills-container">
          ${resumeData.skills.map(s => `
            <div class="skill-group">
              <div class="skill-label">${s.category}</div>
              <div style="font-weight: 500;">• ${s.items.join('<br/>• ')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    return `
      <h2>${template === 'classic' ? 'Expertise' : 'Skills'}</h2>
      <div class="section">
        ${resumeData.skills.map(s => `<p><strong>${s.category}:</strong> ${s.items.join(', ')}</p>`).join('')}
      </div>
    `;
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>${styles}</style>
    </head>
    <body>
      ${template === 'minimalist' ? `<div class="tagline">${resumeData.personalInfo?.location || ''}</div>` : ''}
      <h1 style="${template === 'classic' ? 'text-align: center;' : ''}">${resumeData.personalInfo?.name || 'Your Name'}</h1>
      
      <div class="contact">
        ${resumeData.personalInfo?.email || ''} | ${resumeData.personalInfo?.phone || ''} | ${resumeData.personalInfo?.location || ''}
        ${resumeData.personalInfo?.linkedin ? ` | LinkedIn: ${resumeData.personalInfo.linkedin}` : ''}
        ${resumeData.personalInfo?.github ? ` | GitHub: ${resumeData.personalInfo.github}` : ''}
      </div>

      ${resumeData.summary ? `
        <h2>${template === 'minimalist' ? 'Biography' : (template === 'classic' ? 'Summary' : 'Professional Summary')}</h2>
        <div class="section"><p>${resumeData.summary}</p></div>
      ` : ''}

      ${resumeData.experience && resumeData.experience.length > 0 ? `
        <h2>${template === 'classic' ? 'Professional History' : (template === 'minimalist' ? 'Career Path' : 'Experience')}</h2>
        ${resumeData.experience.map(exp => `
          <div class="section">
            <div class="title-row">
               <span>${template === 'minimalist' ? exp.role : (exp.role + ' at ' + exp.company)}</span>
               <span class="meta" style="font-weight: normal; font-size: 12px; color: #666;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
            </div>
            ${template === 'minimalist' ? `<div class="company">${exp.company}</div>` : ''}
            <p>${exp.description || ''}</p>
          </div>
        `).join('')}
      ` : ''}

      ${renderSkills()}

      ${resumeData.projects && resumeData.projects.length > 0 ? `
        <h2>${template === 'classic' ? 'Selected Works' : (template === 'minimalist' ? 'Featured Projects' : 'Projects')}</h2>
        ${resumeData.projects.map(proj => `
          <div class="section">
            <div class="title-row">
              <span>${proj.name}</span>
              ${proj.link ? `<span class="meta">${proj.link}</span>` : ''}
            </div>
            <p>${proj.description || ''}</p>
            ${proj.tech && proj.tech.length > 0 ? `<div style="font-size: 11px; color: #666; font-weight: bold; margin-top: 4px;">Tech Stack: ${proj.tech.join(', ')}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${resumeData.education && resumeData.education.length > 0 ? `
        <h2>Education</h2>
        ${resumeData.education.map(edu => `
          <div class="section">
            <div class="title-row">
              <span>${template === 'classic' ? edu.school : (edu.degree + ' in ' + edu.field)}</span>
              <span class="meta">${edu.year}</span>
            </div>
            <div>${template === 'classic' ? (edu.degree + ' in ' + edu.field) : edu.school} ${edu.gpa ? `<span style="color: #666; margin-left: 10px;">| GPA: ${edu.gpa}</span>` : ''}</div>
          </div>
        `).join('')}
      ` : ''}
    </body>
    </html>
  `;

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
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  await browser.close();
  return pdfBuffer;
};

module.exports = generatePdfUtil;
