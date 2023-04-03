/* eslint-disable no-unused-vars */
import Layout from "@/components/Layout";
import { IDBOrder } from "@/types";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";

const enum IActions {
  FETCH_REQUEST = "FETCH_REQUEST",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_ERROR = "FETCH_ERROR",
}

interface IState {
  orders: IDBOrder[];
  loading: boolean;
  error: string;
}

interface IAction<T> {
  type: string;
  payload?: T;
}

const initialState: IState = {
  orders: [],
  loading: false,
  error: "",
};

const reducer = (state: IState, action: IAction<object | string>) => {
  const { type, payload } = action;
  switch (type) {
    case IActions.FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case IActions.FETCH_SUCCESS:
      return {
        ...state,
        orders: payload as IDBOrder[],
        loading: false,
        error: "",
      };
    case IActions.FETCH_ERROR:
      return { ...state, loading: false, error: payload as string };
    default:
      return state;
  }
};

function OrderHistoryScreen() {
  const [{ orders, loading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: IActions.FETCH_REQUEST });
        const { data } = await axios.get("/api/orders/history");
        dispatch({ type: IActions.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: IActions.FETCH_SUCCESS, payload: getError(error) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-lg">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="px-5 text-left">DATE</th>
                <th className="px-5 text-left">TOTAL</th>
                <th className="px-5 text-left">PAID</th>
                <th className="px-5 text-left">DELIVERED</th>
                <th className="px-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-5">...{order._id.substring(20, 24)}</td>
                  <td className="p-5">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-5">
                    {order.totalPrice.toString().substring(0, 10)}
                  </td>
                  <td className="p-5">
                    {order.isPaid ? order.paidAt.substring(0, 10) : "Not Paid"}
                  </td>
                  <td className="p-5">
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "Not Delivered"}
                  </td>
                  <td className="p-5">
                    <Link href={`/order/${order._id}`}>Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
