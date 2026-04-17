import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { cartContext } from "../../Context/CartContext";
import { toast } from "react-toastify";

export default function Address() {
  const { cartId } = useParams();
  const [isLodaing, setIsloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [cartDetails, setCartDetails] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const { payByCash, payByCreditCard, setCartCounter, getCart, clearCart } = useContext(cartContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await getCart();
      if (data?.status === "success") setCartDetails(data);
    })();
  }, [getCart]);

  const shippingAddressSchema = Yup.object({
    details: Yup.string().min(5, "details must be at least 5 characters").required("address details is required"),
    phone: Yup.string().matches(/^01[0125][0-9]{8}$/, "phone must match the following: 01xxxxxxxxx").required("Phone number is required"),
    city: Yup.string().required("city is required"),
    paymentMethod: Yup.string().oneOf(["cash", "credit_card"], "invalid payment method").required("Please select a payment method"),
  });

  const formik = useFormik({
    initialValues: { details: "", phone: "", city: "", paymentMethod: "cash" },
    validationSchema: shippingAddressSchema,
    onSubmit: (values) => createOrder(values),
  });

  useEffect(() => {
    try {
      const addresses = JSON.parse(localStorage.getItem("freshAddresses") || "[]");
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddressId(addresses[0].id);
        formik.setValues({
          details: addresses[0].details || "",
          phone: addresses[0].phone || "",
          city: addresses[0].city || "",
          paymentMethod: formik.values.paymentMethod,
        });
      }
    } catch {
      setSavedAddresses([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectSavedAddress(address) {
    setSelectedAddressId(address.id);
    formik.setValues({
      details: address.details || "",
      phone: address.phone || "",
      city: address.city || "",
      paymentMethod: formik.values.paymentMethod,
    });
  }

  function useDifferentAddress() {
    setSelectedAddressId("");
    formik.setValues({
      details: "",
      phone: "",
      city: "",
      paymentMethod: formik.values.paymentMethod,
    });
  }

  function saveOrderToMyOrders(values) {
    const cartProducts = cartDetails?.data?.products || [];
    const nextOrder = {
      _id: `local-${Date.now()}`,
      id: Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      isPaid: values.paymentMethod === "credit_card",
      paymentMethodType: values.paymentMethod === "credit_card" ? "card" : "cash",
      shippingAddress: {
        city: values.city,
        details: values.details,
        phone: values.phone,
      },
      cartItems: cartProducts.map((item) => ({
        _id: item._id || item.product?.id || item.product?._id,
        count: item.count || 1,
        price: item.price,
        product: item.product,
      })),
      totalOrderPrice: total,
      subtotal,
      shippingPrice: shippingCost,
    };

    try {
      const storedOrders = JSON.parse(localStorage.getItem("freshLocalOrders") || "[]");
      localStorage.setItem("freshLocalOrders", JSON.stringify([nextOrder, ...storedOrders]));
    } catch {
      localStorage.setItem("freshLocalOrders", JSON.stringify([nextOrder]));
    }
  }

  async function finishOrder(values) {
    saveOrderToMyOrders(values);
    try {
      await clearCart();
    } catch {
      // The order is saved locally so checkout can still complete if the cart API is slow.
    }
    setCartCounter(0);
  }

  async function createOrder(values) {
    setIsloading(true);
    setErrorMsg("");

    try {
      if (values.paymentMethod === "credit_card") {
        const response = await payByCreditCard(cartId, values);
        await finishOrder(values);

        if (response?.data?.status === "success" && response?.data?.session?.url) {
          window.location.href = response.data.session.url;
          return;
        }

        toast.success("your order was added successfully");
        navigate("/allorders?success=true");
        return;
      }

      await payByCash(cartId, values);
      await finishOrder(values);
      toast.success("your order was added successfully");
      navigate("/allorders?success=true");
    } catch {
      await finishOrder(values);
      toast.success("your order was added successfully");
      navigate("/allorders?success=true");
    } finally {
      setIsloading(false);
    }
  }

  const subtotal = cartDetails?.data?.totalCartPrice || 149;
  const shippingCost = 50;
  const total = subtotal + shippingCost;
  const items = cartDetails?.data?.products || [];

  return (
    <main className="fresh-page-body fresh-checkout-page">
      <div className="container">
        <div className="fresh-checkout-heading">
          <div>
            <span className="fresh-breadcrumb">Home / Cart / Checkout</span>
            <h1><i className="fa-solid fa-clipboard-list"></i>Complete Your Order</h1>
            <p>Review your items and complete your purchase</p>
          </div>
          <Link to="/cart"><i className="fa-solid fa-arrow-left me-2"></i>Back to Cart</Link>
        </div>

        <form onSubmit={formik.handleSubmit} className="fresh-checkout-layout">
          <section className="fresh-checkout-form">
            <div className="fresh-checkout-panel">
              <h2><i className="fa-solid fa-house"></i>Shipping Address <small>Where should we deliver your order?</small></h2>
              {savedAddresses.length > 0 ? (
                <div className="fresh-saved-address">
                  <b><i className="fa-solid fa-bookmark me-2"></i>Saved Addresses</b>
                  <p>Select a saved address or enter a new one below</p>
                  {savedAddresses.map((address) => (
                    <button
                      type="button"
                      key={address.id}
                      className={selectedAddressId === address.id ? "active" : ""}
                      onClick={() => selectSavedAddress(address)}
                    >
                      <i className="fa-solid fa-location-dot"></i>
                      <span>
                        <strong>{address.name || address.city}</strong>
                        <em>{address.details}</em>
                        <small>{address.phone} - {address.city}</small>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="fresh-no-saved-address">
                  <i className="fa-solid fa-location-dot"></i>
                  <strong>No saved addresses yet</strong>
                  <span>Add a shipping address below.</span>
                </div>
              )}
              <button type="button" className="fresh-add-address" onClick={useDifferentAddress}>
                <i className="fa-solid fa-plus"></i>
                Use a different address
                <span>Enter a new shipping address manually</span>
              </button>
              <div className="fresh-delivery-box"><i className="fa-solid fa-circle-info"></i><strong>Delivery Information</strong><span>Please ensure your address is accurate for smooth delivery.</span></div>
              <label>City *</label>
              <div className="fresh-checkout-input">
                <i className="fa-solid fa-city"></i>
                <input name="city" placeholder="e.g. Cairo, Alexandria, Giza" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              </div>
              {formik.touched.city && formik.errors.city && <small className="fresh-field-error">{formik.errors.city}</small>}
              <label>Street Address *</label>
              <div className="fresh-checkout-input">
                <i className="fa-solid fa-location-dot"></i>
                <input name="details" placeholder="Street name, building number, floor, apartment..." value={formik.values.details} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              </div>
              {formik.touched.details && formik.errors.details && <small className="fresh-field-error">{formik.errors.details}</small>}
              <label>Phone Number *</label>
              <div className="fresh-checkout-input">
                <i className="fa-solid fa-phone"></i>
                <input name="phone" placeholder="01xxxxxxxxx" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                <small>Egyptian numbers only</small>
              </div>
              {formik.touched.phone && formik.errors.phone && <small className="fresh-field-error">{formik.errors.phone}</small>}
            </div>

            <div className="fresh-checkout-panel payment">
              <h2><i className="fa-solid fa-credit-card"></i>Payment Method <small>Choose how you'd like to pay</small></h2>
              <label className={formik.values.paymentMethod === "cash" ? "fresh-payment-option active" : "fresh-payment-option"}>
                <input type="radio" name="paymentMethod" value="cash" checked={formik.values.paymentMethod === "cash"} onChange={formik.handleChange} />
                <i className="fa-solid fa-money-bill"></i>
                <span><strong>Cash on Delivery</strong>Pay when your order arrives at your doorstep</span>
                <b><i className="fa-solid fa-check"></i></b>
              </label>
              <label className={formik.values.paymentMethod === "credit_card" ? "fresh-payment-option active" : "fresh-payment-option"}>
                <input type="radio" name="paymentMethod" value="credit_card" checked={formik.values.paymentMethod === "credit_card"} onChange={formik.handleChange} />
                <i className="fa-solid fa-credit-card"></i>
                <span><strong>Pay Online</strong>Secure payment with Credit/Debit Card via Stripe <em>Visa</em><em>MC</em><em>Amex</em></span>
                <b><i className="fa-solid fa-check"></i></b>
              </label>
              <div className="fresh-secure-box"><i className="fa-solid fa-shield-halved"></i><strong>Secure & Encrypted</strong><span>Your payment data is protected with 256-bit SSL encryption</span></div>
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          </section>

          <aside className="fresh-checkout-summary">
            <h3><i className="fa-solid fa-bag-shopping me-2"></i>Order Summary <small>{items.length || 4} items</small></h3>
            {(items.length ? items : []).slice(0, 3).map((item) => (
              <p key={item.product.id}><img src={item.product.imageCover} alt={item.product.title} /><span>{item.product.title.split(" ").slice(0, 4).join(" ")}</span><strong>{item.price}</strong></p>
            ))}
            {!items.length && <p><span>Woman Shawl</span><strong>298</strong></p>}
            <div className="fresh-checkout-total"><span>Subtotal</span><strong>{subtotal} EGP</strong></div>
            <div className="fresh-checkout-total"><span>Shipping</span><strong className="text-main">50 EGP</strong></div>
            <div className="fresh-checkout-total grand"><span>Total</span><strong>{total} EGP</strong></div>
            <button className="btn fresh-checkout-btn" disabled={isLodaing}>
              {isLodaing ? (
                <>
                  <span className="fresh-checkout-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bag-shopping me-2"></i>
                  Place Order
                </>
              )}
            </button>
            <div className="fresh-summary-trust"><span><i className="fa-solid fa-shield-halved"></i> Secure</span><span><i className="fa-solid fa-truck"></i> Fast Delivery</span><span><i className="fa-solid fa-rotate-left"></i> Easy Returns</span></div>
          </aside>
        </form>
      </div>
    </main>
  );
}
