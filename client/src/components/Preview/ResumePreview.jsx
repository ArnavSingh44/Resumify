import React from 'react';
import { useResume } from '../../hooks/useResume';

export const renderCustomSection = (id, data, themeColor) => {
// ...
  const section = data[id];
  if (!section || !section.items || section.items.length === 0) return null;
  
  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold uppercase border-b-2 mb-3 tracking-wide" style={{ borderColor: themeColor }}>{section.title}</h2>
      <div className="space-y-2">
        {section.items.map((item, i) => (
          <div key={i} className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900">{item.title}</span>
            <span className="text-xs font-semibold text-gray-500 uppercase">{item.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ModernTemplate = ({ data }) => {
  const { personalInfo, themeColor, fontFamily, sectionOrder } = data;
  
  const getSection = (id) => {
    switch(id) {
      case 'summary': return data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 mb-2 tracking-wide" style={{ borderColor: themeColor }}>Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap break-words">{data.summary}</p>
        </section>
      );
      case 'experience': return data.experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 mb-3 tracking-wide" style={{ borderColor: themeColor }}>Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{exp.role} at {exp.company}</h3>
                  <span className="text-xs font-semibold text-gray-500 uppercase">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-sm mt-1 text-gray-700 leading-relaxed italic break-words">{exp.description || `Role at ${exp.company}`}</p>
              </div>
            ))}
          </div>
        </section>
      );
      case 'education': return data.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 mb-2 tracking-wide" style={{ borderColor: themeColor }}>Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span>{edu.degree} in {edu.field} {edu.gpa && <span className="text-gray-500 font-normal ml-2">(GPA: {edu.gpa})</span>}</span>
                  <span className="text-xs text-gray-500">{edu.year}</span>
                </div>
                <div className="text-sm text-gray-700">{edu.school}</div>
              </div>
            ))}
          </div>
        </section>
      );
      case 'projects': return data.projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 mb-2 tracking-wide" style={{ borderColor: themeColor }}>Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                   <h3 className="font-bold text-gray-900">{proj.name}</h3>
                   {proj.link && <span className="text-xs font-bold" style={{ color: themeColor }}>{proj.link}</span>}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap">{proj.description}</p>
                {proj.tech?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {proj.tech.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
      case 'skills': return data.skills?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 mb-2 tracking-wide" style={{ borderColor: themeColor }}>Skills</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {data.skills.map((s, i) => (
              <p key={i}><span className="font-bold">{s.category}:</span> {s.items?.join(', ')}</p>
            ))}
          </div>
        </section>
      );
      default: return renderCustomSection(id, data, themeColor);
    }
  };

  return (
    <div className={`bg-white text-gray-800 p-[20mm] min-h-[297mm] font-${fontFamily}`}>
      <header className="mb-8 border-b-4 pb-4 text-left" style={{ borderColor: themeColor }}>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">
          {personalInfo?.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm font-semibold text-gray-500">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>LinkedIn</span>}
          {personalInfo?.github && <span>GitHub</span>}
        </div>
      </header>

      {sectionOrder.map(id => <React.Fragment key={id}>{getSection(id)}</React.Fragment>)}
    </div>
  );
};

export const ClassicTemplate = ({ data }) => {
  const { personalInfo, themeColor, fontFamily, sectionOrder } = data;
  
  const getSection = (id) => {
    switch(id) {
      case 'summary': return data.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-center border-b mb-4 tracking-widest" style={{ color: themeColor, borderColor: `${themeColor}40` }}>Professional Summary</h2>
          <p className="text-sm leading-loose text-gray-800 text-center break-words whitespace-pre-wrap px-8 italic">{data.summary}</p>
        </section>
      );
      case 'experience': return data.experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-center border-b mb-4 tracking-widest" style={{ color: themeColor, borderColor: `${themeColor}40` }}>Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-gray-900">{exp.company}</span>
                  <span className="text-gray-500 uppercase">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="italic text-sm mb-2">{exp.role}</div>
                <p className="text-sm leading-relaxed text-gray-700 text-justify break-words whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
      case 'education': return data.education?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-center border-b mb-4 tracking-widest" style={{ color: themeColor, borderColor: `${themeColor}40` }}>Academic Background</h2>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-gray-900">{edu.school}</span>
                  <span className="text-gray-500">{edu.year}</span>
                </div>
                <div className="text-sm italic">{edu.degree} in {edu.field} {edu.gpa && <span className="italic font-normal text-gray-400"> (GPA: {edu.gpa})</span>}</div>
              </div>
            ))}
          </div>
        </section>
      );
      case 'projects': return data.projects?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-center border-b mb-4 tracking-widest" style={{ color: themeColor, borderColor: `${themeColor}40` }}>Public Projects</h2>
          <div className="space-y-6">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="font-bold text-sm mb-1">{proj.name}</div>
                <p className="text-sm text-gray-700 text-justify break-words whitespace-pre-wrap">{proj.description}</p>
                {proj.tech?.length > 0 && (
                  <div className="text-[10px] mt-2 font-bold uppercase italic tracking-tighter" style={{ color: themeColor }}>{proj.tech.join(' \u2022 ')}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
      case 'skills': return data.skills?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-center border-b mb-4 tracking-widest" style={{ color: themeColor, borderColor: `${themeColor}40` }}>Expertise</h2>
          <div className="space-y-2 text-sm">
            {data.skills.map((s, i) => (
              <p key={i}><strong className="uppercase mr-2 text-xs opacity-60 font-black">{s.category}:</strong> {s.items?.join(', ')}</p>
            ))}
          </div>
        </section>
      );
      default: {
        const section = data[id];
        if (!section || !section.items?.length) return null;
        return (
          <section className="mb-8">
            <h2 className="text-lg font-bold uppercase text-center border-b mb-4 tracking-widest" style={{ color: themeColor, borderColor: `${themeColor}40` }}>{section.title}</h2>
            <div className="space-y-2 px-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline font-bold text-sm">
                    <span className="text-gray-900">{item.title}</span>
                    <span className="text-gray-500 italic font-normal">{item.detail}</span>
                  </div>
                ))}
            </div>
          </section>
        );
      }
    }
  };

  return (
    <div className={`bg-white text-black p-[20mm] min-h-[297mm] font-${fontFamily}`}>
      <header className="mb-12 text-center border-b pb-8 uppercase tracking-widest" style={{ borderColor: `${themeColor}20` }}>
        <h1 className="text-5xl mb-4 font-normal tracking-widest" style={{ color: themeColor }}>{personalInfo?.name || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-xs italic text-gray-500">
          <span>{personalInfo?.email}</span>
          <span>{personalInfo?.phone}</span>
          <span>{personalInfo?.location}</span>
          {personalInfo?.linkedin && <span>LinkedIn</span>}
          {personalInfo?.github && <span>GitHub</span>}
        </div>
      </header>
      
      {sectionOrder.map(id => <React.Fragment key={id}>{getSection(id)}</React.Fragment>)}
    </div>
  );
};

export const MinimalistTemplate = ({ data }) => {
  const { personalInfo, themeColor, fontFamily, sectionOrder } = data;
  
  const getSection = (id) => {
    switch(id) {
      case 'summary': return data.summary && (
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-4 text-gray-400">Bio</h2>
          <p className="text-base leading-relaxed text-gray-700 font-light break-words whitespace-pre-wrap">{data.summary}</p>
        </section>
      );
      case 'experience': return data.experience?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-gray-400">Work</h2>
          <div className="space-y-12">
            {data.experience.map((exp, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-xs font-medium text-gray-400 py-1 uppercase">{exp.startDate} - {exp.current ? 'Now' : exp.endDate}</div>
                <div className="col-span-3">
                  <h3 className="font-bold text-lg mb-1">{exp.role}</h3>
                  <p className="font-bold text-sm mb-4" style={{ color: themeColor }}>{exp.company}</p>
                  <p className="text-sm text-gray-500 leading-relaxed font-light break-words whitespace-pre-wrap">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
      case 'education': return data.education?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6 text-gray-400">Edu</h2>
          <div className="space-y-6">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.school}</h3>
                  <p className="text-sm text-gray-500 leading-tight">{edu.degree} in {edu.field}</p>
                </div>
                <span className="text-xs font-bold text-gray-300 py-1">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      );
      case 'projects': return data.projects?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6 text-gray-400">Works</h2>
          <div className="space-y-10">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <h3 className="font-bold text-lg mb-3">{proj.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light break-words whitespace-pre-wrap mb-4">{proj.description}</p>
                {proj.tech?.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {proj.tech.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-black tracking-widest uppercase py-1 px-2 bg-gray-50 rounded" style={{ color: themeColor }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
      case 'skills': return data.skills?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6 text-gray-400">Core</h2>
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {data.skills.map((s, i) => (
              <div key={i}>
                <p className="text-[10px] uppercase font-bold text-gray-300 mb-3 tracking-tighter">{s.category}</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {s.items?.map((item, idx) => <li key={idx} className="font-medium">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
      default: {
        const section = data[id];
        if (!section || !section.items?.length) return null;
        return (
          <section className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6 text-gray-400">{section.title}</h2>
            <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{item.title}</span>
                    <span className="text-xs font-medium text-gray-400 py-1 uppercase">{item.detail}</span>
                  </div>
                ))}
            </div>
          </section>
        );
      }
    }
  };

  return (
    <div className={`bg-white text-gray-900 p-[24mm] min-h-[297mm] font-${fontFamily} antialiased`}>
      <header className="mb-20">
        <h1 className="text-6xl font-light mb-4 tracking-tighter" style={{ color: themeColor }}>{personalInfo?.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          <span>{personalInfo?.location}</span>
          <span>{personalInfo?.email}</span>
          <span>{personalInfo?.phone}</span>
          {personalInfo?.linkedin && <span>li</span>}
          {personalInfo?.github && <span>gh</span>}
        </div>
      </header>
      
      {sectionOrder.map(id => <React.Fragment key={id}>{getSection(id)}</React.Fragment>)}
    </div>
  );
};

export const ExecutiveTemplate = ({ data }) => {
  const { personalInfo, themeColor, fontFamily, sectionOrder } = data;
  
  const getSection = (id) => {
    switch(id) {
       case 'summary': return data.summary && (
        <section className="mb-10">
          <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-l-4 pl-4" style={{ borderColor: themeColor, color: themeColor }}>Profile</h2>
          <p className="text-[13px] leading-relaxed text-gray-700 break-words whitespace-pre-wrap text-justify">{data.summary}</p>
        </section>
      );
      case 'experience': return data.experience?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 pl-4" style={{ borderColor: themeColor, color: themeColor }}>Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">{exp.role}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{exp.startDate} - {exp.current ? 'Now' : exp.endDate}</span>
                </div>
                <div className="text-xs font-bold uppercase mb-3 text-gray-500">{exp.company}</div>
                <p className="text-[13px] text-gray-600 leading-relaxed text-justify break-words whitespace-pre-wrap border-l border-gray-100 pl-4">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
      case 'education': return data.education?.length > 0 && (
        <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 pl-4" style={{ borderColor: themeColor, color: themeColor }}>Education</h2>
            <div className="space-y-4">
                {data.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xs font-black uppercase text-gray-900">{edu.school}</h3>
                            <p className="text-[13px] text-gray-600">{edu.degree} in {edu.field}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{edu.year}</span>
                    </div>
                ))}
            </div>
        </section>
      );
      case 'projects': return data.projects?.length > 0 && (
        <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 pl-4" style={{ borderColor: themeColor, color: themeColor }}>Key Projects</h2>
            <div className="grid grid-cols-2 gap-8">
                {data.projects.map((proj, i) => (
                    <div key={i}>
                        <h3 className="text-xs font-black uppercase mb-2 text-gray-900">{proj.name}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed text-justify mb-3">{proj.description}</p>
                    </div>
                ))}
            </div>
        </section>
      );
      case 'skills': return data.skills?.length > 0 && (
        <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 pl-4" style={{ borderColor: themeColor, color: themeColor }}>Expertise</h2>
            <div className="grid grid-cols-3 gap-6">
                {data.skills.map((s, i) => (
                    <div key={i}>
                        <p className="text-[10px] uppercase font-black text-gray-400 mb-2">{s.category}</p>
                        <ul className="text-[11px] text-gray-700 space-y-1">
                            {s.items?.map((item, idx) => <li key={idx} className="font-semibold">{item}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
      );
      default: {
        const section = data[id];
        if (!section || !section.items?.length) return null;
        return (
          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-l-4 pl-4" style={{ borderColor: themeColor, color: themeColor }}>{section.title}</h2>
            <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <span className="text-xs font-black uppercase text-gray-900">{item.title}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.detail}</span>
                  </div>
                ))}
            </div>
          </section>
        );
      }
    }
  };

  return (
    <div className={`bg-white text-gray-900 p-[20mm] min-h-[297mm] font-${fontFamily} border-[12mm] border-gray-50 flex flex-col`}>
        <header className="mb-12 border-b-2 pb-10" style={{ borderColor: themeColor }}>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">{personalInfo?.name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>{personalInfo?.email}</span>
                <span>{personalInfo?.phone}</span>
                <span>{personalInfo?.location}</span>
                {personalInfo?.linkedin && <span style={{ color: themeColor }}>LI</span>}
                {personalInfo?.github && <span style={{ color: themeColor }}>GH</span>}
            </div>
        </header>
        <div className="flex-1">
            {sectionOrder.map(id => <React.Fragment key={id}>{getSection(id)}</React.Fragment>)}
        </div>
        <footer className="mt-auto pt-10 border-t border-gray-100 italic text-[9px] text-gray-300 uppercase tracking-widest font-black">
            Private & Confidential \ Generated by Resumify Elite
        </footer>
    </div>
  );
};

const ResumePreview = () => {
  const { resumeData } = useResume();
  const template = resumeData.template || 'modern';

  return (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden transition-all duration-500" style={{ width: '210mm', minHeight: '297mm' }}>
      {template === 'classic' && <ClassicTemplate data={resumeData} />}
      {template === 'minimalist' && <MinimalistTemplate data={resumeData} />}
      {template === 'modern' && <ModernTemplate data={resumeData} />}
      {template === 'executive' && <ExecutiveTemplate data={resumeData} />}
    </div>
  );
};

export default ResumePreview;
