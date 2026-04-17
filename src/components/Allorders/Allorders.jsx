import React, { useCallback, useContext, useEffect, useState } from "react";
import Loading from "./../Loading/Loading";
import EmptyContent from "../EmptyContent/EmptyContent";
import emptyOrders from "../../assets/images/emptyOrders.svg";
import Order from "../Order/Order";
import { orderContext } from "../../Context/OrderContext";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Allorders() {
  const { getUserAllOrders, allOrders, setAllOrders } = useContext(orderContext);
  const [isloading, setIsLoading] = useState(true);

  const getUserOrders = useCallback(async () => {
    let apiOrders = [];
    try {
      const response = await getUserAllOrders();
      apiOrders = response?.data ? response.data.reverse() : [];
    } catch {
      apiOrders = [];
    }

    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem("freshLocalOrders") || "[]");
    } catch {
      localOrders = [];
    }

    setAllOrders([...localOrders, ...apiOrders]);
    setIsLoading(false);
  }, [getUserAllOrders, setAllOrders]);

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  if (isloading) return <Loading />;
  if (!allOrders || allOrders?.length <= 0) {
    return (
      <EmptyContent
        imageSrc={emptyOrders}
        message={"You don't have any orders yet."}
        details={"Start exploring our products and add items to your cart to place your first order!"}
      />
    );
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-All Orders</title>
      </Helmet>
      <main className="fresh-page-body fresh-orders-page">
        <div className="container">
          <div className="fresh-orders-heading">
            <div>
              <span className="fresh-breadcrumb">Home / My Orders</span>
              <h1><i className="fa-solid fa-bag-shopping"></i>My Orders</h1>
              <p>Track and manage your {allOrders.length} {allOrders.length === 1 ? "order" : "orders"}</p>
            </div>
            <Link to="/products"><i className="fa-solid fa-bag-shopping me-2"></i>Continue Shopping</Link>
          </div>
          <div className="fresh-orders-list">
            {allOrders?.map((item, index) => (
              <Order key={item._id} item={item} expanded={index === 0} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}