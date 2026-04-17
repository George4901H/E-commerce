import React from "react";
import Slider from "react-slick";
import homeSliderImage from "../../assets/images/slider/home-slider-1.d79601a8.png";

export default function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    nextArrow: <HeroArrow direction="next" />,
    prevArrow: <HeroArrow direction="prev" />,
  };

  return (
    <section className="fresh-hero">
      <Slider {...settings} className="fresh-hero-slider">
        <HeroSlide
          image={homeSliderImage}
          title="Fresh Products Delivered to your Door"
          subtitle="Get 20% off your first order"
          primaryAction="Shop Now"
          secondaryAction="View Deals"
        />
        <HeroSlide
          image={homeSliderImage}
          title="Premium Quality Guaranteed"
          subtitle="Fresh from farm to your table"
          primaryAction="Shop Now"
          secondaryAction="Learn More"
        />
        <HeroSlide
          image={homeSliderImage}
          title="Fast & Free Delivery"
          subtitle="Same day delivery available"
          primaryAction="Order Now"
          secondaryAction="Delivery Info"
        />
      </Slider>
    </section>
  );
}

function HeroSlide({ image, title, subtitle, primaryAction, secondaryAction }) {
  return (
    <div className="fresh-hero-slide" style={{ backgroundImage: `url(${image})` }}>
      <div className="fresh-hero-overlay">
        <div className="container h-100">
          <div className="fresh-hero-content">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <div className="d-flex gap-2">
              <button className="btn fresh-white-btn">{primaryAction}</button>
              <button className="btn fresh-outline-btn">{secondaryAction}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroArrow({ className, onClick, direction }) {
  return (
    <button className={`${className || ""} fresh-hero-arrow fresh-hero-arrow-${direction}`} onClick={onClick} aria-label={`${direction} slide`}>
      <i className={`fa-solid fa-chevron-${direction === "next" ? "right" : "left"}`}></i>
    </button>
  );
}
