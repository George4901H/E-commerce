import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { cartContext } from "../../Context/CartContext";
import { toast } from "react-toastify";
import { wishlistContext } from "../../Context/WishlistContext";
import "./Product.css";
import ModalImages from "../ModalImages/ModalImages";
import fallbackProduct from "../../assets/images/slider/ad-banner-2.jpg";

export default function Product({ item, homeMode = false }) {
  const { setCartCounter, addToCart } = useContext(cartContext);
  const { wishlistProductsId, setWishlistProductsId, setWishlistCounter, addToWishlist, deleteFromWishlist } = useContext(wishlistContext);
  const [isLoading, setisLoading] = useState(false);
  const [isWishLoading, setisWishLoading] = useState(false);

  async function addProductToCart(productId) {
    setisLoading(true);
    let { data } = await addToCart(productId);
    if (data.status === "success") {
      toast.success("Added to cart!");
      setCartCounter(data.numOfCartItems);
    }
    setisLoading(false);
  }

  const isInWishlist = wishlistProductsId?.includes(item._id);
  const productSlug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";

  async function toggleWishlist() {
    setisWishLoading(true);
    const currentWishlistIds = wishlistProductsId || [];

    try {
      if (isInWishlist) {
        const nextIds = currentWishlistIds.filter((id) => id !== item._id);
        setWishlistProductsId(nextIds);
        setWishlistCounter(nextIds.length);
        const response = await deleteFromWishlist(item._id);
        if (response?.data?.status !== "success") throw new Error("Wishlist update failed");
        const apiIds = response?.data?.data;
        if (Array.isArray(apiIds)) {
          setWishlistProductsId(apiIds);
          setWishlistCounter(apiIds.length);
        }
        toast.info("Removed from wishlist");
      } else {
        const nextIds = [...new Set([...currentWishlistIds, item._id])];
        setWishlistProductsId(nextIds);
        setWishlistCounter(nextIds.length);
        const response = await addToWishlist(item._id);
        if (response?.data?.status !== "success") throw new Error("Wishlist update failed");
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
      setisWishLoading(false);
    }
  }

  return (
    <div className={homeMode ? "fresh-product-cell" : "col-md-3 mb-4"}>
      <div className="product-card border bg-white position-relative h-100">
        {item.priceAfterDiscount && <span className="fresh-discount-badge">-{Math.round(((item.price - item.priceAfterDiscount) / item.price) * 100)}%</span>}

        <div className="fresh-product-actions">
          <button className="btn" onClick={toggleWishlist}>
            {isWishLoading ? <span className="spinner-border spinner-border-sm"></span> : 
            <i className={`${isInWishlist ? 'fa-solid text-danger' : 'fa-regular'} fa-heart fs-5`}></i>}
          </button>
          <button className="btn" type="button" aria-label="Compare product">
            <i className="fa-solid fa-rotate"></i>
          </button>
          <Link className="btn" to={`/product-details/${productSlug}/${item._id}`} aria-label="View product details">
            <i className="fa-regular fa-eye"></i>
          </Link>
        </div>

        <div className="fresh-product-image">
          <img
            src={item.imageCover || fallbackProduct}
            alt={item.title}
            loading={homeMode ? "eager" : "lazy"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackProduct;
            }}
          />
        </div>
        <p className="fresh-product-category">{item.category?.name}</p>
        <Link to={`/product-details/${productSlug}/${item._id}`} className="text-decoration-none">
          <h6 className="fresh-product-title">{item.title}</h6>
        </Link>
        <div className="fresh-product-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <i key={star} className={`${star <= Math.round(item.ratingsAverage || 0) ? "fa-solid" : "fa-regular"} fa-star`}></i>
          ))}
          <span>{item.ratingsAverage} ({item.ratingsQuantity})</span>
        </div>

        <div className="fresh-product-bottom">
          <div>
            <span className={item.priceAfterDiscount ? "fresh-sale-price" : "fresh-price"}>{item.priceAfterDiscount || item.price} EGP</span>
            {item.priceAfterDiscount && <span className="fresh-old-price">{item.price} EGP</span>}
          </div>
          <button className="btn fresh-add-btn" onClick={() => addProductToCart(item._id)} aria-label="Add to cart">
            {isLoading ? <span className="spinner-border spinner-border-sm"></span> : <i className="fa-solid fa-plus"></i>}
          </button>
        </div>

        <ModalImages item={item} addProductToCart={addProductToCart} isLoading={isLoading} />
      </div>
    </div>
  );
}
