import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { baseUrl } from "../../utils/baseUrl";
import { cartContext } from "./../../Context/CartContext";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { wishlistContext } from "../../Context/WishlistContext";

export default function ProductDetails({ productId, setCategoryId }) {
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isWishLoading, setIsWishLoading] = useState(false);
  let { setCartCounter, addToCart } = useContext(cartContext);
  const { wishlistProductsId, setWishlistProductsId, setWishlistCounter, addToWishlist, deleteFromWishlist } = useContext(wishlistContext);
  const navigate = useNavigate();

  async function getProductDetails() {
    setIsLoading(true);
    let { data } = await axios.get(`${baseUrl}/products/${productId}`);
    setProduct(data.data);
    setActiveImage(data.data.imageCover || data.data.images?.[0] || "");
    setCategoryId(data.data.category?._id);
    setIsLoading(false);
  }

  async function addProductToCart(productId) {
    setIsLoadingAdd(true);
    let { data } = await addToCart(productId);
    if (data.status === "success") {
      setIsLoadingAdd(false);
      toast.success("Product added successfully");
      setCartCounter(data.numOfCartItems);
    }
  }

  async function buyNow() {
    await addProductToCart(product?._id);
    navigate("/cart");
  }

  async function toggleWishlist() {
    setIsWishLoading(true);
    const isInWishlist = wishlistProductsId?.includes(product?._id);
    const currentWishlistIds = wishlistProductsId || [];

    try {
      if (isInWishlist) {
        const nextIds = currentWishlistIds.filter((id) => id !== product._id);
        setWishlistProductsId(nextIds);
        setWishlistCounter(nextIds.length);
        const response = await deleteFromWishlist(product._id);
        const apiIds = response?.data?.data;
        if (Array.isArray(apiIds)) {
          setWishlistProductsId(apiIds);
          setWishlistCounter(apiIds.length);
        }
        toast.info("Removed from wishlist");
      } else {
        const nextIds = [...new Set([...currentWishlistIds, product._id])];
        setWishlistProductsId(nextIds);
        setWishlistCounter(nextIds.length);
        const response = await addToWishlist(product._id);
        const apiIds = response?.data?.data;
        if (Array.isArray(apiIds)) {
          setWishlistProductsId(apiIds);
          setWishlistCounter(apiIds.length);
        }
        toast.success("Added to wishlist");
      }
    } catch {
      setWishlistProductsId(currentWishlistIds);
      setWishlistCounter(currentWishlistIds.length);
      toast.error("Wishlist update failed");
    } finally {
      setIsWishLoading(false);
    }
  }

  async function shareProduct() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied");
    } catch {
      toast.info("Share this page from your browser");
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    getProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (isLoading) return <Loading />;
  const images = [product?.imageCover, ...(product?.images || [])].filter(Boolean);
  const uniqueImages = [...new Set(images)];
  const price = product?.priceAfterDiscount || product?.price || 0;
  const totalPrice = price * quantity;
  const discount = product?.priceAfterDiscount ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100) : 10;
  const isInWishlist = wishlistProductsId?.includes(product?._id);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{product.title}</title>
        <meta name="keywords" content={product.slug} />
      </Helmet>

      <main className="fresh-product-details-page">
        <div className="container">
          <nav className="fresh-details-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={`/products/category/${product?.category?.name}/${product?.category?._id}`}>{product?.category?.name}</Link>
            <span>/</span>
            <strong>{product?.title}</strong>
          </nav>

          <div className="fresh-product-details">
            <div className="fresh-details-gallery">
              <div className="fresh-details-main-image">
                <img src={activeImage} alt={product?.title} />
              </div>
              <div className="fresh-details-thumbs">
                {uniqueImages.map((img, index) => (
                  <button
                    className={img === activeImage ? "active" : ""}
                    key={img}
                    onClick={() => setActiveImage(img)}
                    type="button"
                  >
                    <img src={img} alt={`${product?.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="fresh-details-info">
              <div className="fresh-details-tags">
                <span>{product?.category?.name}</span>
                <span>Defacto</span>
              </div>
              <h2>{product?.title}</h2>
              <div className="fresh-product-rating">
                {[1, 2, 3, 4, 5].map((star) => <i key={star} className={`${star <= Math.round(product?.ratingsAverage || 0) ? "fa-solid" : "fa-regular"} fa-star`}></i>)}
                <small>{product?.ratingsAverage || 0} ({product?.ratingsQuantity || 0})</small>
              </div>
              <div className="fresh-details-price-row">
                <strong>{price} EGP</strong>
                {product?.priceAfterDiscount && <del>{product.price} EGP</del>}
                <em>Save {discount}%</em>
              </div>
              <span className="fresh-stock-badge"><i className="fa-solid fa-circle"></i> In Stock</span>

              <div className="fresh-details-description">
                <p>{product?.description}</p>
              </div>

              <div className="fresh-details-quantity">
                <small>Quantity</small>
                <div>
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <strong>{quantity}</strong>
                  <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <span>{product?.quantity || 22} available</span>
              </div>

              <div className="fresh-details-total">
                <span>Total Price:</span>
                <strong>{totalPrice.toFixed(2)} EGP</strong>
              </div>

              <div className="fresh-details-actions">
                <button
                  className="btn fresh-details-cart"
                  onClick={() => addProductToCart(product?._id)}
                  disabled={isLoadingAdd}
                >
                  {isLoadingAdd ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-cart-shopping me-2"></i>}
                  Add to Cart
                </button>
                <button className="btn fresh-details-buy" type="button" onClick={buyNow}>
                  <i className="fa-solid fa-bolt me-2"></i>Buy Now
                </button>
              </div>

              <div className="fresh-details-secondary">
                <button className={isInWishlist ? "in-wishlist" : ""} type="button" onClick={toggleWishlist}>
                  {isWishLoading ? <span className="fresh-wishlist-spinner"></span> : <i className={`${isInWishlist ? "fa-solid" : "fa-regular"} fa-heart`}></i>}
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
                <button type="button" onClick={shareProduct}><i className="fa-solid fa-share-nodes"></i></button>
              </div>

              <div className="fresh-details-benefits">
                <div><i className="fa-solid fa-truck"></i><strong>Free Delivery</strong><small>Orders over 500</small></div>
                <div><i className="fa-solid fa-rotate-left"></i><strong>30 Days Return</strong><small>Money back</small></div>
                <div><i className="fa-solid fa-shield-halved"></i><strong>Secure Payment</strong><small>100% Protected</small></div>
              </div>
            </div>
          </div>

          <section className="fresh-details-tabs">
            <div className="fresh-details-tab-nav">
              <button className={activeTab === "details" ? "active" : ""} type="button" onClick={() => setActiveTab("details")}><i className="fa-solid fa-box me-2"></i>Product Details</button>
              <button className={activeTab === "reviews" ? "active" : ""} type="button" onClick={() => setActiveTab("reviews")}><i className="fa-solid fa-star me-2"></i>Reviews ({product?.ratingsQuantity || 1})</button>
              <button className={activeTab === "shipping" ? "active" : ""} type="button" onClick={() => setActiveTab("shipping")}><i className="fa-solid fa-truck me-2"></i>Shipping & Returns</button>
            </div>
            {activeTab === "details" && (
              <div className="fresh-details-tab-body">
                <h3>About this Product</h3>
                <p>{product?.description}</p>
                <div className="fresh-details-info-grid">
                  <div>
                    <h4>Product Information</h4>
                    <p><span>Category</span><strong>{product?.category?.name}</strong></p>
                    <p><span>Sub-category</span><strong>{product?.subcategory?.[0]?.name || "Women's Clothing"}</strong></p>
                    <p><span>Brand</span><strong>{product?.brand?.name || "DeFacto"}</strong></p>
                    <p><span>Items Sold</span><strong>{product?.sold || 295}+ sold</strong></p>
                  </div>
                  <div>
                    <h4>Key Features</h4>
                    <ul>
                      <li>Premium Quality Product</li>
                      <li>100% Authentic Guarantee</li>
                      <li>Fast & Secure Packaging</li>
                      <li>Quality Tested</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "reviews" && <ReviewsPanel rating={product?.ratingsAverage || 5} count={product?.ratingsQuantity || 1} />}
            {activeTab === "shipping" && <ShippingPanel />}
          </section>
        </div>
      </main>
    </>
  );
}

function ReviewsPanel({ rating, count }) {
  const rows = [
    ["5", 60],
    ["4", 25],
    ["3", 5],
    ["2", 5],
    ["1", 5],
  ];

  return (
    <div className="fresh-reviews-panel">
      <div className="fresh-review-score">
        <strong>{Math.round(rating)}</strong>
        <div>
          {[1, 2, 3, 4, 5].map((star) => <i key={star} className="fa-solid fa-star"></i>)}
        </div>
        <p>Based on {count} review{count === 1 ? "" : "s"}</p>
      </div>
      <div className="fresh-review-bars">
        {rows.map(([stars, percent]) => (
          <div className="fresh-review-bar-row" key={stars}>
            <span>{stars}<small>star</small></span>
            <div><b style={{ width: `${percent}%` }}></b></div>
            <em>{percent}%</em>
          </div>
        ))}
      </div>
      <div className="fresh-review-empty">
        <i className="fa-solid fa-star"></i>
        <p>Customer reviews will be displayed here.</p>
        <button type="button">Write a Review</button>
      </div>
    </div>
  );
}

function ShippingPanel() {
  return (
    <div className="fresh-shipping-panel">
      <div className="fresh-shipping-grid">
        <div className="fresh-shipping-card">
          <span><i className="fa-solid fa-truck"></i></span>
          <h3>Shipping Information</h3>
          <p><i className="fa-solid fa-check"></i>Free shipping on orders over $50</p>
          <p><i className="fa-solid fa-check"></i>Standard delivery: 3-5 business days</p>
          <p><i className="fa-solid fa-check"></i>Express delivery available (1-2 business days)</p>
          <p><i className="fa-solid fa-check"></i>Track your order in real-time</p>
        </div>
        <div className="fresh-shipping-card">
          <span><i className="fa-solid fa-rotate-left"></i></span>
          <h3>Returns & Refunds</h3>
          <p><i className="fa-solid fa-check"></i>30-day hassle-free returns</p>
          <p><i className="fa-solid fa-check"></i>Full refund or exchange available</p>
          <p><i className="fa-solid fa-check"></i>Free return shipping on defective items</p>
          <p><i className="fa-solid fa-check"></i>Easy online return process</p>
        </div>
      </div>
      <div className="fresh-protection-card">
        <span><i className="fa-solid fa-shield-halved"></i></span>
        <div>
          <h3>Buyer Protection Guarantee</h3>
          <p>Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping experience is safe and secure.</p>
        </div>
      </div>
    </div>
  );
}
