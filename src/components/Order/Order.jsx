import React, { useState } from "react";

export default function Order({ item, expanded = false }) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const items = item.cartItems || [];
  const firstItem = items[0];
  const date = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const status = item.isPaid ? "Paid" : "Processing";
  const subtotal = item.subtotal || Math.max((item.totalOrderPrice || 0) - (item.shippingPrice || 0), 0);
  const shipping = item.shippingPrice ?? 0;
  const total = item.totalOrderPrice || subtotal + shipping;
  const city = item.shippingAddress?.city || "Kafr Saqr";
  const details = item.shippingAddress?.details || "حي النصر - كفر صقر - الشرقية";
  const phone = item.shippingAddress?.phone || "01025727233";

  return (
    <article className="fresh-order-card">
      <div className="fresh-order-top">
        <div className="fresh-order-image">
          <img src={firstItem?.product?.imageCover} alt={firstItem?.product?.title || "Order"} />
          {items.length > 1 && <small>+{items.length - 1}</small>}
        </div>
        <div className="fresh-order-main">
          <span className={item.isPaid ? "paid" : "processing"}><i className="fa-solid fa-clock"></i> {status}</span>
          <h3><i className="fa-solid fa-hashtag"></i>{item.id}</h3>
          <p><i className="fa-solid fa-calendar-days"></i>{date} <b>•</b> <i className="fa-solid fa-box"></i>{items.length} items <b>•</b> <i className="fa-solid fa-location-dot"></i>{city}</p>
          <strong>{total} <small>EGP</small></strong>
        </div>
        <i className="fresh-order-payment fa-solid fa-money-bill"></i>
        <button type="button" className="fresh-order-details" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Hide" : "Details"} <i className={`fa-solid fa-chevron-${isExpanded ? "up" : "down"} ms-2`}></i>
        </button>
      </div>

      {isExpanded && (
        <div className="fresh-order-expanded">
          <div className="fresh-order-items">
            <h4><i className="fa-solid fa-receipt"></i>Order Items</h4>
            {items.map((el) => (
              <div className="fresh-order-item" key={el._id || el.product.id}>
                <img src={el.product.imageCover} alt={el.product.title} />
                <span><strong>{el.product.title.split(" ").slice(0, 7).join(" ")}</strong><small>{el.count || 1} x {el.price} EGP</small></span>
                <b>{(el.price || 0) * (el.count || 1)}<small>EGP</small></b>
              </div>
            ))}
          </div>

          <div className="fresh-order-bottom-grid">
            <div className="fresh-order-address">
              <h4><i className="fa-solid fa-location-dot"></i>Delivery Address</h4>
              <strong>{city}</strong>
              <p>{details}</p>
              <small><i className="fa-solid fa-phone"></i>{phone}</small>
            </div>
            <div className="fresh-order-summary-mini">
              <h4><i className="fa-solid fa-receipt"></i>Order Summary</h4>
              <p><span>Subtotal</span><strong>{subtotal} EGP</strong></p>
              <p><span>Shipping</span><strong>{shipping ? `${shipping} EGP` : "Free"}</strong></p>
              <p><span>Total</span><strong>{total} EGP</strong></p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
