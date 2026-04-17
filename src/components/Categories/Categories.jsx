import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { baseUrl } from "./../../utils/baseUrl";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import "./Categories.css";
import { Helmet } from "react-helmet";

export default function Categories() {
  function getCategories() {
    return axios.get(`${baseUrl}/categories`);
  }

  const { data, isLoading } = useQuery("allCategories", getCategories);

  if (isLoading) return <Loading />;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Categories</title>
      </Helmet>
      <section className="fresh-page-hero green">
        <div className="container">
          <span>Home / Categories</span>
          <h1><i className="fa-solid fa-layer-group me-3"></i>All Categories</h1>
          <p>Browse our wide range of product categories</p>
        </div>
      </section>

      <main className="fresh-page-body">
        <div className="container">
          <div className="fresh-category-page-grid">
            {data?.data?.data?.map((item) => (
              <Link key={item._id} to={`/categories/${item._id}`} className="fresh-category-page-card">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <small>View Subcategories</small>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
