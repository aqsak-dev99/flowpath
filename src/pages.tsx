import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { CASES, CHANNELS, FACTS, FAQS, ROLES, SERVICES, SITE, STEPS, TEAM, VALUES } from './data'
import {
  AUTOHUB_URL,
  ContactForm,
  Cover,
  CtaBand,
  Faq,
  Film,
  Heading,
  LineChart,
  Metrics,
  PageHeader,
  Section,
  ServiceVisual,
  card,
  eyebrowCls,
  glassBtn,
  pad,
  usePageTitle,
  whiteBtn,
} from './ui'

/* ============================== Home ============================== */

function Hero() {
  return (
    <section className="relative h-screen min-h-[620px] w-full overflow-hidden flex flex-col">
      <video className="absolute inset-0 w-full h-full object-cover" src={SITE.video} autoPlay loop muted playsInline aria-hidden="true" />
      {/* Darkens the centre so the headline reads clearly over the film, then fades into the page */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_65%_at_50%_45%,rgba(15,11,9,0.82)_0%,rgba(15,11,9,0.4)_60%,rgba(15,11,9,0.08)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#1d1511]" aria-hidden="true" />
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 pt-24">
        <div className="text-center max-w-4xl">
          <p className={`${eyebrowCls} mb-6`}>Digital marketing studio · Lahore</p>
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1] tracking-[-0.035em]">
            Reach the right people. <span className="text-[#c9bfb5]">Skip the guesswork.</span>
          </h1>
          <p className="text-[#ece5dd] text-base md:text-lg leading-relaxed max-w-xl mx-auto mt-7 sm:mt-8">
            Flowpath plans, makes and runs your marketing across every channel, so your team spends less time guessing and more time growing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link to="/contact" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-white/90">
              Start a project
            </Link>
            <Link to="/work" className="px-5 sm:px-6 py-2.5 sm:py-3 liquid-glass rounded-full text-white text-sm font-semibold hover:bg-white/10">
              See our work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Flow() {
  const ys = [50, 150, 250, 350]
  return (
    <Section>
      <Heading
        lead="Four channels."
        rest="One path to your customer."
        lede="Most brands run each channel on its own. We plan them together, so the ad, the search result and the follow-up message all say the same thing."
      />
      <div className={`hidden md:block ${card} p-6 lg:p-10`}>
        <svg viewBox="0 0 1000 400" className="block w-full h-auto" role="img" aria-label="Diagram: four channels feed one shared plan, which leads to customers">
          {ys.map((y, i) => (
            <g key={CHANNELS[i]}>
              <path d={`M270 ${y} C 380 ${y}, 380 200, 470 200`} fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="2" />
              <path className="flow-line" d={`M270 ${y} C 380 ${y}, 380 200, 470 200`} fill="none" stroke="#F2B632" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: `${-i * 0.6}s` }} />
              <rect x="10" y={y - 26} width="260" height="52" rx="26" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.25" />
              <text x="140" y={y + 6} textAnchor="middle" fill="white" fontSize="17" fontWeight="500">
                {CHANNELS[i]}
              </text>
            </g>
          ))}
          <path d="M610 200 H 770" fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="6" />
          <path className="flow-line" d="M610 200 H 770" fill="none" stroke="#F2B632" strokeWidth="6" strokeLinecap="round" />
          <rect x="470" y="160" width="140" height="80" rx="40" fill="white" />
          <text x="540" y="206" textAnchor="middle" fill="#17110E" fontSize="18" fontWeight="600">
            One plan
          </text>
          <rect x="770" y="160" width="220" height="80" rx="40" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.5" />
          <text x="880" y="206" textAnchor="middle" fill="white" fontSize="18" fontWeight="600">
            Your customers
          </text>
        </svg>
      </div>
      <div className={`md:hidden ${card} p-6`}>
        <ul className="flex flex-wrap gap-2">
          {CHANNELS.map((channel) => (
            <li key={channel} className="rounded-full border border-white/25 px-4 py-2 text-sm">
              {channel}
            </li>
          ))}
        </ul>
        <div className="my-4 ml-6 h-8 border-l-2 border-dashed border-white/40" aria-hidden="true" />
        <span className="inline-block rounded-full bg-white text-[#17110E] px-5 py-2.5 text-sm font-semibold">One plan</span>
        <div className="my-4 ml-6 h-8 border-l-2 border-dashed border-white/40" aria-hidden="true" />
        <span className="inline-block rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold">Your customers</span>
      </div>
    </Section>
  )
}

function ServiceCards() {
  return (
    <Section>
      <Heading
        lead="What we do."
        rest="Three services that work as one."
        action={
          <Link to="/services" className={glassBtn}>
            All services
          </Link>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICES.map((service, i) => (
          <Link key={service.id} to={`/services#${service.id}`} className={`group ${card} p-6 lg:p-8 flex flex-col transition-colors duration-300 hover:bg-white/[0.07]`}>
            <ServiceVisual kind={service.visual} caption={service.caption} />
            <p className="mt-7 text-xs font-semibold tracking-[0.12em] text-[#F2B632]">0{i + 1}</p>
            <h3 className="mt-2 text-2xl tracking-[-0.01em] flex items-center justify-between gap-3">
              {service.name}
              <ArrowUpRight className="w-5 h-5 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" aria-hidden="true" />
            </h3>
            <p className="mt-3 text-[#b9afa6] text-[15px] leading-relaxed">{service.short}</p>
          </Link>
        ))}
      </div>
    </Section>
  )
}

function Statement() {
  return (
    <section className="relative isolate overflow-hidden">
      <Film className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative bg-[#140f0c] mix-blend-darken py-16 md:py-24 flex items-center justify-center">
        <p className="text-white text-center font-bold leading-[0.9] tracking-[-0.045em] text-[19vw] md:text-[14vw]">
          Seen.
          <br />
          Clicked.
          <br />
          Remembered.
        </p>
      </div>
    </section>
  )
}

function FeaturedResult() {
  const featured = CASES[0]
  return (
    <Section>
      <Heading
        eyebrow="Case study"
        lead={featured.duration}
        rest={`with ${featured.client}.`}
        lede={featured.brief}
        action={
          <Link to={`/work/${featured.slug}`} className={glassBtn}>
            Read the case study
          </Link>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-center">
        <LineChart {...featured.chart} />
        <Metrics items={featured.metrics} />
      </div>
    </Section>
  )
}

function WorkRows() {
  return (
    <ul className="border-b border-white/20">
      {CASES.map((item) => (
        <li key={item.slug} className="border-t border-white/20">
          <Link
            to={`/work/${item.slug}`}
            className="group grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr_1.2fr_auto] items-baseline gap-1 md:gap-8 py-7 md:py-9 transition-colors duration-300 hover:bg-white/[0.04] md:px-4 md:-mx-4 rounded-2xl"
          >
            <span className="text-3xl md:text-4xl tracking-[-0.02em]">{item.client}</span>
            <span className="text-white/60 text-[15px]">{item.did}</span>
            <span className="text-[15px] font-medium">{item.result}</span>
            <ArrowUpRight className="hidden md:block w-6 h-6 self-center text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Voices() {
  const quotes = CASES.filter((item) => item.quote).map((item) => item.quote!)
  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {quotes.map((quote) => (
          <figure key={quote.name}>
            <blockquote className="text-2xl md:text-3xl leading-[1.25] tracking-[-0.01em]">“{quote.text}”</blockquote>
            <figcaption className="mt-6 text-[15px]">
              <span className="font-medium">{quote.name}</span>
              <span className="block text-white/60">{quote.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

function ClientStrip() {
  return (
    <section aria-label="Clients" className={`${pad} border-y border-white/10`}>
      <div className="mx-auto max-w-6xl py-6 flex flex-wrap items-center justify-between gap-x-10 gap-y-3">
        <span className="text-sm text-[#a99d92]">Trusted by growing brands in Lahore</span>
        <ul className="flex flex-wrap gap-x-10 gap-y-2 text-lg md:text-xl font-medium text-[#e6ded6]">
          {CASES.map((item) => (
            <li key={item.slug}>
              <Link to={`/work/${item.slug}`} className="hover:text-white">
                {item.client}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Shows AutoHub, the AI assistant that answers contact-form enquiries in four languages. */
function AskSection() {
  return (
    <Section>
      <div className={`${card} !rounded-[2rem] p-7 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center`}>
        <div>
          <p className={`${eyebrowCls} mb-4`}>Meet AutoHub</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.08] tracking-[-0.025em]">
            Every enquiry answered fast, <span className="text-[#b9afa6]">in your language.</span>
          </h2>
          <p className="mt-5 text-[#b9afa6] text-base md:text-[17px] leading-relaxed max-w-[44ch]">
            Our AI assistant drafts a reply to every message in English, Urdu, Roman Urdu or Arabic, and hands it to a person when it isn't sure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className={whiteBtn}>
              Try a sample enquiry
            </Link>
            <a href={AUTOHUB_URL} target="_blank" rel="noreferrer" className={glassBtn}>
              Watch AutoHub work
            </a>
          </div>
        </div>
        <figure className="rounded-3xl bg-[#0d0a08] border border-white/10 p-5 md:p-6">
          <figcaption className="pb-4 mb-4 border-b border-white/10 text-sm font-semibold flex items-center justify-between">
            <span>New enquiry</span>
            <span className="text-xs font-medium text-[#a99d92]">Example</span>
          </figcaption>
          <div className="grid gap-3 text-[15px] leading-relaxed">
            <p className="justify-self-end max-w-[85%] rounded-[1.1rem] rounded-br-md bg-[#2b211b] px-4 py-3">
              Salam, hamari bakery ke liye Instagram content aur ads chahiye. Kab start kar sakte hain?
            </p>
            <p className="justify-self-start max-w-[85%] rounded-[1.1rem] rounded-bl-md bg-white text-[#15100c] px-4 py-3">
              Walaikum assalam! Zaroor. Hum is hafte ek chhoti call rakh sakte hain taake aap ke budget aur goals samajh sakein.
            </p>
            <p className="mt-1 text-xs text-[#a99d92]">Drafted by AutoHub · checked by the team before sending</p>
          </div>
        </figure>
      </div>
    </Section>
  )
}

export function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <ClientStrip />
      <Flow />
      <ServiceCards />
      <Statement />
      <FeaturedResult />
      <Section>
        <Heading lead="Recent work." rest="Four campaigns from the past year." />
        <WorkRows />
      </Section>
      <Voices />
      <AskSection />
      <CtaBand />
    </>
  )
}

/* ============================== Services ============================== */

function Steps() {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STEPS.map(([title, body], i) => (
        <li key={title} className={`${card} p-6 lg:p-7`}>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#17110E] text-sm font-semibold">{i + 1}</span>
          <h3 className="mt-6 text-xl">{title}</h3>
          <p className="mt-3 text-white/70 text-[15px] leading-relaxed">{body}</p>
        </li>
      ))}
    </ol>
  )
}

export function ServicesPage() {
  usePageTitle('Services')
  return (
    <>
      <PageHeader
        lead="Three services."
        rest="Planned and run as one."
        lede="Take one or all three. Either way you get one team, one plan and one report, and you can see every number behind it."
      />
      {SERVICES.map((service, i) => (
        <section key={service.id} id={service.id} className={`${pad} py-14 md:py-20 scroll-mt-20`}>
          <div className={`mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center border-t border-white/15 pt-14 md:pt-20`}>
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <div className={`${card} p-6 lg:p-8`}>
                <ServiceVisual kind={service.visual} caption={service.caption} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl tracking-[-0.02em] leading-[1.05]">{service.name}</h2>
              <p className="mt-5 text-white/75 leading-relaxed max-w-[52ch]">{service.long}</p>
              <h3 className="mt-8 text-sm font-medium text-white/60">What you get each month</h3>
              <ul className="mt-4 grid gap-3">
                {service.monthly.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px]">
                    <Check className="w-4 h-4 mt-1 shrink-0 text-white/60" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
      <Section>
        <Heading lead="How we work." rest="The same four steps, every time." />
        <Steps />
      </Section>
      <Section id="questions" className="!pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em]">
            Questions <span className="text-white/50">we get a lot.</span>
          </h2>
          <Faq items={FAQS} />
        </div>
      </Section>
      <CtaBand />
    </>
  )
}

/* ============================== Work ============================== */

export function WorkPage() {
  usePageTitle('Work')
  return (
    <>
      <PageHeader lead="Our work." rest="And what it did for the client." lede="Four recent campaigns, each with the brief, what we did and the numbers that came back." />
      <Section className="!pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-12">
          {CASES.map((item) => (
            <Link key={item.slug} to={`/work/${item.slug}`} className="group block">
              <Cover index={item.cover} className="rounded-3xl aspect-[16/10] transition-transform duration-500 group-hover:scale-[0.985]" />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl tracking-[-0.02em]">{item.client}</h2>
                  <p className="mt-1 text-white/60 text-[15px]">{item.did}</p>
                  <p className="mt-1 text-[15px] font-medium">{item.result}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 mt-2 shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  )
}

export function CasePage() {
  const { slug } = useParams()
  const index = CASES.findIndex((item) => item.slug === slug)
  const item = CASES[index]
  usePageTitle(item ? item.client : 'Case study not found')
  if (!item) return <NotFound />
  const next = CASES[(index + 1) % CASES.length]

  return (
    <>
      <PageHeader lead={item.client + '.'} rest={item.result + '.'}>
        <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
          {[
            ['Sector', item.sector],
            ['Year', item.year],
            ['Length', item.duration],
            ['Services', item.services.join(', ')],
          ].map(([term, detail]) => (
            <div key={term} className="border-t border-white/20 pt-4">
              <dt className="text-sm text-white/60">{term}</dt>
              <dd className="mt-1 text-[15px] font-medium">{detail}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <div className={pad}>
        <Cover index={item.cover} className="mx-auto max-w-6xl rounded-3xl aspect-[16/9] md:aspect-[21/9]" />
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="text-2xl md:text-3xl tracking-[-0.01em]">The brief</h2>
            <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-[48ch]">{item.brief}</p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl tracking-[-0.01em]">What we did</h2>
            <ol className="mt-5 grid gap-4">
              {item.approach.map((step, i) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 text-white/85 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/30 text-xs font-semibold mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-12">
          The results <span className="text-white/50">in numbers.</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-center">
          <LineChart {...item.chart} />
          <Metrics items={item.metrics} />
        </div>
      </Section>

      {item.quote && (
        <Section className="!pt-0">
          <figure className="max-w-4xl">
            <blockquote className="text-3xl md:text-5xl leading-[1.15] tracking-[-0.02em]">“{item.quote.text}”</blockquote>
            <figcaption className="mt-7 text-[15px]">
              <span className="font-medium">{item.quote.name}</span>
              <span className="block text-white/60">{item.quote.role}</span>
            </figcaption>
          </figure>
        </Section>
      )}

      <section className={`${pad} pb-20 md:pb-28`}>
        <Link to={`/work/${next.slug}`} className={`group mx-auto max-w-6xl ${card} p-7 md:p-10 flex items-center justify-between gap-6 transition-colors duration-300 hover:bg-white/[0.07]`}>
          <span>
            <span className="block text-sm text-white/60">Next case study</span>
            <span className="block mt-2 text-3xl md:text-5xl tracking-[-0.02em]">{next.client}</span>
          </span>
          <ArrowUpRight className="w-8 h-8 shrink-0 text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" aria-hidden="true" />
        </Link>
      </section>
      <CtaBand />
    </>
  )
}

/* ============================== About ============================== */

export function AboutPage() {
  usePageTitle('About')
  return (
    <>
      <PageHeader
        lead="We own the whole route."
        rest="From first glance to repeat order."
        lede="We started flowpath in 2019 because agencies kept selling us channels. One did the ads, another did the content, a third did search, and nobody was responsible for whether any of it sold anything."
      />
      <Section className="!pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
          <div className="grid gap-5 text-white/75 text-lg leading-relaxed max-w-[54ch]">
            <p>So we built a studio where strategy, content and media buying sit at the same table. The person who plans your campaign also sees the comments under it and the orders that come from it.</p>
            <p>We are fourteen people in Lahore. We work with shops, restaurants, developers and fashion labels, mostly in Pakistan and the Gulf, and we take on a small number of clients at a time so each one gets senior attention.</p>
          </div>
          <dl className="grid gap-4">
            {FACTS.map(([term, detail]) => (
              <div key={term} className="border-t border-white/20 pt-4 flex justify-between gap-6">
                <dt className="text-sm text-white/60">{term}</dt>
                <dd className="text-[15px] font-medium text-right">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section className="!pt-0">
        <Heading lead="What we hold to." rest="With every client." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VALUES.map(([title, body]) => (
            <div key={title} className={`${card} p-6 lg:p-8`}>
              <h3 className="text-2xl tracking-[-0.01em]">{title}</h3>
              <p className="mt-4 text-white/70 text-[15px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <Heading lead="The team." rest="The people you will actually talk to." />
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
          {TEAM.map(([name, role], i) => (
            <li key={name} className="flex items-center gap-4">
              <span
                className="inline-flex items-center justify-center w-14 h-14 shrink-0 rounded-full text-[#17110E] font-semibold"
                style={{ background: ['#E8A04C', '#D8C3A5', '#8FA98B', '#D9644A'][i % 4] }}
                aria-hidden="true"
              >
                {name.split(' ').map((part) => part[0]).join('')}
              </span>
              <span>
                <span className="block font-medium">{name}</span>
                <span className="block text-sm text-white/60">{role}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="process" className="!pt-0">
        <Heading lead="How we work." rest="The same four steps, every time." />
        <Steps />
      </Section>

      <Section id="roles" className="!pt-0">
        <Heading lead="Open roles." rest="Come and work with us." />
        <ul className="border-b border-white/20">
          {ROLES.map(([title, where, body]) => (
            <li key={title} className="border-t border-white/20 py-7 grid grid-cols-1 md:grid-cols-[1fr_1.4fr_auto] gap-3 md:gap-8 items-center">
              <span>
                <span className="block text-2xl tracking-[-0.01em]">{title}</span>
                <span className="block text-sm text-white/60 mt-1">{where}</span>
              </span>
              <span className="text-white/70 text-[15px]">{body}</span>
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent('Application: ' + title)}`} className={`${glassBtn} justify-self-start`}>
                Apply by email
              </a>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  )
}

/* ============================== Contact ============================== */

export function ContactPage() {
  usePageTitle('Contact')
  return (
    <>
      <PageHeader
        lead="Tell us what"
        rest="you're launching."
        lede="We reply to every message within one working day, usually with a few questions and a time to talk."
      />
      <Section className="!pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          <dl className="grid gap-6">
            {[
              ['Email', SITE.email, `mailto:${SITE.email}`],
              ['WhatsApp', SITE.phone, SITE.whatsapp],
              ['Studio', SITE.address, ''],
              ['Hours', 'Monday to Friday, 10 am to 6 pm', ''],
            ].map(([term, detail, href]) => (
              <div key={term} className="border-t border-white/20 pt-4">
                <dt className="text-sm text-white/60">{term}</dt>
                <dd className="mt-1 text-lg font-medium">
                  {href ? (
                    <a href={href} className="hover:underline break-words">
                      {detail}
                    </a>
                  ) : (
                    detail
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className={`${card} p-6 md:p-9`}>
            <ContactForm />
          </div>
        </div>
      </Section>
      <Section className="!pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em]">
            Before <span className="text-white/50">you write.</span>
          </h2>
          <Faq items={FAQS.slice(0, 4)} />
        </div>
      </Section>
    </>
  )
}

/* ============================== Privacy and 404 ============================== */

export function PrivacyPage() {
  usePageTitle('Privacy policy')
  const parts: [string, string][] = [
    ['What we collect', 'When you send us a message through the contact form, we receive your name, email address, company, budget range and the message itself. To block spam we also keep a scrambled, one-way code made from your network address, which cannot be turned back into the address. If you use the chat assistant, we keep the questions you ask and its answers so we can check it is working properly. We do not collect anything else through this site.'],
    ['How we use it', 'We use your details only to reply to your enquiry and, if you become a client, to work with you. We do not sell or share them with advertisers.'],
    ['The chat assistant', 'The assistant is an AI model. Your questions are sent to an AI provider to produce an answer, so do not type anything private into it. Its answers come from this site and can be wrong, so check the linked page before relying on one.'],
    ['How long we keep it', 'Enquiries that do not lead to work together are deleted after twelve months.'],
    ['Your choices', `You can ask us to show you, correct or delete the details we hold about you at any time by writing to ${SITE.email}.`],
  ]
  return (
    <>
      <PageHeader lead="Privacy policy." lede="A short, plain explanation of what this site collects and what we do with it." />
      <Section className="!pt-4">
        <div className="grid gap-10 max-w-3xl">
          {parts.map(([title, body]) => (
            <div key={title}>
              <h2 className="text-2xl tracking-[-0.01em]">{title}</h2>
              <p className="mt-3 text-white/75 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

export function NotFound() {
  usePageTitle('Page not found')
  return (
    <PageHeader lead="This page" rest="isn't here." lede="The link may be old, or the address may have a typo. These will get you back on track.">
      <div className="mt-9 flex flex-wrap gap-3 pb-24">
        <Link to="/" className={whiteBtn}>
          Go to the home page
        </Link>
        <Link to="/work" className={glassBtn}>
          See our work
        </Link>
      </div>
    </PageHeader>
  )
}