import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { baseUrl } from "../../utils/baseUrl";
import EmptyContent from "../EmptyContent/EmptyContent";
import emptyProducts from "../../assets/images/emptyProducts.svg";
import Loading from "../Loading/Loading";

export default function CategoryDetails() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryDetails() {
      setIsLoading(true);
      try {
        const [categoryRes, subcategoriesRes] = await Promise.all([
          axios.get(`${baseUrl}/categories/${categoryId}`),
          axios.get(`${baseUrl}/categories/${categoryId}/subcategories`),
        ]);

        setCategory(categoryRes?.data?.data || null);
        setSubcategories(subcategoriesRes?.data?.data || []);
      } catch (err) {
        setCategory(null);
        setSubcategories([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategoryDetails();
  }, [categoryId]);

  if (isLoading) return <Loading />;

  const categoryName = category?.name || "Category";

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`FreshCart-${categoryName}-Subcategories`}</title>
      </Helmet>

      <section className="fresh-page-hero green">
        <div className="container">
          <span>Home / Categories / {categoryName}</span>
          <div className="fresh-page-hero-title">
            {category?.image ? (
              <img src={category.image} alt={categoryName} />
            ) : (
              <strong>
                <i className="fa-solid fa-layer-group"></i>
              </strong>
            )}
            <div>
              <h1>{categoryName}</h1>
              <p>Choose a subcategory to browse products</p>
            </div>
          </div>
        </div>
      </section>

      <main className="fresh-page-body">
        <div className="container">
          <Link to="/categories" className="fresh-back-link">
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back to Categories
          </Link>

          <h2 className="fresh-subcategory-title">
            {subcategories.length} Subcategories in {categoryName}
          </h2>

          {subcategories.length > 0 ? (
            <div className="fresh-subcategory-grid">
              {subcategories.map((item) => (
                <Link
                  key={item._id}
                  to={`/products?subcategory=${item._id}`}
                  className="fresh-subcategory-card"
                >
                  <span>
                    <i className="fa-solid fa-folder-open"></i>
                  </span>
                  <strong>{item.name}</strong>
                  <small>Browse Products</small>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyContent
              imageSrc={emptyProducts}
              message="No subcategories found"
              details="Try another category or browse all products."
            />
          )}
        </div>
      </main>
    </>
  );
}
