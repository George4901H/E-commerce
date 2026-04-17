import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Loading from "../Loading/Loading";
import "./Brands.css";
import { baseUrl } from "./../../utils/baseUrl";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Brands() {
  function getBrands() {
    return axios.get(`${baseUrl}/brands`);
  }

  const { data, isLoading } = useQuery("getBrands", getBrands);

  if (isLoading) return <Loading />;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Brands</title>
        <meta name="keywords" content="FreshCart-Ecommerce-Brands-Products" />
      </Helmet>
      <section className="fresh-page-hero purple">
        <div className="container">
          <span>Home / Brands</span>
          <h1><i className="fa-solid fa-tags me-3"></i>Top Brands</h1>
          <p>Shop from your favorite brands</p>
        </div>
      </section>

      <main className="fresh-page-body">
        <div className="container">
          <div className="fresh-brand-grid">
            {data?.data?.data?.map((item) => (
              <Link key={item._id} to={`/products/brand/${item.name}/${item._id}`} className="fresh-brand-card">
                <div>
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <h3>{item.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
