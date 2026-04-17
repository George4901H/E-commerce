import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

export default function Footer() {
  const { pathname } = useLocation();
  const showNewsletter = pathname === "/" || pathname === "/home";
  const footerLinks = {
    Shop: ["All Products", "Categories", "Brands", "Electronics", "Men's Fashion", "Women's Fashion"],
    Account: ["My Account", "Order History", "Wishlist", "Shopping Cart", "Sign In", "Create Account"],
    Support: ["Contact Us", "Help Center", "Shipping Info", "Returns & Refunds", "Track Order"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer className={`fresh-footer ${showNewsletter ? "" : "fresh-footer-compact"}`}>
      {showNewsletter && <section className="fresh-newsletter">
        <div className="container">
          <div className="fresh-newsletter-panel">
            <div className="fresh-newsletter-copy">
              <span className="fresh-newsletter-icon"><i className="fa-solid fa-envelope"></i></span>
              <small>NEWSLETTER<br />50,000+ subscribers</small>
              <h2>Get the Freshest Updates <span>Delivered Free</span></h2>
              <p>Weekly recipes, seasonal offers & exclusive member perks.</p>
              <div className="fresh-news-tags">
                <span><i className="fa-solid fa-leaf"></i> Fresh Picks Weekly</span>
                <span><i className="fa-solid fa-truck"></i> Free Delivery Codes</span>
                <span><i className="fa-solid fa-tag"></i> Members-Only Deals</span>
              </div>
              <form className="fresh-subscribe" onClick={(e) => e.preventDefault()}>
                <input type="email" placeholder="you@example.com" />
                <button className="btn">Subscribe <i className="fa-solid fa-arrow-right ms-2"></i></button>
              </form>
              <p className="fresh-note">Subscribe anytime. No spam, ever.</p>
            </div>
            <div className="fresh-app-card">
              <span>MOBILE APP</span>
              <h3>Shop Faster on Our App</h3>
              <p>Get app-exclusive deals & 15% off your first order.</p>
              <button className="btn"><i className="fa-brands fa-apple me-3"></i><small>DOWNLOAD ON</small> App Store</button>
              <button className="btn"><i className="fa-brands fa-google-play me-3"></i><small>GET IT ON</small> Google Play</button>
              <p className="fresh-stars">★★★★★ 4.9 - 100k+ downloads</p>
            </div>
          </div>
        </div>
      </section>}

      <section className="fresh-footer-features">
        <div className="container">
          <div className="fresh-footer-feature-grid">
            <Feature icon="fa-solid fa-truck" title="Free Shipping" text="On orders over 500 EGP" />
            <Feature icon="fa-solid fa-rotate-left" title="Easy Returns" text="14-day return policy" />
            <Feature icon="fa-solid fa-shield-halved" title="Secure Payment" text="100% secure checkout" />
            <Feature icon="fa-solid fa-headset" title="24/7 Support" text="Contact us anytime" />
          </div>
        </div>
      </section>

      <section className="fresh-footer-dark">
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-4">
              <img src={logo} alt="FreshCart" className="fresh-footer-logo" />
              <p className="fresh-footer-about">FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.</p>
              <p><i className="fa-solid fa-phone text-main me-3"></i>+1 (800) 123-4567</p>
              <p><i className="fa-solid fa-envelope text-main me-3"></i>support@freshcart.com</p>
              <p><i className="fa-solid fa-location-dot text-main me-3"></i>123 Commerce Street, New York, NY 10001</p>
              <div className="fresh-socials">
                <Link to="/"><i className="fa-brands fa-facebook-f"></i></Link>
                <Link to="/"><i className="fa-brands fa-twitter"></i></Link>
                <Link to="/"><i className="fa-brands fa-instagram"></i></Link>
                <Link to="/"><i className="fa-brands fa-youtube"></i></Link>
              </div>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div className="col-lg-2 col-md-3 col-6" key={title}>
                <h5>{title}</h5>
                {links.map((item) => <Link to="/" key={item}>{item}</Link>)}
              </div>
            ))}
          </div>
          <div className="fresh-footer-bottom">
            <span>© 2026 FreshCart. All rights reserved.</span>
            <span><i className="fa-brands fa-cc-visa me-2"></i> Visa <i className="fa-brands fa-cc-mastercard mx-2"></i> Mastercard <i className="fa-brands fa-cc-paypal mx-2"></i> PayPal</span>
          </div>
        </div>
      </section>
    </footer>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="fresh-footer-feature">
      <span><i className={icon}></i></span>
      <strong>{title}<small>{text}</small></strong>
    </div>
  );
}
