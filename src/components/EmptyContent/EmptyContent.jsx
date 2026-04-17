import React from "react";
import { Link } from "react-router-dom";

export default function EmptyContent({ imageSrc = "", message, details = "" }) {
  const normalized = message?.toLowerCase() || "";
  const isWishlist = normalized.includes("wishlist");
  const isOrders = normalized.includes("orders");

  if (isWishlist || isOrders) {
    return (
      <section className="fresh-empty-state-page">
        <div className="fresh-empty-state">
          <span><i className={`fa-solid ${isOrders ? "fa-box-open" : "fa-heart"}`}></i></span>
          <h1>{isOrders ? "No orders yet" : "your wishlist is empty"}</h1>
          <p>{isOrders ? "When you place orders, they'll appear here so you can track them." : "Browse products and save your favorites here."}</p>
          <Link to="/products" className="btn fresh-empty-btn">
            <i className={`fa-solid ${isOrders ? "fa-bag-shopping" : "fa-arrow-right"} me-2`}></i>
            {isOrders ? "Start Shopping" : "Browse Products"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart container my-5 py-5  d-flex  align-items-center justify-content-center ">
      <div className="row ">
        <div className="col-md-7 mx-auto">
          <div className="w-100">
            <h4 className="my-4 text-center text-capitalize fw-bold">
              {message}
            </h4>
            {details ? <p className="text-center">{details}</p> : null}
          </div>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="empty cart"
              className="d-block mt-2 mx-auto w-100"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
