import { useState, useEffect, useRef } from 'react'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('yg-theme') || 'dark')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 })

  // Theme logic
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('yg-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Scroll reveal logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('vis'), i * 70)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Cursor logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    let animationFrameId: number
    const loop = () => {
      setRingPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.13,
        y: prev.y + (mousePos.y - prev.y) * 0.13
      }))
      animationFrameId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(animationFrameId)
  }, [mousePos])

  // Active nav logic
  const [activeSection, setActiveSection] = useState('')
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let current = ''
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        if (window.scrollY >= sectionTop - 130) {
          current = section.id
        }
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="fixed w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-screen transition-transform duration-100 hidden md:block"
        style={{ left: mousePos.x - 4, top: mousePos.y - 4 }}
      />
      <div 
        ref={cursorRingRef}
        className="fixed w-8 h-8 border border-accent/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200 hidden md:block"
        style={{ left: ringPos.x, top: ringPos.y }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[200] flex justify-between items-center px-8 md:px-16 h-16 border-b border-white/7 bg-[var(--nav-bg)] backdrop-blur-3xl transition-colors duration-350">
        <a href="#" className="font-syne font-extrabold text-xl tracking-tight text-[var(--text)]">
          Y<span className="text-accent">.</span>
        </a>
        
        <ul className="hidden md:flex gap-10">
          {['about', 'skills', 'experience', 'projects', 'contact'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item}`}
                className={`font-dm-mono text-[0.75rem] uppercase tracking-widest transition-colors duration-200 relative group ${activeSection === item ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 right-0 h-[1px] bg-accent transition-transform duration-250 origin-left ${activeSection === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-[46px] h-[26px] bg-[var(--tog-bg)] border border-white/14 rounded-full cursor-pointer relative transition-colors duration-300"
            aria-label="Toggle theme"
          >
            <span className="absolute top-1/2 left-[5px] -translate-y-1/2 text-[11px] pointer-events-none">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
            <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-[var(--tog-knob)] transition-transform duration-300 ${theme === 'light' ? 'translate-x-[20px]' : ''}`} />
          </button>
          
          <a href="#contact" className="hidden md:block font-dm-mono text-[0.74rem] tracking-widest px-4 py-1.5 border border-accent text-accent rounded hover:bg-accent hover:text-white transition-all duration-200">
            hire me
          </a>

          <button 
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-[2px] bg-[var(--text)] rounded transition-all duration-300 ${isMenuOpen ? 'translate-y-[8px] rotate-45' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[var(--text)] rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[var(--text)] rounded transition-all duration-300 ${isMenuOpen ? '-translate-y-[8px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-16 left-0 right-0 bg-[var(--nav-bg)] backdrop-blur-3xl border-b border-white/7 px-6 z-[190] flex flex-col transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        {['about', 'skills', 'experience', 'projects', 'contact'].map((item) => (
          <a 
            key={item}
            href={`#${item}`}
            onClick={() => setIsMenuOpen(false)}
            className="font-dm-mono text-[0.85rem] text-[var(--muted)] tracking-widest py-4 border-b border-white/7 last:border-0 hover:text-accent transition-colors"
          >
            // {item}
          </a>
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center relative px-8 md:px-16 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent_75%)] pointer-events-none" />
        <div className="absolute w-[min(650px,80vw)] h-[min(650px,80vw)] bg-[radial-gradient(circle,rgba(108,99,255,0.13)_0%,transparent_70%)] top-[-10%] right-[-5%] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute w-[min(450px,60vw)] h-[min(450px,60vw)] bg-[radial-gradient(circle,rgba(0,217,160,0.09)_0%,transparent_70%)] bottom-[5%] left-[5%] rounded-full animate-pulse pointer-events-none delay-[-3s] duration-[9s]" />
        
        <div className="relative z-10 max-w-[860px] w-full">
          <div className="font-dm-mono text-[0.72rem] tracking-[0.14em] text-accent2 mb-6 flex items-center gap-2.5">
            <span className="w-7 h-[1px] bg-accent2" />
            <div className="w-1.5 h-1.5 bg-accent2 rounded-full animate-ping" />
            available for opportunities
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(3rem,10vw,7.5rem)] leading-[0.92] tracking-[-0.04em] mb-[0.2em]">
            <div>YOGESH</div>
            <div className="outline-text">FULLSTACK</div>
          </h1>
          <p className="font-syne text-[clamp(0.9rem,2vw,1.2rem)] font-normal text-[var(--muted)] my-4 md:my-6">
            <strong className="text-accent font-semibold">Full Stack Developer</strong> — web · mobile · cloud
          </p>
          <p className="text-[clamp(0.88rem,1.5vw,0.98rem)] text-[var(--muted)] max-w-[520px] mb-10 leading-relaxed">
            1.5 years building end-to-end products with React, Next.js, NestJS, AWS, and React Native. From pixel-perfect UIs to production cloud infrastructure — I own the full stack.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="font-dm-mono text-[0.8rem] tracking-wider px-7 py-3.5 bg-accent text-white rounded transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(108,99,255,0.35)]">
              View my work →
            </a>
            <a href="#contact" className="font-dm-mono text-[0.8rem] tracking-wider px-7 py-3.5 bg-transparent text-[var(--text)] border border-white/14 rounded transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5">
              Let's connect
            </a>
          </div>
        </div>

        <div className="hidden lg:flex absolute right-16 bottom-16 flex-col gap-7 z-10">
          {[
            { num: '1.5+', label: 'YRS EXP' },
            { num: '10+', label: 'TECHNOLOGIES' },
            { num: 'AWS', label: 'CLOUD INFRA' }
          ].map((stat) => (
            <div key={stat.label} className="text-right pr-4 border-right-2 border-accent">
              <div className="font-syne text-[2rem] font-extrabold text-[var(--text)] leading-none">{stat.num}</div>
              <div className="font-dm-mono text-[0.64rem] text-[var(--muted)] tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-white/7" />

      {/* About Section */}
      <section id="about" className="bg-[var(--surface)] py-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-20 items-center reveal">
          <div className="flex items-center justify-center relative h-[350px]">
            <div className="w-[250px] h-[250px] rounded-full border border-white/14 flex items-center justify-center relative">
              <div className="absolute -inset-[18px] rounded-full border border-dashed border-white/7 animate-[spin_22s_linear_infinite]" />
              <div className="absolute -inset-[48px] rounded-full border border-dashed border-accent/12 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="font-syne text-[4.5rem] font-extrabold text-accent tracking-tighter leading-none">YK</div>
              <div className="absolute w-[9px] h-[9px] bg-accent2 rounded-full top-[12px] left-1/2 -ml-1 shadow-[0_0_8px_var(--accent2)] origin-[4px_113px] animate-[orbit_7s_linear_infinite]" />
              <div className="absolute w-[9px] h-[9px] bg-accent rounded-full top-[12px] left-1/2 -ml-1 shadow-[0_0_8px_var(--accent)] origin-[4px_113px] animate-[orbit_13s_linear_infinite_reverse]" />
            </div>
            <div className="absolute bottom-2.5 right-0 md:right-[8%] bg-[var(--card2)] border border-white/14 rounded-xl p-4 text-center shadow-2xl">
              <div className="font-syne text-3xl font-extrabold text-accent leading-none">1.5</div>
              <div className="font-dm-mono text-[0.6rem] text-[var(--muted)] tracking-widest mt-1">YEARS IN<br/>FULL STACK</div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-dm-mono text-[0.7rem] tracking-[0.16em] text-accent uppercase">// about me</div>
            <h2 className="font-syne font-bold text-[clamp(1.75rem,4vw,2.8rem)] tracking-tight leading-none mb-3">Who I am</h2>
            <p className="text-[var(--muted)] text-[0.94rem]">I'm Yogesh, a full stack developer based in Chennai. I work across the entire stack — from crafting responsive React & Next.js interfaces to architecting NestJS APIs, designing database schemas, and deploying scalable systems on AWS.</p>
            <p className="text-[var(--muted)] text-[0.94rem]">In 1.5 years I've shipped production apps with real users, covering web, mobile (React Native), and cloud infrastructure. I care about clean code, performance, and building things that actually work.</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {['React.js', 'Next.js', 'NestJS', 'TypeScript', 'AWS', 'React Native', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'].map(chip => (
                <span key={chip} className="font-dm-mono text-[0.7rem] px-3 py-1 border border-white/14 rounded text-[var(--muted)] tracking-wider hover:border-accent hover:text-accent hover:bg-accent/5 transition-all cursor-default">{chip}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t border-white/7" />

      {/* Skills Section */}
      <section id="skills" className="py-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="font-dm-mono text-[0.7rem] tracking-[0.16em] text-accent uppercase mb-3 reveal">// tech stack</div>
          <h2 className="font-syne font-bold text-[clamp(1.75rem,4vw,2.8rem)] tracking-tight leading-none mb-3 reveal">Skills & Technologies</h2>
          <p className="text-[var(--muted)] max-w-[500px] mb-14 text-[0.94rem] reveal">A curated toolkit built through real-world projects — not just tutorials.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            {[
              { title: 'Frontend', icon: '⚛', color: 'accent', tags: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5', 'UI/UX', 'TypeScript'] },
              { title: 'Backend', icon: '⚙', color: 'accent2', tags: ['NestJS', 'REST APIs', 'WebSockets', 'JWT Auth', 'Auth0'] },
              { title: 'Database', icon: '🗄', color: 'accent3', tags: ['MongoDB', 'PostgreSQL', 'Prisma ORM', 'Redis', 'DB Design', 'Optimization'] },
              { title: 'Cloud — AWS', icon: '☁', color: 'yellow-400', tags: ['EC2', 'S3', 'RDS', 'CloudFront', 'VPC', 'Beanstalk', 'Amplify', 'ElastiCache', 'IAM'] },
              { title: 'Mobile', icon: '📱', color: 'blue-400', tags: ['React Native', 'Expo', 'Push Notifications', 'App Store', 'Play Store'] },
              { title: 'Tools & Others', icon: '🔧', color: 'purple-400', tags: ['Git', 'Vercel', 'Postman', 'DNS', 'JavaScript', 'Hostinger'] }
            ].map((skill) => (
              <div key={skill.title} className="bg-[var(--card)] border border-white/7 rounded-xl p-6 transition-all hover:border-white/14 hover:-translate-y-1 hover:shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-accent2 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4 bg-white/5`}>{skill.icon}</div>
                <h3 className="font-syne font-semibold text-[0.9rem] mb-3 text-[var(--text)]">{skill.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map(tag => (
                    <span key={tag} className="font-dm-mono text-[0.64rem] px-2 py-0.5 bg-white/5 border border-white/7 rounded text-[var(--muted)]">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-t border-white/7" />

      {/* Experience Section */}
      <section id="experience" className="bg-[var(--surface)] py-24 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="font-dm-mono text-[0.7rem] tracking-[0.16em] text-accent uppercase mb-3 reveal">// work history</div>
          <h2 className="font-syne font-bold text-[clamp(1.75rem,4vw,2.8rem)] tracking-tight leading-none mb-3 reveal">Experience</h2>
          <p className="text-[var(--muted)] mb-14 text-[0.94rem] reveal">Building production-grade systems in a short but focused tenure.</p>
          
          <div className="relative pl-8 border-l border-gradient-to-b from-accent to-accent/10 reveal">
            <div className="relative pb-14 pl-10">
              <div className="absolute -left-[37px] top-1.5 w-[11px] h-[11px] rounded-full bg-accent border-2 border-[var(--bg)] shadow-[0_0_0_3px_rgba(108,99,255,0.2)]" />
              <div className="flex justify-between items-start flex-wrap gap-2 mb-1.5">
                <h3 className="font-syne text-[1.1rem] font-bold text-[var(--text)]">Full Stack Developer</h3>
                <span className="font-dm-mono text-[0.68rem] text-accent2 tracking-wider px-2.5 py-0.5 border border-accent2/25 rounded">2023 — PRESENT</span>
              </div>
              <div className="font-dm-mono text-[0.78rem] text-accent mb-4 tracking-wider">// full-time · 1 year 6 months</div>
              <ul className="flex flex-col gap-1.5 text-[var(--muted)] text-[0.9rem]">
                {[
                  'Built and deployed full-stack web applications using React.js, Next.js, and NestJS with RESTful APIs and WebSocket integrations.',
                  'Architected cloud infrastructure on AWS — EC2, S3, RDS, CloudFront, Elastic Beanstalk, and ElastiCache.',
                  'Developed cross-platform mobile apps with React Native and Expo; handled end-to-end submissions for stores.',
                  'Designed and optimized databases using MongoDB, PostgreSQL, and Prisma ORM; implemented Redis caching.',
                  'Implemented secure authentication flows using Auth0 and JWT across production applications.',
                  'Managed DNS configurations, Vercel deployments, and CI/CD pipelines for reliable delivery.'
                ].map(item => (
                  <li key={item} className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-accent before:text-[0.72rem] before:top-0.5">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t border-white/7" />

      {/* Projects Section */}
      <section id="projects" className="py-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="font-dm-mono text-[0.7rem] tracking-[0.16em] text-accent uppercase mb-3 reveal">// portfolio</div>
          <h2 className="font-syne font-bold text-[clamp(1.75rem,4vw,2.8rem)] tracking-tight leading-none mb-3 reveal">Projects</h2>
          <p className="text-[var(--muted)] mb-14 text-[0.94rem] reveal">Real-world applications — designed, engineered, and shipped to production.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 reveal">
            <div className="bg-[var(--card)] border border-white/7 rounded-xl p-7 transition-all hover:border-accent hover:-translate-y-1 hover:shadow-2xl md:col-span-2 flex flex-col md:flex-row gap-10">
              <div className="flex-1 flex flex-col gap-3">
                <div className="font-dm-mono text-[0.63rem] text-[var(--dim)] tracking-[0.12em]">01 — FEATURED</div>
                <h3 className="font-syne text-[1.5rem] font-bold text-[var(--text)] tracking-tight">Real-Time Collaboration Platform</h3>
                <p className="text-[var(--muted)] text-[0.87rem] leading-relaxed flex-1">Full-stack collaborative workspace with Next.js frontend and NestJS backend. Live WebSocket rooms, persistent sessions via PostgreSQL + Prisma, Redis pub/sub, and full AWS deployment behind CloudFront CDN with S3 asset hosting.</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Next.js', 'NestJS', 'WebSockets', 'PostgreSQL', 'Prisma', 'Redis', 'AWS'].map(t => (
                    <span key={t} className="font-dm-mono text-[0.63rem] px-2 py-0.5 bg-accent/8 border border-accent/20 rounded text-accent">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2.5 mt-4">
                  <a href="#" className="font-dm-mono text-[0.68rem] text-[var(--muted)] tracking-wider border border-white/7 rounded px-3 py-1 hover:border-white/14 hover:text-[var(--text)] transition-all">↗ Live Demo</a>
                  <a href="#" className="font-dm-mono text-[0.68rem] text-[var(--muted)] tracking-wider border border-white/7 rounded px-3 py-1 hover:border-white/14 hover:text-[var(--text)] transition-all">⌥ GitHub</a>
                </div>
              </div>
            </div>
            
            {[
              { num: '02', title: 'E-Commerce Mobile App', desc: 'Cross-platform React Native app with Expo, Auth0 login, push notifications, and a NestJS + MongoDB Atlas backend.', tech: ['React Native', 'Expo', 'NestJS', 'MongoDB', 'Auth0'] },
              { num: '03', title: 'SaaS Dashboard & API', desc: 'Multi-tenant SaaS platform with a Tailwind UI dashboard, NestJS REST API, IAM-secured AWS endpoints, and SES.', tech: ['Next.js', 'Tailwind', 'NestJS', 'AWS SES', 'CloudWatch'] }
            ].map(proj => (
              <div key={proj.title} className="bg-[var(--card)] border border-white/7 rounded-xl p-7 transition-all hover:border-accent hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-3">
                <div className="font-dm-mono text-[0.63rem] text-[var(--dim)] tracking-[0.12em]">{proj.num}</div>
                <h3 className="font-syne text-[1.18rem] font-bold text-[var(--text)] tracking-tight">{proj.title}</h3>
                <p className="text-[var(--muted)] text-[0.87rem] leading-relaxed flex-1">{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tech.map(t => (
                    <span key={t} className="font-dm-mono text-[0.63rem] px-2 py-0.5 bg-accent/8 border border-accent/20 rounded text-accent">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2.5 mt-4">
                  <a href="#" className="font-dm-mono text-[0.68rem] text-[var(--muted)] tracking-wider border border-white/7 rounded px-3 py-1 hover:border-white/14 hover:text-[var(--text)] transition-all">↗ Link</a>
                  <a href="#" className="font-dm-mono text-[0.68rem] text-[var(--muted)] tracking-wider border border-white/7 rounded px-3 py-1 hover:border-white/14 hover:text-[var(--text)] transition-all">⌥ GitHub</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-t border-white/7" />

      {/* Contact Section */}
      <section id="contact" className="bg-[var(--surface)] py-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start reveal">
          <div>
            <div className="font-dm-mono text-[0.7rem] tracking-[0.16em] text-accent uppercase mb-3">// contact</div>
            <h2 className="font-syne font-bold text-[clamp(1.75rem,4vw,2.8rem)] tracking-tight leading-none mb-4">Let's build<br/>something great</h2>
            <p className="text-[var(--muted)] text-[0.92rem] mb-10 max-w-[360px]">Open to full-time roles, freelance projects, and interesting collaborations. Let's talk.</p>
            <div className="flex flex-col gap-3">
              {[
                { lbl: 'EMAIL', val: 'yogesh@example.com', ico: '✉', href: 'mailto:yogesh@example.com' },
                { lbl: 'LINKEDIN', val: 'linkedin.com/in/yogesh', ico: 'in', href: 'https://linkedin.com' },
                { lbl: 'GITHUB', val: 'github.com/yogesh', ico: 'gh', href: 'https://github.com' }
              ].map(item => (
                <a key={item.lbl} href={item.href} className="flex items-center gap-4 p-4 border border-white/7 rounded-xl hover:border-accent hover:bg-accent/5 transition-all">
                  <div className="w-[38px] h-[38px] rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-dm-mono font-medium text-accent text-[0.82rem] flex-shrink-0">{item.ico}</div>
                  <div>
                    <div className="font-dm-mono text-[0.63rem] text-[var(--dim)] tracking-widest mb-0.5">{item.lbl}</div>
                    <div className="text-[0.87rem] text-[var(--text)]">{item.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-dm-mono text-[0.66rem] text-[var(--muted)] tracking-widest uppercase">Your Name</label>
              <input type="text" className="bg-[var(--card)] border border-white/7 rounded p-3 text-[var(--text)] font-dm-sans text-[0.9rem] outline-none focus:border-accent transition-colors" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-dm-mono text-[0.66rem] text-[var(--muted)] tracking-widest uppercase">Email Address</label>
              <input type="email" className="bg-[var(--card)] border border-white/7 rounded p-3 text-[var(--text)] font-dm-sans text-[0.9rem] outline-none focus:border-accent transition-colors" placeholder="john@company.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-dm-mono text-[0.66rem] text-[var(--muted)] tracking-widest uppercase">Message</label>
              <textarea rows={5} className="bg-[var(--card)] border border-white/7 rounded p-3 text-[var(--text)] font-dm-sans text-[0.9rem] outline-none focus:border-accent transition-colors resize-vertical" placeholder="Tell me about your project..." />
            </div>
            <button className="w-fit font-dm-mono text-[0.8rem] tracking-wider px-7 py-3.5 bg-accent text-white rounded transition-all hover:shadow-[0_10px_28px_rgba(108,99,255,0.35)]">Send message →</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 md:px-16 flex flex-wrap justify-between items-center gap-2 border-t border-white/7 bg-[var(--bg)]">
        <div className="font-dm-mono text-[0.68rem] text-[var(--dim)] tracking-wider">© 2024 Yogesh · Full Stack Developer · Chennai, India</div>
        <div className="font-dm-mono text-[0.68rem] text-[var(--dim)] tracking-wider">Built with <span className="text-accent">♥</span> — Next.js · NestJS · AWS</div>
      </footer>
    </div>
  )
}

export default App
