/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { wishlistContext } from "../../Context/WishlistContext";
import Loading from "../Loading/Loading";
import WishListItem from "../WishListItem/WishListItem";
import emptyWishlist from "../../assets/images/emptyWishlist.svg";
import EmptyContent from "../EmptyContent/EmptyContent";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function WishList() {
  const { getWishlist } = useContext(wishlistContext);
  const [isloading, setIsLoading] = useState(true);
  const [wishList, setwishList] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await getWishlist();
      if (data?.status === "success") setwishList(data?.data);
      setIsLoading(false);
    })();
  }, []);

  if (isloading) return <Loading />;
  if (!wishList || wishList?.length === 0) {
    return <EmptyContent imageSrc={emptyWishlist} message={"your wishlist is empty"} />;
  }

  return (
    <>
      <Helmet>
        <title>FreshCart-WishList</title>
      </Helmet>
      <main className="fresh-page-body fresh-wishlist-page">
        <div className="container">
          <span className="fresh-breadcrumb">Home / Wishlist</span>
          <h1><i className="fa-solid fa-heart me-3"></i>My Wishlist</h1>
          <p className="fresh-wishlist-count">{wishList?.length} items saved</p>
          <section className="fresh-wishlist-table">
            <header><span>Product</span><span>Price</span><span>Status</span><span>Actions</span></header>
            {wishList?.map((item) => (
              <WishListItem key={item.id} item={item} setwishList={setwishList} wishList={wishList} />
            ))}
          </section>
          <Link to="/products" className="fresh-continue-shopping">← Continue Shopping</Link>
        </div>
      </main>
    </>
  );
}
