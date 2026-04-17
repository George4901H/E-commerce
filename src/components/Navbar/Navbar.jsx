import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/logo.svg";
import "./Navbar.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { tokenContext } from "../../Context/TokenContext";
import { cartContext } from "../../Context/CartContext";
import { wishlistContext } from "../../Context/WishlistContext";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

export default function Navbar() {
  const [navToggle, setNavToggle] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [navbarCategories, setNavbarCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail") || "demo@gmail.com";
  let { token, setToken } = useContext(tokenContext);
  let { cartCounter, setCartCounter, getCart } = useContext(cartContext);
  let {
    wishlistCounter,
    setWishlistCounter,
    setWishlistProductsId,
    getWishlist,
  } = useContext(wishlistContext);
  const displayName = userName || "demo";
  const authToken = token || localStorage.getItem("token");

  let navigate = useNavigate();
  const location = useLocation();

  function logOut() {
    localStorage.clear();
    setToken(null);
    navigate("/auth/signin");
  }

  function goToProducts(e) {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    setNavToggle(false);
    navigate(trimmedSearch ? `/products?search=${encodeURIComponent(trimmedSearch)}` : "/products");
  }

  function closeMenus() {
    setAccountOpen(false);
    setCategoryOpen(false);
    setNavToggle(false);
  }

  function goToAccountTab(path) {
    closeMenus();
    navigate(path);
  }

  function isNavbarCategoryActive(category) {
    const activeCategory = decodeURIComponent(location.pathname + location.search).toLowerCase();
    return activeCategory.includes(category.name?.toLowerCase());
  }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/categories`);
        setNavbarCategories(data?.data || []);
      } catch (err) {
        setNavbarCategories([
          { _id: "women", name: "Women's Fashion" },
          { _id: "men", name: "Men's Fashion" },
          { _id: "beauty", name: "Beauty & Health" },
        ]);
      }
    })();
  }, []);

  useEffect(() => {
    if (authToken) {
      (async () => {
        const cartResponse = await getCart();
        if (cartResponse?.data?.status === "success") {
          setCartCounter(cartResponse.data.numOfCartItems || 0);
        }

        const wishlistResponse = await getWishlist();
        if (wishlistResponse?.data?.status === "success") {
          const wishlistItems = wishlistResponse.data.data || [];
          setWishlistCounter(wishlistItems.length);
          setWishlistProductsId(wishlistItems.map((item) => item._id));
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  useEffect(() => {
    closeMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <header className="fresh-header bg-white">
      <div className="fresh-topbar d-none d-lg-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-5">
            <span><i className="fa-solid fa-truck-fast text-main me-2"></i>Free Shipping on Orders 500 EGP</span>
            <span><i className="fa-solid fa-gift text-main me-2"></i>New Arrivals Daily</span>
          </div>
          <div className="d-flex align-items-center gap-4">
            <span><i className="fa-solid fa-phone me-2"></i>+1 (800) 123-4567</span>
            <span><i className="fa-regular fa-envelope me-2"></i>support@freshcart.com</span>
            {authToken && <Link to="/account/settings" className="fresh-link-btn"><i className="fa-regular fa-user me-2"></i>{displayName}</Link>}
            {authToken ? (
              <button className="btn fresh-link-btn" onClick={logOut}>
                <i className="fa-solid fa-right-from-bracket me-2"></i>Sign Out
              </button>
            ) : (
              <>
                <Link to="/auth/signin" className="fresh-link-btn">
                  <i className="fa-solid fa-right-to-bracket me-2"></i>Sign In
                </Link>
                <Link to="/auth/signup" className="fresh-link-btn">
                  <i className="fa-solid fa-user-plus me-2"></i>Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fresh-mainbar">
        <div className="container">
          <div className="fresh-mainbar-row">
          <div className="fresh-logo-wrap">
            <Link to="/">
              <img src={logo} alt="FreshCart Logo" className="fresh-logo" />
            </Link>
          </div>

          <div className="fresh-search-wrap d-none d-lg-block">
            <form className="fresh-search" onSubmit={goToProducts}>
              <input
                type="text"
                className="form-control"
                placeholder="Search for products, brands and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn" type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>

          <nav className="fresh-nav-wrap d-none d-lg-flex">
            <ul className="fresh-nav list-unstyled d-flex align-items-center mb-0">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/products">Shop</NavLink></li>
              <li
                className="fresh-category-menu"
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
              >
                <button
                  type="button"
                  className="fresh-nav-button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  Categories <i className={`fa-solid fa-chevron-${categoryOpen ? "up" : "down"} ms-1`}></i>
                </button>
                {categoryOpen && (
                  <div className="fresh-category-dropdown">
                    <Link to="/categories" onClick={closeMenus}>All Categories</Link>
                    {getNavbarCategoryLinks(navbarCategories).map((item) => (
                      <Link
                        key={item._id}
                        className={isNavbarCategoryActive(item) ? "active" : ""}
                        to={item._id.length > 10 ? `/products/category/${encodeURIComponent(item.name)}/${item._id}` : "/categories"}
                        onClick={closeMenus}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              <li><NavLink to="/brands">Brands</NavLink></li>
            </ul>
          </nav>

          <div className="fresh-actions">
            <Link to="/contact" className="support-pill d-none d-xl-flex">
              <i className="fa-solid fa-headset"></i>
              <span>Support<br /><strong>24/7 Help</strong></span>
            </Link>
            <Link to="/wishlist" className="fresh-icon-link position-relative">
              <i className="fa-regular fa-heart"></i>
              <span className="fresh-count-badge danger">{wishlistCounter || 0}</span>
            </Link>

            <Link to="/cart" className="fresh-icon-link position-relative">
              <i className="fa-solid fa-cart-shopping"></i>
              <span className="fresh-count-badge">{cartCounter || 0}</span>
            </Link>

            <div className="fresh-account-menu">
              <button
                type="button"
                className="fresh-icon-link fresh-account-trigger d-none d-lg-inline-flex"
                onClick={() => {
                  if (!authToken) {
                    navigate("/auth/signin");
                    return;
                  }
                  setAccountOpen(!accountOpen);
                }}
                onBlur={() => setTimeout(() => setAccountOpen(false), 160)}
                aria-label="Account menu"
              >
                <i className="fa-regular fa-circle-user"></i>
              </button>
              {authToken && accountOpen && (
                <div className="fresh-account-dropdown" onMouseDown={(e) => e.preventDefault()}>
                  <div className="fresh-account-user">
                    <span><i className="fa-regular fa-user"></i></span>
                    <div>
                      <strong>{displayName}</strong>
                      <small>{userEmail}</small>
                    </div>
                  </div>
                  <button type="button" className="fresh-account-dropdown-link" onClick={() => goToAccountTab("/account/settings")}><i className="fa-regular fa-user"></i>My Profile</button>
                  <button type="button" className="fresh-account-dropdown-link" onClick={() => goToAccountTab("/allorders")}><i className="fa-solid fa-box-open"></i>My Orders</button>
                  <button type="button" className="fresh-account-dropdown-link" onClick={() => goToAccountTab("/wishlist")}><i className="fa-regular fa-heart"></i>My Wishlist</button>
                  <button type="button" className="fresh-account-dropdown-link" onClick={() => goToAccountTab("/account/addresses")}><i className="fa-regular fa-address-book"></i>Addresses</button>
                  <button type="button" className="fresh-account-dropdown-link" onClick={() => goToAccountTab("/account/settings")}><i className="fa-solid fa-gear"></i>Settings</button>
                  <button type="button" className="fresh-account-signout" onMouseDown={(e) => e.preventDefault()} onClick={logOut}>
                    <i className="fa-solid fa-right-from-bracket"></i>Sign Out
                  </button>
                </div>
              )}
            </div>

            <button className="btn fresh-mobile-menu-btn d-lg-none" onClick={() => setNavToggle(!navToggle)} aria-label="Open menu">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
      </div>

      {navToggle && <button type="button" className="fresh-mobile-backdrop d-lg-none" onClick={() => setNavToggle(false)} aria-label="Close menu"></button>}
      <aside className={`fresh-mobile-nav d-lg-none ${navToggle ? "show" : ""}`}>
        <div className="fresh-mobile-menu-head">
          <img src={logo} alt="FreshCart" />
          <button type="button" onClick={() => setNavToggle(false)} aria-label="Close menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="fresh-mobile-search" onSubmit={goToProducts}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>

        <div className="fresh-mobile-link-group">
          <NavLink to="/" onClick={() => setNavToggle(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setNavToggle(false)}>Shop</NavLink>
          <NavLink to="/categories" onClick={() => setNavToggle(false)}>Categories</NavLink>
          <NavLink to="/brands" onClick={() => setNavToggle(false)}>Brands</NavLink>
        </div>

        <div className="fresh-mobile-link-group bordered">
          <NavLink to="/wishlist" onClick={() => setNavToggle(false)}>
            <i className="fa-regular fa-heart"></i>
            Wishlist
            <span>{wishlistCounter || 0}</span>
          </NavLink>
          <NavLink to="/cart" onClick={() => setNavToggle(false)}>
            <i className="fa-solid fa-cart-shopping"></i>
            Cart
            <span>{cartCounter || 0}</span>
          </NavLink>
        </div>

        <div className="fresh-mobile-link-group bordered">
          {authToken ? (
            <>
              <NavLink to="/account/settings" onClick={() => setNavToggle(false)}><i className="fa-regular fa-user"></i>{displayName}</NavLink>
              <button className="fresh-mobile-signout" onClick={logOut}><i className="fa-solid fa-right-from-bracket"></i>Sign Out</button>
            </>
          ) : (
            <div className="fresh-mobile-auth-actions">
              <NavLink to="/auth/signin" onClick={() => setNavToggle(false)}>Sign In</NavLink>
              <NavLink to="/auth/signup" onClick={() => setNavToggle(false)}>Sign Up</NavLink>
            </div>
          )}
        </div>

        <Link to="/contact" className="fresh-mobile-help" onClick={() => setNavToggle(false)}>
          <i className="fa-solid fa-headset"></i>
          <span>Need Help?<strong>Contact Support</strong></span>
        </Link>
      </aside>
    </header>
  );
}

function getNavbarCategoryLinks(categories) {
  const wanted = ["Electronics", "Women's Fashion", "Men's Fashion", "Beauty & Health"];
  const normalizedCategories = categories || [];

  return wanted.map((name) => {
    const match = normalizedCategories.find((item) => item.name?.toLowerCase() === name.toLowerCase());
    return match || { _id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name };
  });
}
