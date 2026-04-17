/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { cartContext } from "../../Context/CartContext";
import Loading from "./../Loading/Loading";
import CartItem from "../CartItem/CartItem";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Cart() {
  const { setCartCounter, getCart, clearCart } = useContext(cartContext);
  const [isLoading, setIsLoading] = useState(true);
  const [cartDetails, setCartDetails] = useState([]);

  async function clearUserCart() {
    setIsLoading(true);
    const { data } = await clearCart();
    if (data.message === "success") {
      setCartCounter(0);
      setCartDetails([]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data } = await getCart();
      if (data?.response?.data.statusMsg === "fail") {
        setCartDetails([]);
      } else {
        setCartDetails(data);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <Loading />;
  if (!cartDetails || cartDetails?.length === 0 || cartDetails?.numOfCartItems <= 0) {
    return <EmptyCart />;
  }

  const total = cartDetails?.data?.totalCartPrice || 0;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Cart</title>
      </Helmet>
      <main className="fresh-page-body fresh-cart-page">
        <div className="container">
          <span className="fresh-breadcrumb">Home / Shopping Cart</span>
          <div className="fresh-cart-title">
            <h1><i className="fa-solid fa-cart-shopping me-3"></i>Shopping Cart</h1>
            <p>You have <span>{cartDetails?.numOfCartItems} items</span> in your cart</p>
          </div>

          <div className="fresh-cart-layout">
            <section className="fresh-cart-items">
              {cartDetails?.data?.products.map((item) => (
                <CartItem key={item.product.id} item={item} setCartDetails={setCartDetails} />
              ))}
              <div className="fresh-cart-actions">
                <Link to="/products">← Continue Shopping</Link>
                <button className="btn" onClick={clearUserCart}><i className="fa-solid fa-trash-can me-2"></i>Clear all items</button>
              </div>
            </section>

            <aside className="fresh-order-summary">
              <div className="fresh-order-summary-head">
                <h3><i className="fa-solid fa-bag-shopping me-2"></i>Order Summary</h3>
                <small>{cartDetails?.numOfCartItems} {cartDetails?.numOfCartItems === 1 ? "item" : "items"} in your cart</small>
              </div>
              <div className="fresh-free-shipping"><i className="fa-solid fa-truck"></i><strong>Free Shipping!</strong><span>You qualify for free delivery</span></div>
              <p><span>Subtotal</span><strong>{total} EGP</strong></p>
              <p><span>Shipping</span><strong className="text-main">FREE</strong></p>
              <p className="total"><span>Total</span><strong>{total}<small> EGP</small></strong></p>
              <button className="btn fresh-code-btn"><i className="fa-solid fa-tag me-2"></i>Apply Promo Code</button>
              <Link className="btn fresh-checkout-btn" to={`/shippingAddress/${cartDetails?.data._id}`}>
                <i className="fa-solid fa-lock me-2"></i>Secure Checkout
              </Link>
              <div className="fresh-summary-trust"><span><i className="fa-solid fa-shield"></i> Secure Payment</span><span><i className="fa-solid fa-truck"></i> Fast Delivery</span></div>
              <Link to="/products" className="fresh-continue-link">Continue Shopping</Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function EmptyCart() {
  const popularCategories = ["Electronics", "Fashion", "Home", "Beauty"];

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Cart</title>
      </Helmet>
      <main className="fresh-empty-cart-page">
        <section className="fresh-empty-cart">
          <span className="fresh-empty-cart-icon">
            <i className="fa-solid fa-box-open"></i>
          </span>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything to your cart yet.<br />Start exploring our products!</p>
          <Link to="/products" className="btn fresh-empty-cart-btn">
            Start Shopping <i className="fa-solid fa-arrow-right ms-2"></i>
          </Link>

          <div className="fresh-empty-cart-cats">
            <small>Popular Categories</small>
            <div>
              {popularCategories.map((category) => (
                <Link to="/categories" key={category}>{category}</Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
