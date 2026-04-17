import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setIsSent(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setIsSent(false);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormValues({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 900);
  }

  return (
    <section className="fresh-contact-page">
      <div className="fresh-page-hero green fresh-contact-hero">
        <div className="container">
          <span>Home / Contact Us</span>
          <div className="fresh-page-hero-title">
            <strong>
              <i className="fa-solid fa-headset"></i>
            </strong>
            <div>
              <h1>Contact Us</h1>
              <p>We&apos;d love to hear from you. Get in touch with our team.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fresh-contact-body">
        <div className="container">
          <div className="fresh-contact-layout">
            <aside className="fresh-contact-info">
              <ContactCard
                icon="fa-solid fa-phone"
                title="Phone"
                text="Mon-Fri from 8am to 6pm"
                accent="+1 (800) 123-4567"
              />
              <ContactCard
                icon="fa-solid fa-envelope"
                title="Email"
                text="We'll respond within 24 hours"
                accent="support@freshcart.com"
              />
              <ContactCard
                icon="fa-solid fa-location-dot"
                title="Office"
                text={
                  <>
                    123 Commerce Street
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </>
                }
              />
              <ContactCard
                icon="fa-solid fa-clock"
                title="Business Hours"
                text={
                  <>
                    Monday - Friday: 8am - 6pm
                    <br />
                    Saturday: 9am - 4pm
                    <br />
                    Sunday: Closed
                  </>
                }
              />

              <div className="fresh-contact-card fresh-contact-social-card">
                <h3>Follow Us</h3>
                <div className="fresh-contact-socials">
                  <a href="#facebook" aria-label="Facebook">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#twitter" aria-label="Twitter">
                    <i className="fa-brands fa-twitter"></i>
                  </a>
                  <a href="#instagram" aria-label="Instagram">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a href="#linkedin" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </aside>

            <main className="fresh-contact-main">
              <form className="fresh-contact-form" onSubmit={handleSubmit}>
                <div className="fresh-contact-form-title">
                  <span>
                    <i className="fa-solid fa-headset"></i>
                  </span>
                  <div>
                    <h2>Send us a message</h2>
                    <p>Fill out the form and we&apos;ll get back to you</p>
                  </div>
                </div>

                {isSent && (
                  <div className="fresh-contact-success" role="status">
                    <span>
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <div>
                      <strong>Message sent successfully!</strong>
                      <small>We&apos;ll get back to you as soon as possible.</small>
                    </div>
                  </div>
                )}

                <div className="fresh-contact-two">
                  <label>
                    Full Name
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formValues.name}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Email Address
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formValues.email}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <label>
                  Subject
                  <select
                    name="subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="product">Product Information</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label>
                  Message
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    value={formValues.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </label>

                <button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>
                      <span className="fresh-contact-button-spinner" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="fresh-contact-help-panel">
                <span>
                  <i className="fa-solid fa-circle-question"></i>
                </span>
                <div>
                  <h3>Looking for quick answers?</h3>
                  <p>Check out our Help Center for frequently asked questions about orders, shipping, returns, and more.</p>
                  <Link to="/help-center">Visit Help Center <i className="fa-solid fa-arrow-right-long"></i></Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, title, text, accent }) {
  return (
    <div className="fresh-contact-card">
      <span>
        <i className={icon}></i>
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        {accent && <strong>{accent}</strong>}
      </div>
    </div>
  );
}
