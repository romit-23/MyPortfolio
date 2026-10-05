"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Activity, AudioLines, BookOpen, BrainCircuit, Check, Code2, Copy, Cpu, Database, Download, Layers, Mail, MapPin, Menu, Pause, Play, ScanLine, X } from "lucide-react";
import { Github, Linkedin } from "@/components/social-icons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const spring = { type: "spring" as const, stiffness: 140, damping: 22 };
const email = "addromit2307@gmail.com";
const resumeUrl = "./Romit-Addagatla-Resume.pdf";
const projects = [
  {
    id: "guardnet", number: "01", category: "COMPUTER VISION", title: "GuardNet", subtitle: "Violence detection in public surveillance.", color: "violet",
    description: "A hybrid deep learning model for detecting violence in CCTV footage, combining ConvNeXt-Tiny, LSTM, and attention. Published at IEEE.",
    details: ["Combines spatial feature extraction with temporal modeling and attention for CCTV violence detection.", "Built using PyTorch, ConvNeXt, LSTM, OpenCV, and CUDA."],
    tags: ["PyTorch", "ConvNeXt", "LSTM", "OpenCV", "CUDA"], link: "https://github.com/romit-23/GuardNet", publication: "https://ieeexplore.ieee.org/document/11284226",
  },
  {
    id: "hotels", number: "02", category: "RETRIEVAL-AUGMENTED GENERATION", title: "RAG for Hotels", subtitle: "Better retrieval. Better booking insights.", color: "lime",
    description: "A retrieval-augmented generation pipeline for hotel booking insights using FAISS, Mistral-7B, and LangChain, deployed with FastAPI and Docker.",
    details: ["Performed comprehensive data cleaning and exploratory data analysis to improve retrieval quality and downstream response accuracy.", "Uses FAISS for retrieval and Mistral-7B from Hugging Face with LangChain."],
    tags: ["FAISS", "Mistral-7B", "LangChain", "FastAPI", "Docker"], link: "https://github.com/romit-23/RAG-Model-for-Hotels",
  },
  {
    id: "fraud", number: "03", category: "MACHINE LEARNING", title: "Financial Fraud Detection", subtitle: "Finding the signal in 6.3M transactions.", color: "peach",
    description: "A machine learning model built on 6.3 million transactions with a 0.13% fraud rate, using Random Forest, XGBoost, and SMOTE to handle class imbalance.",
    details: ["Engineered domain-specific features to improve precision and recall.", "Evaluated models using AUC-ROC and F1 metrics."],
    tags: ["Random Forest", "XGBoost", "SMOTE", "AUC-ROC", "F1"], link: "https://github.com/romit-23/Fraud-Detection-Model",
  },
  {
    id: "news", number: "04", category: "NATURAL LANGUAGE PROCESSING", title: "News, beyond language", subtitle: "Article translation & speech in Indic languages.", color: "blue",
    description: "An end-to-end pipeline for news extraction, translation, and speech synthesis using IndicTrans2 and Facebook TTSMMS, deployed with FastAPI and Docker.",
    details: ["Supports multiple Indic languages.", "Uses a modular architecture for extension to new language pairs and text-to-speech voices."],
    tags: ["IndicTrans2", "TTSMMS", "FastAPI", "Docker"], link: "https://github.com/romit-23/News-translation-and-TTS",
  },
];
type Project = (typeof projects)[number];
const experience = [
  {
    role: "Python AI Engineer", company: "Arcitech.ai", place: "Navi Mumbai", period: "Feb 2026 — Present", current: true,
    bullets: ["Designed and shipped production multi-agent AI systems with LangChain, LangGraph, and LangSmith for orchestration, monitoring, and latency optimization.", "Re-engineered an image upscaling pipeline for native 2K/4K outputs, fixed aspect-ratio hallucination defects, and drove a GPT-5.4 upgrade through comparative benchmarks.", "Built an LLM-ready web-scraping pipeline to replace unreliable PDFs and support advanced RAG; audited APIs and resolved production data issues.", "Designed clickable AI suggestion cards to improve user discoverability and engagement."],
    tags: ["Multi-agent systems", "LangGraph", "RAG", "Production AI"],
  },
  {
    role: "Python AI Intern", company: "Arcitech.ai", place: "Navi Mumbai", period: "Dec 2025 — Feb 2026", current: false,
    bullets: ["Built the ADFactors multi-agent PR generation system with LangChain and LangGraph, integrating compliance agents, web search, PDF generation, and team collaboration.", "Monitored agents with LangSmith and reduced latency by choosing task-optimized alternatives to high-latency reasoning models.", "Developed REST APIs with FastAPI, PostgreSQL, and pgvector; built RAG systems with persistent memory during training."],
    tags: ["LangChain", "FastAPI", "PostgreSQL", "pgvector"],
  },
  {
    role: "AI/ML Intern", company: "Annam.ai · IIT Ropar", place: "Center of Excellence in Digital Agriculture", period: "Aug 2025 — Oct 2025", current: false,
    bullets: ["Conducted computer vision research using PyTorch, Transformers, and Vision Transformers for agricultural image modeling.", "Applied MLflow for experiment tracking and model versioning, deployed with FastAPI and Docker, and explored LLMs for intelligent automation."],
    tags: ["Computer vision", "Vision Transformers", "MLflow", "MLOps"],
  },
];
const toolkit = [
  { id: "ai", name: "AI & machine learning", groups: [
    { label: "FRAMEWORKS & DATA", skills: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "NumPy", "Pandas"] },
    { label: "GENERATIVE AI & NLP", skills: ["LangChain", "LangGraph", "LangSmith", "Transformers", "NLTK", "SpaCy", "GPT-4", "Llama-3", "Claude 3"] },
    { label: "APPLICATIONS", skills: ["Generative AI", "RAG", "NER", "Chatbots", "Semantic search"] },
  ] },
  { id: "backend", name: "Backend & data", groups: [
    { label: "LANGUAGES", skills: ["Python", "JavaScript", "SQL", "Bash", "HTML"] },
    { label: "APIS & DATABASES", skills: ["FastAPI", "Django", "PostgreSQL", "MySQL", "pgvector"] },
    { label: "VISUALIZATION", skills: ["Matplotlib", "Seaborn", "Plotly", "Tableau"] },
  ] },
  { id: "engineering", name: "Tools & deployment", groups: [
    { label: "TOOLS & PLATFORMS", skills: ["Docker", "AWS", "Git", "GitHub"] },
    { label: "EXPERIMENTS & INFERENCE", skills: ["MLflow", "CUDA", "OpenCV", "Hugging Face"] },
    { label: "PROJECT TECH", skills: ["FAISS", "Mistral-7B", "IndicTrans2", "TTSMMS", "XGBoost", "SMOTE"] },
  ] },
];

function useMotionPreference() {
  const preference = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated && !!preference;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useMotionPreference();
  return <motion.div data-reveal="" className={className} initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ ...spring, delay }}>{children}</motion.div>;
}
function MagneticLink({ children, href, className = "", download = false }: { children: ReactNode; href: string; className?: string; download?: boolean }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, spring), sy = useSpring(y, spring);
  const reduce = useMotionPreference();
  return <motion.a href={href} download={download || undefined} className={className} style={reduce ? undefined : { x: sx, y: sy }} onPointerMove={e => { if(e.pointerType !== "mouse" || reduce) return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*0.12); y.set((e.clientY-r.top-r.height/2)*0.18); }} onPointerLeave={() => { x.set(0); y.set(0); }} whileTap={reduce ? undefined : { scale: 0.97 }}>{children}</motion.a>;
}
function AgentDiagram({ paused }: { paused: boolean }) {
  return <div className={`agent-diagram ${paused ? "is-paused" : ""}`} aria-label="Illustration of a multi-agent workflow: input, orchestration, research and retrieval, then response" role="img">
    <svg className="agent-connections" viewBox="0 0 520 390" aria-hidden="true"><path d="M260 81 V164 M260 194 L109 279 M260 194 L412 279 M109 295 Q109 355 260 355 Q412 355 412 295" /><path className="travel-path" d="M260 81 V164 M260 194 L109 279 M260 194 L412 279" /></svg>
    <div className="diagram-input"><Code2 size={15}/><span>input</span><span className="mini-code">{`{ prompt }`}</span></div>
    <div className="orchestrator"><BrainCircuit size={31}/><span>Orchestrator</span><small>LangGraph</small></div>
    <div className="diagram-agent research"><ScanLine size={23}/><span>Research</span></div><div className="diagram-agent retrieval"><Database size={23}/><span>Retrieval</span></div>
    <div className="diagram-output"><span className="output-light"/><span>response</span><Check size={14}/></div><div className="diagram-coordinate">x: intelligence<br/>y: orchestration</div>
  </div>;
}
function ProjectVisual({ project, paused }: { project: Project; paused: boolean }) {
  return <div className={`project-visual visual-${project.id} ${paused ? "is-paused" : ""}`} aria-hidden="true"><div className="visual-grid"/>
    {project.id === "guardnet" && <><div className="vision-top"><span>GuardNet / architecture</span><ScanLine size={16}/></div><div className="vision-flow"><span className="vision-node"><ScanLine/>CCTV</span><span className="flow-line"/><span className="vision-node main"><Layers/>ConvNeXt</span><span className="flow-line"/><span className="vision-node"><Activity/>LSTM</span></div><div className="attention-visual"><div className="attention-bars">{Array.from({length:26},(_,i)=><span key={i} style={{"--bar-height":`${18+((i*37+13)%77)}%`,"--delay":`${i*.07}s`} as CSSProperties}/>)}</div><span>temporal attention</span></div></>}
    {project.id === "hotels" && <><div className="retrieval-query"><span className="query-cursor"/>Hotel booking insights</div><div className="rag-flow"><div className="rag-docs">{[0,1,2].map(i=><div className="rag-doc" key={i}><span/><span/><span/></div>)}</div><div className="rag-connector"/><div className="rag-model"><BrainCircuit size={30}/><span>Mistral-7B</span></div></div><div className="rag-caption"><span>FAISS retrieval</span><span>context + generation</span></div></>}
    {project.id === "fraud" && <><div className="vision-top"><span>Fraud detection / model pipeline</span><Activity size={16}/></div><div className="fraud-pipeline"><span><Database size={22}/>Features</span><i/><span><Layers size={22}/>SMOTE</span><i/><span className="fraud-models"><Cpu size={22}/><span>Random Forest<br/>XGBoost</span></span></div><div className="fraud-stat"><strong>6.3M<span>transactions</span></strong><div><span className="fraud-legend"/>0.13% fraud rate</div></div></>}
    {project.id === "news" && <><div className="language-flow"><span>Article</span><div className="language-line"/><span className="translation-node">IndicTrans2</span><div className="language-line"/><AudioLines size={26}/></div><div className="audio-wave">{Array.from({length:43},(_,i)=><span key={i} style={{"--wave-height":`${18+((i*23+7)%83)}%`,"--delay":`${i*.045}s`} as CSSProperties}/>)}</div><div className="audio-caption"><span>Text → translation → speech</span><span>TTSMMS</span></div></>}
  </div>;
}
function ProjectCard({ project, index, paused, onSelect }: { project: Project; index: number; paused: boolean; onSelect: (button: HTMLButtonElement) => void }) {
  const x=useMotionValue(0), y=useMotionValue(0);
  const rotateX=useSpring(y,{stiffness:160,damping:26}), rotateY=useSpring(x,{stiffness:160,damping:26});
  const reduce=useMotionPreference();
  return <Reveal delay={index%2*.07}><motion.article className={`project-card card-${project.color}`} style={reduce||paused ? undefined : {rotateX,rotateY,transformPerspective:1200}} onPointerMove={e=>{if(e.pointerType!=="mouse"||reduce||paused)return;const rect=e.currentTarget.getBoundingClientRect();x.set((e.clientX-rect.left-rect.width/2)/rect.width*4);y.set(-(e.clientY-rect.top-rect.height/2)/rect.height*4);}} onPointerLeave={()=>{x.set(0);y.set(0);}}><ProjectVisual project={project} paused={paused}/><div className="project-content"><div className="project-overline"><span>{project.category}</span><span>{project.number}</span></div><h3>{project.title}</h3><p>{project.subtitle}</p><div className="project-tags">{project.tags.slice(0,3).map(tag=><span key={tag}>{tag}</span>)}</div><div className="project-bottom"><DialogTrigger asChild><button onClick={event=>onSelect(event.currentTarget)} className="project-open" aria-label={`Explore ${project.title}`}>Explore project<span className="plus-icon" aria-hidden="true">+</span></button></DialogTrigger>{"publication" in project&&<span className="publication-mark"><BookOpen size={13}/>IEEE published</span>}</div></div></motion.article></Reveal>;
}
function Header() {
  const [menu,setMenu]=useState(false), [active,setActive]=useState("");
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id);});},{rootMargin:"-15% 0px -55% 0px"});document.querySelectorAll("main section[id]").forEach(el=>observer.observe(el));return ()=>observer.disconnect();},[]);
  useEffect(()=>{if(!menu)return;const listener=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenu(false);};window.addEventListener("keydown",listener);return ()=>window.removeEventListener("keydown",listener);},[menu]);
  return <header className="site-header"><a className="wordmark" href="#home" onClick={()=>setMenu(false)} aria-label="Romit Addagatla, home"><span className="logo-mark" aria-hidden="true"><i/><i/><i/></span>romit<span className="wordmark-period">.</span></a><nav className={menu ? "main-nav menu-open" : "main-nav"} aria-label="Main navigation" id="main-navigation">{[{id:"work",label:"Work"},{id:"experience",label:"Experience"},{id:"toolkit",label:"Toolkit"},{id:"about",label:"About"}].map(item=><a href={`#${item.id}`} key={item.id} className={active===item.id ? "nav-active" : ""} onClick={()=>setMenu(false)}>{active===item.id&&<motion.span layoutId="nav-pill" className="nav-pill" transition={spring}/>}<span>{item.label}</span></a>)}</nav><div className="header-actions"><a className="header-contact" href="#contact">Let’s talk<Mail size={15}/></a><button className="menu-toggle" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} aria-controls="main-navigation" onClick={()=>setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div></header>;
}

export default function Home() {
  const [selected,setSelected]=useState<Project|null>(null), [paused,setPaused]=useState(false), [copied,setCopied]=useState(false), [copyError,setCopyError]=useState(false), [skillTab,setSkillTab]=useState("ai");
  const copyTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const activeProjectTrigger=useRef<HTMLButtonElement|null>(null);
  const reduce=useMotionPreference(), noMotion=paused||!!reduce;
  const {scrollYProgress}=useScroll(), progress=useSpring(scrollYProgress,{stiffness:100,damping:30});
  const heroRef=useRef<HTMLElement>(null);
  const {scrollYProgress:heroProgress}=useScroll({target:heroRef,offset:["start start","end start"]});
  const heroY=useTransform(heroProgress,[0,1],[0,65]);
  useEffect(()=>()=>{if(copyTimer.current)clearTimeout(copyTimer.current);},[]);
  async function copyEmail(){try{await navigator.clipboard.writeText(email);setCopied(true);setCopyError(false);if(copyTimer.current)clearTimeout(copyTimer.current);copyTimer.current=setTimeout(()=>setCopied(false),2500);}catch{setCopyError(true);}}
  return <MotionConfig reducedMotion="user"><div className={noMotion ? "portfolio motion-paused" : "portfolio"}><a className="skip-link" href="#main">Skip to content</a><motion.div className="scroll-progress" style={{scaleX:noMotion ? scrollYProgress : progress}} aria-hidden="true"/><Header/>
  <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null);}}><main id="main">
    <section id="home" className="hero section-wrap" ref={heroRef}><div className="hero-topline"><Reveal><span className="eyebrow"><span className="eyebrow-square"/>ROMIT ADDAGATLA · PYTHON AI ENGINEER</span></Reveal><span className="location"><MapPin size={14}/>Mumbai, India</span></div><div className="hero-main"><div className="hero-copy"><motion.h1 initial={reduce ? false : {opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{...spring,delay:.1}}>Engineering<br/><span className="lime-text">intelligence<span className="hero-dot">.</span></span></motion.h1><Reveal delay={.22}><p className="hero-description">From computer vision to multi-agent systems.<br className="desktop-break"/> I build AI that moves from research to production.</p><div className="hero-buttons"><MagneticLink href="#work" className="button button-lime">Explore my work<span className="button-plus" aria-hidden="true">+</span></MagneticLink><MagneticLink href={resumeUrl} download className="button button-outline"><Download size={17}/>Download resume</MagneticLink></div></Reveal></div><motion.div className="hero-diagram-panel" style={noMotion ? undefined : {y:heroY}} initial={reduce ? false : {opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{...spring,delay:.3}}><div className="diagram-panel-header"><span className="diagram-icon"><Cpu size={16}/></span><span>INTELLIGENCE, CONNECTED</span><span className="diagram-panel-number">01 / 04</span></div><AgentDiagram paused={noMotion}/><div className="diagram-panel-footer"><span>Multi-agent systems</span><span className="tiny-label">LangChain · LangGraph</span></div></motion.div></div><Reveal className="hero-footer"><span><span className="current-dot"/>Currently building at <strong>Arcitech.ai</strong></span><a href="#work" className="scroll-cue">Scroll to explore<span className="scroll-wheel" aria-hidden="true"><i/></span></a></Reveal></section>
    <div className={`ticker ${noMotion ? "is-paused" : ""}`} aria-label="Specialties: Multi-agent systems, Computer vision, Generative AI, Retrieval-augmented generation, MLOps"><div className="ticker-track" aria-hidden="true">{[0,1].map(repeat=><div className="ticker-set" key={repeat}>{["Multi-agent systems","Computer vision","Generative AI","RAG","MLOps"].map(text=><span key={text}>{text}<span className="ticker-star">✳</span></span>)}</div>)}</div></div>
    <section id="work" className="work-section section-wrap"><Reveal className="section-heading"><div><span className="eyebrow section-index">01 / SELECTED WORK</span><h2>Ideas, put to work<span className="lime-text">.</span></h2></div><p>Four projects across vision,<br/>language, retrieval, and machine learning.</p></Reveal><div className="projects-grid">{projects.map((project,index)=><ProjectCard key={project.id} project={project} index={index} paused={noMotion} onSelect={button=>{activeProjectTrigger.current=button;setSelected(project);}}/>)}</div><Reveal className="work-note"><Code2 size={16}/><p>Explore the code, architecture, and implementation on GitHub.</p><a href="https://github.com/romit-23" target="_blank" rel="noopener noreferrer"><Github size={16}/>romit-23</a></Reveal></section>
    <section id="experience" className="experience-section section-wrap"><Reveal className="section-heading"><div><span className="eyebrow section-index">02 / EXPERIENCE</span><h2>Research to real-world<span className="lime-text">.</span></h2></div><p>Building, shipping, and refining<br/>AI systems in practice.</p></Reveal><div className="timeline">{experience.map((job,index)=><Reveal key={job.role} className="timeline-row"><div className="timeline-meta"><span className={`timeline-point ${job.current ? "current" : ""}`}/><span className="job-period">{job.period}</span><span className="job-location">{job.place}</span>{job.current&&<span className="current-role">CURRENT ROLE</span>}</div><div className="job-content"><span className="job-number">0{index+1}</span><h3>{job.role}</h3><div className="company-name">{job.company}</div><ul>{job.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul><div className="job-tags">{job.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></Reveal>)}</div></section>
    <section id="toolkit" className="toolkit-section section-wrap"><Reveal className="section-heading"><div><span className="eyebrow section-index">03 / THE TOOLKIT</span><h2>The stack behind the systems<span className="lime-text">.</span></h2></div></Reveal><Reveal><Tabs value={skillTab} onValueChange={setSkillTab} className="skill-tabs"><TabsList className="skill-tab-list" aria-label="Technology categories">{toolkit.map(tab=><TabsTrigger value={tab.id} key={tab.id} className="skill-tab">{skillTab===tab.id&&<motion.span className="skill-tab-bg" layoutId="skill-tab" transition={noMotion ? {duration:0} : spring}/>}<span>{tab.name}</span></TabsTrigger>)}</TabsList>{toolkit.map(tab=><TabsContent value={tab.id} key={tab.id} className="skill-panel"><motion.div className="skill-groups" initial={noMotion ? false : {opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}>{tab.groups.map((group,index)=><div className="skill-group" key={group.label}><div className="skill-group-top"><span className="skill-group-number">0{index+1}</span>{index===0 ? <Cpu size={20}/> : index===1 ? <Layers size={20}/> : <Code2 size={20}/>}</div><h3>{group.label}</h3><div className="skill-chips">{group.skills.map(skill=><motion.span key={skill} whileHover={noMotion ? undefined : {y:-3}} transition={spring}>{skill}</motion.span>)}</div></div>)}</motion.div></TabsContent>)}</Tabs></Reveal></section>
    <section id="about" className="about-section section-wrap"><Reveal className="about-heading"><span className="eyebrow section-index">04 / A LITTLE CONTEXT</span><h2>Hi, I’m Romit<span className="lime-text">.</span></h2></Reveal><div className="about-grid"><Reveal className="about-copy"><p className="about-lead">An AI engineer based in Mumbai, working at the intersection of machine learning, language, and software.</p><p>My work spans production multi-agent systems, retrieval-augmented generation, and computer vision. At Arcitech.ai, I build and refine AI systems with a focus on orchestration, monitoring, latency, and reliable data.</p><div className="about-links"><a href="https://github.com/romit-23" target="_blank" rel="noopener noreferrer"><Github size={18}/>GitHub</a><a href="https://linkedin.com/in/romit-addagatla" target="_blank" rel="noopener noreferrer"><Linkedin size={18}/>LinkedIn</a></div></Reveal><Reveal className="education-card" delay={.08}><div className="education-top"><BookOpen size={23}/><span>2021 — 2025</span></div><span className="eyebrow">EDUCATION</span><h3>B.Tech in Artificial Intelligence and Machine Learning</h3><p>SIES Graduate School of Technology</p><div className="education-footer"><span>Artificial intelligence</span><span>Machine learning</span></div></Reveal></div></section>
    <section id="contact" className="contact-section section-wrap"><Reveal><div className="contact-top"><span className="eyebrow section-index">05 / GET IN TOUCH</span><Mail size={28}/></div><h2>Let’s make<br/>the next connection<span>.</span></h2><div className="contact-bottom"><MagneticLink href={`mailto:${email}`} className="contact-email">{email}</MagneticLink><div className="contact-actions"><button onClick={copyEmail} className="copy-button" aria-label="Copy email address">{copied ? <Check size={18}/> : <Copy size={18}/>}<span>{copied ? "Copied" : "Copy email"}</span></button><a href={resumeUrl} download><Download size={18}/>Resume</a></div></div><span role="status" className="copy-status">{copyError ? "Copy unavailable. You can select the email address or open the email link." : copied ? "Email address copied." : ""}</span></Reveal></section>
  </main>{selected&&<DialogContent className="project-dialog" onCloseAutoFocus={event=>{event.preventDefault();activeProjectTrigger.current?.focus();}}><DialogHeader><span className="eyebrow dialog-category">{selected.category}</span><DialogTitle>{selected.title}</DialogTitle><DialogDescription>{selected.description}</DialogDescription></DialogHeader><div className="dialog-visual"><ProjectVisual project={selected} paused={noMotion}/></div><div className="dialog-details"><h3>Inside the project</h3><ul>{selected.details.map(detail=><li key={detail}>{detail}</li>)}</ul></div><div className="dialog-tags">{selected.tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="dialog-links"><a className="button button-lime" href={selected.link} target="_blank" rel="noopener noreferrer"><Github size={17}/>View source on GitHub</a>{"publication" in selected&&<a className="button button-outline" href={selected.publication} target="_blank" rel="noopener noreferrer"><BookOpen size={17}/>IEEE publication</a>}</div></DialogContent>}</Dialog>
  <footer className="site-footer section-wrap"><a href="#home" className="footer-wordmark">romit<span>.</span></a><span>© {new Date().getFullYear()} Romit Addagatla</span><div className="footer-links"><a href="https://github.com/romit-23" target="_blank" rel="noopener noreferrer" aria-label="Romit on GitHub"><Github size={19}/></a><a href="https://linkedin.com/in/romit-addagatla" target="_blank" rel="noopener noreferrer" aria-label="Romit on LinkedIn"><Linkedin size={19}/></a><button className="motion-toggle" onClick={()=>setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume decorative animations" : "Pause decorative animations"}>{paused ? <Play size={13}/> : <Pause size={13}/>}<span>Motion {noMotion ? "off" : "on"}</span></button></div></footer><AnimatePresence>{copied&&<motion.div className="copy-toast" role="status" initial={noMotion ? false : {opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}><Check size={16}/>Email copied to clipboard</motion.div>}</AnimatePresence>
  </div></MotionConfig>;
}
