import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="si-footer">
      <div className="container">
        <div className="row g-5">

          {/* Brand col */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-brand-name">Softpro<span>Innovation</span></div>
            <p className="footer-tagline">
              Your trusted source for microcontrollers, single-board computers,
              and electronics components in India.
            </p>
            <div className="footer-social">
              {[
                { icon: 'facebook', label: 'Facebook', href: '#!' },
                { icon: 'twitter', label: 'Twitter', href: '#!' },
                { icon: 'instagram', label: 'Instagram', href: '#!' },
                { icon: 'youtube', label: 'YouTube', href: '#!' },
                { icon: 'linkedin', label: 'LinkedIn', href: '#!' },
              ].map(({ icon, label, href }) => (
                <a key={icon} href={href} className="social-btn" title={label} aria-label={label}>
                  <SocialIcon name={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-6 col-6">
            <div className="footer-col-title">Quick Links</div>
            <div className="footer-links">
              {[
                ['/', 'Home'],
                ['/about', 'About Us'],
                ['/products', 'Products'],
                // ['/category', 'Categories'],
                ['/contact', 'Contact Us'],
              ].map(([to, label]) => (
                <Link key={to} to={to}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 col-6">
            <div className="footer-col-title">Categories</div>
            <div className="footer-links">
              {[
                'Raspberry Pi',
                'Arduino',
                'ESP32 / ESP8266',
                'Sensors',
                'Displays',
                'Power Modules',
              ].map(c => <a key={c} href="#!">{c}</a>)}
            </div>
          </div>

          {/* Policy */}
          <div className="col-lg-2 col-md-6 col-6">
            <div className="footer-col-title">Support</div>
            <div className="footer-links">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Return Policy',
                'Shipping Info',
                'FAQs',
                'Track Order',
              ].map(c => <a key={c} href="#!">{c}</a>)}
            </div>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-col-title">Get in Touch</div>
            <div className="footer-contact-item">
              <span className="icon"><i class="fa-solid fa-map-pin"></i></span>
              <p>
                Softpro House <br />
                3/213, Sec-J, Jankipuram, Kursi Road <br />
                Near Gudamba Police Station <br />
                Lucknow - 226021
                </p>
            </div>
            <div className="footer-contact-item">
              <span className="icon"><i class="fa-solid fa-phone"></i></span>
              <p><a href="tel:+916391276203">+91 63912 76203</a></p>
            </div>
            <div className="footer-contact-item">
              <span className="icon">✉️</span>
              <p><a href="mailto:info@softproinnovation.com">info@softproinnovation.com</a></p>
            </div>
            <div className="footer-contact-item">
              <span className="icon">🕐</span>
              <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p>© {new Date().getFullYear()} SoftproInnovation. All rights reserved.</p>
          <p>Design & Development by Piyush Pal</p>
        </div>
      </div>
    </footer>
  )
}

/* Minimal inline SVG social icons */
const SocialIcon = ({ name }) => {
  const icons = {
    facebook: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    twitter: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
    instagram: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    youtube: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
    linkedin: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  }
  return icons[name] || null
}

export default Footer