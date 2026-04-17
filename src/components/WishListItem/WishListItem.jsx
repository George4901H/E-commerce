import React, { useContext, useState } from "react";
import { wishlistContext } from "../../Context/WishlistContext";
import { toast } from "react-toastify";
import { cartContext } from "../../Context/CartContext";
import { Link } from "react-router-dom";
import fallbackProduct from "../../assets/images/slider/ad-banner-2.jpg";

export default function WishListItem({ item, setwishList, wishList }) {
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const { setWishlistProductsId, setWishlistCounter, deleteFromWishlist } = useContext(wishlistContext);
  const { setCartCounter, addToCart } = useContext(cartContext);

  async function addProductToCart(productId) {
    setIsLoadingAdd(true);
    const { data } = await addToCart(productId);
    if (data.status === "success") {
      toast.success("Product added successfully");
      setCartCounter(data.numOfCartItems);
    }
    setIsLoadingAdd(false);
  }

  async function removeProductFromWishlist(productId) {
    setIsLoadingRemove(true);
    const { data } = await deleteFromWishlist(productId);
    setIsLoadingRemove(false);
    if (data?.status === "success") {
      toast.error(data.message);
      setWishlistProductsId(data.data);
      setWishlistCounter(data.data.length);
      setwishList(wishList.filter((item) => item.id !== productId));
    }
  }

  return (
    <article className="fresh-wishlist-row">
      <div>
        <img
          src={item.imageCover || fallbackProduct}
          alt={item.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackProduct;
          }}
        />
        <Link to={`/product-details/${item.slug}/${item._id}`}>
          <strong>{item.title}</strong>
          <small>{item.category?.name || "Men's Fashion"}</small>
        </Link>
      </div>
      <strong>{item.price} EGP</strong>
      <span className="fresh-stock">In Stock</span>
      <div>
        <button className="btn fresh-table-add" onClick={() => addProductToCart(item._id)} disabled={isLoadingAdd}>
          {isLoadingAdd ? "..." : <><i className="fa-solid fa-cart-plus me-1"></i>Add to Cart</>}
        </button>
        <button className="fresh-table-delete" onClick={() => removeProductFromWishlist(item._id)} disabled={isLoadingRemove}>
          {isLoadingRemove ? "..." : <i className="fa-solid fa-trash"></i>}
        </button>
      </div>
    </article>
  );
}
