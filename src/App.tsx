import { useEffect, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { NAV, SITE } from './data'
import { Logo, pad } from './ui'
import { Home, ServicesPage, WorkPage, CasePage, AboutPage, ContactPage, PrivacyPage, NotFound } from './pages'
import { AdminPage } from './admin'
import { Assistant } from './assistant'

const navText = 'text-white/90 hover:text-white text-sm font-medium'

/* ---------- Header: stays at the top of every page ---------- */

function Header() {
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus whenever the page changes.
  useEffect(() => {
    setOpen(null)
    setMobileOpen(false)
  }, [location.pathname, location.hash])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-[#17110E]/85 backdrop-blur-xl border-b border-white/10' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Main" className={`relative w-full ${pad} ${scrolled ? 'py-3' : 'py-4 sm:py-5'} transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
            <Logo />
            <span className="text-white text-lg sm:text-xl font-medium tracking-tight">{SITE.name}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) =>
              item.items ? (
                <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)} onMouseLeave={() => setOpen(null)}>
                  <button
                    type="button"
                    aria-expanded={open === item.label}
                    onClick={() => setOpen(open === item.label ? null : item.label)}
                    className={`${navText} flex items-center gap-1 py-2`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open === item.label ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {open === item.label && (
                    <div className="liquid-glass animate-dropdown !absolute top-full left-0 rounded-xl py-3 px-2 min-w-[190px] shadow-xl bg-[#17110E]/70 !backdrop-blur-xl">
                      {item.items.map(([label, to]) => (
                        <Link key={label} to={to} className="block px-3 py-2 text-white/80 hover:text-white text-sm rounded-lg hover:bg-white/5">
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={item.label} to={item.to} className={({ isActive }) => `${navText} py-2 ${isActive ? 'underline underline-offset-8' : ''}`}>
                  {item.label}
                </NavLink>
              ),
            )}
          </div>

          <div className="hidden md:flex items-center gap-5">
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className={navText}>
              Call us
            </a>
            <Link to="/contact" className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium">
              Start a project
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden relative w-10 h-10 text-white"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Menu className={`absolute inset-0 m-auto w-6 h-6 transition-all duration-300 ${mobileOpen ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
            <X className={`absolute inset-0 m-auto w-6 h-6 transition-all duration-300 ${mobileOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden absolute left-5 right-5 top-full mt-2 max-h-[calc(100vh-6rem)] overflow-y-auto bg-[#2C221C]/95 backdrop-blur-xl rounded-2xl p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-3 invisible pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-4">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link to={item.to} className="block text-white text-base font-medium">
                  {item.label}
                </Link>
                {item.items && (
                  <div className="mt-2 pl-4 flex flex-col">
                    {item.items.map(([label, to]) => (
                      <Link key={label} to={to} className="py-1.5 text-white/70 hover:text-white text-sm">
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between gap-4">
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className={navText}>
              Call us
            </a>
            <Link to="/contact" className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium">
              Start a project
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

/* ---------- Footer ---------- */

const FOOT: [string, [string, string][]][] = [
  ['Studio', [['Services', '/services'], ['Work', '/work'], ['About', '/about'], ['Contact', '/contact']]],
  ['Services', [['Social media', '/services#social-media'], ['Paid advertising', '/services#paid-advertising'], ['Search and SEO', '/services#seo']]],
]

function Footer() {
  return (
    <footer className={`${pad} pt-16 pb-10 border-t border-white/10`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-medium tracking-tight">{SITE.name}</span>
            </Link>
            <p className="mt-5 text-sm text-white/60 leading-relaxed max-w-[30ch]">{SITE.tagline}</p>
          </div>
          {FOOT.map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-medium">{group}</h3>
              <ul className="mt-4 grid gap-2.5">
                {items.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-medium">Contact</h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-white/60">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-white break-words">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.whatsapp} target="_blank" rel="noopener" className="hover:text-white">
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.address}</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-white/15 flex flex-wrap justify-between gap-3 text-sm text-white/50">
          <span>
            © {new Date().getFullYear()} {SITE.name}
          </span>
          <Link to="/privacy" className="hover:text-white">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

/* ---------- Scroll to the top, or to a #section, when the page changes ---------- */

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }))
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="page-bg text-white overflow-x-hidden min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-full">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<CasePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Assistant />
      </div>
    </BrowserRouter>
  )
}