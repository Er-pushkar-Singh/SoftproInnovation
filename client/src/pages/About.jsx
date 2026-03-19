import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const VALUES = [
  { icon: '🎯', title: 'Curated Quality',     desc: 'Every product is tested and verified by our in-house engineering team before it hits the shelf.' },
  { icon: '🚀', title: 'Fast Fulfilment',      desc: 'Orders placed before 3 PM are dispatched same day. Most customers receive within 24–48 hours.' },
  { icon: '🛡️', title: 'Genuine Components',   desc: 'We source directly from Raspberry Pi Ltd, Arduino S.r.l., and authorised distributors only.' },
  { icon: '🤝', title: 'Maker Support',         desc: 'Our technical team is available via chat, email, and phone to help debug your projects.' },
  { icon: '🌱', title: 'Community First',       desc: 'We sponsor hackathons, college labs, and open-source hardware projects across India.' },
  { icon: '💡', title: 'Continuous Learning',  desc: 'Free project tutorials, wiring guides, and datasheets ship with every order.' },
]

const TEAM = [
  { initials: 'AK', name: 'Aman Kumar',     role: 'Founder & CEO',          bio: 'Embedded systems engineer with 12 years of experience in IoT product development.' },
  { initials: 'PS', name: 'Priya Singh',    role: 'Head of Operations',     bio: 'Supply chain expert ensuring 99.8% order accuracy and on-time delivery.' },
  { initials: 'RV', name: 'Rahul Verma',    role: 'Lead Hardware Engineer', bio: 'Open-source contributor and Raspberry Pi certified developer.' },
  { initials: 'NA', name: 'Nisha Agarwal',  role: 'Customer Experience',    bio: 'Dedicated to making every maker feel heard and supported throughout their journey.' },
]

const TIMELINE = [
  { year: '2018', event: 'Founded in a small garage in Lucknow with 200 SKUs and a dream.' },
  { year: '2019', event: 'Launched online store — 1,000 orders in the first six months.' },
  { year: '2021', event: 'Reached 10,000 customers and opened our first warehouse.' },
  { year: '2023', event: 'Became an official Raspberry Pi Approved Reseller for India.' },
  { year: '2024', event: '5,000+ products, 50,000+ orders, and growing every day.' },
]

const About = () => {
  const observerRef = useRef(null)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
    {/* navbar */}
    <Navbar/>
      {/* Hero */}
      <div className="about-hero">
        <div className="container position-relative my-5" style={{ zIndex: 2 }}>
          <span className="section-eyebrow" style={{ color: 'var(--accent)' }}>Our Story</span>
          <h1 className="about-hero-title">
            Empowering <em>Makers</em><br />Across India
          </h1>
          <p className="about-hero-desc">
            SoftproInnovation started with a simple belief: every engineer, student, and hobbyist
            deserves access to quality electronics components at fair prices, with support
            that actually helps them build.
          </p>
          <div className="d-flex gap-3 mt-4 flex-wrap">
            <Link to="/products" className="btn-hero-primary">Browse Products</Link>
            <Link to="/contact"  className="btn-hero-secondary">Get in Touch</Link>
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="si-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 fade-up">
              <span className="section-eyebrow">Our Mission</span>
              <h2 className="section-title">Building the <em>Future</em><br />One Kit at a Time</h2>
              <div className="section-divider" />
              <p className="section-desc" style={{ maxWidth: '100%' }}>
                We believe in lowering the barrier to hardware innovation. From a school
                science project to a professional IoT product, we stock everything you need
                and ship it to your doorstep anywhere in India.
              </p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: 1.7 }}>
                Our team of engineers hand-picks every product, writes detailed guides,
                and provides real human support — because we are makers ourselves.
              </p>
            </div>
            <div className="col-lg-6 fade-up delay-2">
              <div className="row g-3">
                {[
                  { num: '5,000+', label: 'Products' },
                  { num: '50K+',   label: 'Happy Customers' },
                  { num: '7',      label: 'Years in Business' },
                  { num: '99.8%',  label: 'Order Accuracy' },
                ].map(({ num, label }) => (
                  <div className="col-6" key={label}>
                    <div className="cat-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{num}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="si-section si-section-alt">
        <div className="container">
          <div className="text-center mb-5 fade-up">
            <span className="section-eyebrow">What We Stand For</span>
            <h2 className="section-title">Our Core <em>Values</em></h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="row g-4">
            {VALUES.map((v, i) => (
              <div className={`col-md-6 col-lg-4 fade-up delay-${(i % 3) + 1}`} key={v.title}>
                <div className="value-card h-100">
                  <div className="value-icon">{v.icon}</div>
                  <div className="value-title">{v.title}</div>
                  <p className="value-desc">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="si-section">
        <div className="container">
          <div className="text-center mb-5 fade-up">
            <span className="section-eyebrow">How We Got Here</span>
            <h2 className="section-title">Our <em>Journey</em></h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className={`d-flex gap-4 mb-4 fade-up delay-${i + 1}`} style={{ alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 64, textAlign: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    color: 'var(--accent)', fontSize: '1.1rem',
                    paddingTop: '0.2rem',
                  }}>
                    {item.year}
                  </div>
                  <div style={{
                    flex: 1, paddingLeft: '1.5rem',
                    borderLeft: '2px solid var(--border)',
                    paddingBottom: '1.5rem',
                  }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="si-section si-section-alt">
        <div className="container">
          <div className="text-center mb-5 fade-up">
            <span className="section-eyebrow">The People Behind It</span>
            <h2 className="section-title">Meet the <em>Team</em></h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="row g-4 justify-content-center">
            {TEAM.map((member, i) => (
              <div className={`col-sm-6 col-lg-3 fade-up delay-${i + 1}`} key={member.name}>
                <div className="team-card h-100">
                  <div className="team-avatar">{member.initials}</div>
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.role}</div>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="si-section">
        <div className="container text-center fade-up">
          <span className="section-eyebrow">Ready to Build?</span>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Start your next project with <em>SoftproInnovation</em>
          </h2>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/products" className="btn-hero-primary" style={{ borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
              Shop Now
            </Link>
            <Link to="/contact" className="btn-hero-secondary" style={{ borderRadius: 'var(--radius-md)', textDecoration: 'none', border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default About