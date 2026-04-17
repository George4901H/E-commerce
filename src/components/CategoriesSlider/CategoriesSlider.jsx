import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { baseUrl } from "./../../utils/baseUrl";
import { Link } from "react-router-dom";
import fallbackCategory from "../../assets/images/slider/ad-banner-1.jpg";

export default function CategoriesSlider() {
  function getCategories() { return axios.get(`${baseUrl}/categories`); }
  let { data } = useQuery("getCategories", getCategories);

  return (
    <section className="fresh-section fresh-categories">
      <div className="container">
        <div className="fresh-section-heading">
          <h2>Shop By <span>Category</span></h2>
          <Link to="/categories">View All Categories <i className="fa-solid fa-arrow-right ms-2"></i></Link>
        </div>
        <div className="fresh-category-grid">
          {data?.data?.data?.slice(0, 10).map((item) => (
            <Link key={item._id} to={`/categories/${item._id}`} className="fresh-category-card">
              <img
                src={item.image || fallbackCategory}
                alt={item.name}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackCategory;
                }}
              />
              <h6>{item.name}</h6>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
