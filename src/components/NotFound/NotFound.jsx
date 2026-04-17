import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="fresh-not-found-page">
      <span className="fresh-not-found-float apple one">
        <i className="fa-brands fa-apple"></i>
      </span>
      <span className="fresh-not-found-float apple two">
        <i className="fa-brands fa-apple"></i>
      </span>
      <span className="fresh-not-found-float carrot one">
        <i className="fa-solid fa-carrot"></i>
      </span>
      <span className="fresh-not-found-float carrot two">
        <i className="fa-solid fa-carrot"></i>
      </span>
      <span className="fresh-not-found-float leaf one">
        <i className="fa-solid fa-leaf"></i>
      </span>
      <span className="fresh-not-found-float seedling one">
        <i className="fa-solid fa-seedling"></i>
      </span>

      <div className="container">
        <div className="fresh-not-found-content">
          <div className="fresh-not-found-visual">
            <div className="fresh-not-found-card">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <strong>404</strong>
          </div>

          <div className="fresh-not-found-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <h1>Oops! Nothing Here</h1>
          <p>
            Looks like this page went out of stock! Don&apos;t worry,
            <br />
            there&apos;s plenty more fresh content to explore.
          </p>

          <div className="fresh-not-found-actions">
            <Link to="/home" className="fresh-not-found-primary">
              <i className="fa-solid fa-house"></i>
              Go to Homepage
            </Link>
            <button type="button" className="fresh-not-found-secondary" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left"></i>
              Go Back
            </button>
          </div>

          <div className="fresh-not-found-destinations">
            <h2>Popular Destinations</h2>
            <div>
              <Link to="/products">All Products</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/deals">Today&apos;s Deals</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
