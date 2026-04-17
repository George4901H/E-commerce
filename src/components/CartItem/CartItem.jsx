import React, { useContext, useState } from "react";
import { cartContext } from "../../Context/CartContext";
import { toast } from "react-toastify";
import "./CartItem.css";

export default function CartItem({ item, setCartDetails }) {
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const { setCartCounter, deleteItem, updateQty } = useContext(cartContext);

  async function removeItemFromCart(productId) {
    setIsLoadingRemove(true);
    const { data } = await deleteItem(productId);
    if (data?.status === "success") {
      setCartCounter(data.numOfCartItems);
      setCartDetails(data);
      toast.error("Product removed successfully");
    }
    setIsLoadingRemove(false);
  }

  async function updateItemCountInCart(productId, count) {
    if (count <= 0) return removeItemFromCart(productId);

    setIsLoadingUpdate(true);
    const { data } = await updateQty(productId, count);
    if (data?.status === "success") {
      setCartCounter(data.numOfCartItems);
      setCartDetails(data);
      toast.success("Product updated successfully.");
    }
    setIsLoadingUpdate(false);
  }

  return (
    <article className="fresh-cart-item">
      <img src={item.product.imageCover} alt={item.product.title} />
      <div className="fresh-cart-info">
        <h3>{item.product.title.split(" ").slice(0, 6).join(" ")}</h3>
        <p><em>{item.product.category?.name || "Women's Fashion"}</em> <span>SKU: {item.product._id?.slice(-6).toUpperCase()}</span></p>
        <strong>{item.price} EGP <small>per unit</small></strong>
        <small><i className="fa-solid fa-circle-check"></i> In Stock</small>
        <div className="fresh-cart-qty">
          <button disabled={item.count <= 1 || isLoadingUpdate} onClick={() => updateItemCountInCart(item.product.id, item.count - 1)}>−</button>
          <span>{item.count}</span>
          <button disabled={isLoadingUpdate} onClick={() => updateItemCountInCart(item.product.id, item.count + 1)}>+</button>
        </div>
      </div>
      <div className="fresh-cart-total">
        <span>Total</span>
        <strong>{item.price * item.count} <small>EGP</small></strong>
        <button disabled={isLoadingRemove} onClick={() => removeItemFromCart(item.product.id)}>
          {isLoadingRemove ? <span className="spinner-border spinner-border-sm"></span> : <i className="fa-solid fa-trash-can"></i>}
        </button>
      </div>
    </article>
  );
}
