import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {capabilities, person, projects} from './data';
import Playground from './Playground';
import MotionFilm from './MotionFilm';
const IDCard = lazy(() => import('./IDCard'));
import './portfolio.css';
import './midnight.css';


const PointerObject = lazy(() => import('./PointerObject'));
const Sculpture = lazy(() => import('./Sculpture'));
const navigation = [['Work', '#work'], ['About', '#about'], ['Services', '#services'], ['Play', '#lab']];

function Arrow({size = 20}: {size?: number}) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6"/></svg>;
}

function usePreference(key: string, query: string) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? matchMedia(query).matches : ['true', 'dark', 'reduced'].includes(stored);
    } catch { return matchMedia(query).matches; }
  });
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => {
      try { if (localStorage.getItem(key) !== null) return; } catch {}
      setValue(media.matches);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [key, query]);
  return [value, () => {
    const next = !value;
    setValue(next);
    try { localStorage.setItem(key, String(next)); } catch {}
  }] as const;
}

function Hero({reduced}: {reduced: boolean}) {
  const [paused,setPaused]=useState(false),[shape,setShape]=useState(0);
  const hero=useRef<HTMLElement>(null);
  useEffect(()=>{
    const el=hero.current!;let frame=0;
    const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const p=reduced?0:Math.max(0,Math.min(1,-el.getBoundingClientRect().top/(el.offsetHeight-innerHeight)));el.style.setProperty('--progress',String(p));});};
    window.addEventListener('scroll',update,{passive:true});update();return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(frame);};
  },[reduced]);
  return <section className="hero" id="top" ref={hero} aria-labelledby="hero-heading">
    <div className="hero-stage">
      <div className="stage-grid" aria-hidden="true"/>
      <p className="hero-kicker">Independent developer / Bangalore, IN</p>
      <h1 id="hero-heading"><span className="name-full">VISWANATH<span className="name-k"> K.</span></span><span className="sr-only"> — Front-end & WordPress developer</span></h1>
      <div className="hero-object"><Suspense fallback={<div className="loading-orbit"/>}><Sculpture paused={paused} reduced={reduced} shape={shape}/></Suspense></div>
      <div className="hero-side">CREATIVE DEVELOPMENT<br/>SELECTED PORTFOLIO — 2026</div>
      <div className="hero-bottom"><p>Front-end. WordPress.<br/><b>Built to make an impression.</b></p><a href="#work">SCROLL TO EXPLORE <span>↓</span></a></div>
      <div className="hero-controls"><span className="label">Drag the object</span><button onClick={()=>setPaused(!paused)} disabled={reduced} aria-label={paused?'Play hero animation':'Pause hero animation'}>{paused?'▶':'Ⅱ'}</button>{['Knot','Crystal','Orbit'].map((label,i)=><button key={label} onClick={()=>setShape(i)} aria-pressed={shape===i}>{label}</button>)}</div>
    </div>
  </section>;
}


function App() {

  const [reduced, toggleMotion] = usePreference('vk-motion', '(prefers-reduced-motion: reduce)');
  const [project, setProject] = useState<typeof projects[number] | null>(null);
  const [menu, setMenu] = useState(false);
  const [copy, setCopy] = useState('');
  const projectDialog = useRef<HTMLDialogElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { document.documentElement.dataset.theme = 'dark'; }, []);
  useEffect(() => { document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'; }, [reduced]);
  useEffect(() => {
    if (project) projectDialog.current?.showModal();
    else projectDialog.current?.close();
  }, [project]);
  useEffect(() => {
    if (menu) menuDialog.current?.showModal();
    else menuDialog.current?.close();
  }, [menu]);
  useEffect(() => {
    document.body.style.overflow = menu || project ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu, project]);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));return()=>observer.disconnect();
  },[]);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(person.email); setCopy('Email copied.'); }
    catch { setCopy('You can copy the address directly.'); }
  }
  return <>
    <a href="#main" className="skip">Skip to content</a>
    <header className="masthead">
      <a href="#top" className="wordmark" aria-label="Viswanath K home">vk<span>/</span></a>
      <nav aria-label="Main navigation">{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="masthead-tools">
        <button type="button" className="motion-control" onClick={toggleMotion} aria-pressed={reduced}>{reduced ? 'Motion off' : 'Motion on'}</button>
        <a className="pill contact-link" href="#contact"><span className="status-dot"/>Let’s talk <Arrow size={14}/></a>
        <button type="button" className="mobile-menu" aria-haspopup="dialog" aria-expanded={menu} onClick={() => setMenu(true)}>Menu</button>
      </div>
    </header>
    <main className="site-shell" id="main">
      <Hero reduced={reduced}/>
      <div className="ticker" aria-hidden="true"><div>{Array.from({length:4},(_,i)=><span key={i}>DESIGN TO CODE <i>✦</i> MADE TO MOVE <i>✦</i> </span>)}</div></div>
      <section className="about panel" id="about">
        <p className="label"><span className="status-dot"/>About</p>
        <div><h2 className="reveal">Good design.<br/><em>Real impact.</em></h2>
          <p>I started in mechanical engineering and moved into front-end and WordPress development through hands-on work. At WeDesignTech, I built responsive sites with designers and marketers and mentored junior developers.</p>
          <dl className="about-facts"><div><dt>20+</dt><dd>Projects delivered</dd></div><div><dt>2023–2026</dt><dd>WeDesignTech · Team Lead</dd></div></dl>
          <a className="pill pill-outline" href="/Viswanath-K-Resume.pdf" download>Download résumé <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <Suspense fallback={<div className="id-placeholder"/>}><IDCard reduced={reduced}/></Suspense>
      <section className="work panel" id="work">
        <div className="section-top"><p className="label"><span className="status-dot"/>Portfolio</p><h2 className="chrome reveal">SELECTED<br/>WORK<span className="sup">(04)</span></h2></div>
        <div className="work-grid">{projects.map((item, index) => <article className="work-card reveal" key={item.id}>
          <button type="button" className="work-cover" aria-label={'View ' + item.name + ' project details'} onClick={() => setProject(item)}>
            <img src={'/media/work-' + (index + 1) + '.webp'} alt="" width="768" height="512" loading="lazy"/>
            <span className="work-cover-number">PROJECT / {item.id}</span><span className="cover-title">{item.name}</span><span className="work-cover-arrow"><Arrow size={24}/></span>
          </button>
          <div className="work-caption"><div><h3>{item.name}</h3><p>{item.category}</p></div><p className="work-description">{item.description}</p><a href={item.url} target="_blank" rel="noreferrer" aria-label={'Visit ' + item.name + ' website'}><Arrow/></a></div>
        </article>)}</div>
        <p className="cover-note">Illustrative project covers. Open a project for details or visit its live site.</p>
      </section>
      <section className="services panel" id="services">
        <div className="section-top"><p className="label">Services</p><h2 className="reveal">IDEAS IN.<br/><em>WEBSITES OUT.</em></h2></div>
        <div className="service-list">{capabilities.map(([title, detail], index) => <details key={title}><summary><span className="service-number">0{index + 1}</span><span>{title}</span><span className="service-plus" aria-hidden="true">+</span></summary><p>{detail}</p></details>)}</div>
      </section>
      <MotionFilm reduced={reduced}/><Playground/>
      <footer className="footer final-footer" id="contact">
        <div className="footer-top"><p className="label">GOOD CONVERSATIONS. GREAT THINGS.</p><a href="#top" className="top-circle" aria-label="Back to top">↑</a></div>
        <a className="footer-big-link" href={'mailto:'+person.email}><h2>LET’S TALK<span><Arrow size={100}/></span></h2></a>
        <div className="footer-detail"><p>Have something in mind?<br/><span>I’d love to hear about it.</span></p><div><a className="footer-email" href={'mailto:'+person.email}>{person.email}</a><button className="copy-button" type="button" aria-label="Copy email address" onClick={copyEmail}>Copy ↗</button><p className="copy-status" role="status">{copy}</p></div></div>
        <div className="footer-bottom"><a href="#top" className="footer-logo">Viswanath K<span>Front-end & WordPress developer</span></a><nav aria-label="Footer links"><a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="/Viswanath-K-Resume.pdf" download>Résumé ↓</a><a href="#work">Selected work ↗</a></nav><p>Bangalore, INDIA<br/>© {new Date().getFullYear()} VISWANATH K</p></div>
      </footer>
    </main>
    {!reduced && !menu && !project && <Suspense fallback={null}><PointerObject/></Suspense>}
    <dialog className="project-dialog" ref={projectDialog} onCancel={() => setProject(null)} aria-labelledby="project-heading">
      {project && <div className="dialog-body"><div className="dialog-top"><span className="label">{project.category}</span><button type="button" className="pill pill-outline" onClick={() => setProject(null)} autoFocus>Close <span aria-hidden="true">×</span></button></div>
        <h2 id="project-heading">{project.name}</h2><p>{project.description}</p><h3>My contribution</h3><p>{project.contribution}</p><p className="project-stack">{project.stack.join(' · ')}</p>
        <a className="pill dialog-visit" href={project.url} target="_blank" rel="noreferrer">Visit website <Arrow size={16}/></a>
      </div>}
    </dialog>
    <dialog className="menu-dialog" ref={menuDialog} onCancel={() => setMenu(false)} aria-label="Mobile navigation">
      <div className="dialog-top"><span className="wordmark">vk<span>/</span></span><button type="button" className="pill pill-outline" onClick={() => setMenu(false)} autoFocus>Close ×</button></div>
      <nav aria-label="Mobile navigation">{[...navigation, ['Contact', '#contact']].map(([name, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{name}<Arrow/></a>)}</nav>
    </dialog>
  </>;
}
createRoot(document.getElementById('root')!).render(<App/>);
