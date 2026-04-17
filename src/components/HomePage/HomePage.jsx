import React from "react";
import MainSlider from "../MainSlider/MainSlider";
import CategoriesSlider from "../CategoriesSlider/CategoriesSlider";
import Products from "./../Products/Products";
import { Helmet } from "react-helmet";
import "./HomePage.css";

export default function HomePage() {
  return (
    <>
      <MainSlider />
      <FeatureStrip />
      <CategoriesSlider />
      <PromoBanners />
      <Products homeMode />
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Home</title>
        <meta name="keywords" content="FreshCart-App-Ecommerce" />
      </Helmet>
    </>
  );
}

function FeatureStrip() {
  const features = [
    ["fa-solid fa-truck", "Free Shipping", "On orders over 500 EGP", "blue"],
    ["fa-solid fa-shield-halved", "Secure Payment", "100% secure transactions", "green"],
    ["fa-solid fa-rotate-left", "Easy Returns", "14-day return policy", "orange"],
    ["fa-solid fa-headset", "24/7 Support", "Dedicated support team", "purple"],
  ];

  return (
    <section className="fresh-feature-band">
      <div className="container">
        <div className="fresh-feature-grid">
          {features.map(([icon, title, text, tone]) => (
            <div className="fresh-feature-card" key={title}>
              <span className={`fresh-feature-icon ${tone}`}><i className={icon}></i></span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanners() {
  return (
    <section className="fresh-section fresh-promos">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="fresh-promo-card green">
              <span>Deal of the Day</span>
              <h3>Fresh Organic Fruits</h3>
              <p>Get up to 40% off on selected organic fruits</p>
              <strong>40% OFF <small>Use code: ORGANIC40</small></strong>
              <button className="btn">Shop Now <i className="fa-solid fa-arrow-right ms-2"></i></button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="fresh-promo-card orange">
              <span>New Arrivals</span>
              <h3>Exotic Vegetables</h3>
              <p>Discover our latest collection of premium vegetables</p>
              <strong>25% OFF <small>Use code: FRESH25</small></strong>
              <button className="btn">Explore Now <i className="fa-solid fa-arrow-right ms-2"></i></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
