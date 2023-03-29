import Layout from "@/components/Layout";
import { IDBOrder } from "@/types";
import { getError } from "@/utils/error";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import Actions from "./actions";

interface IReducerState {
  loading: boolean;
  order: IDBOrder;
  error: string;
}

interface IReducerAction<T> {
  type: string;
  payload?: T;
}

const initialState = {
  loading: true,
  order: {} as IDBOrder,
  error: "",
};

function reducer(
  state: IReducerState,
  action: IReducerAction<object | string>
): IReducerState {
  switch (action.type) {
    case Actions.FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case Actions.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload as IDBOrder,
        error: "",
      };
    case Actions.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload as string };
    default:
      return state;
  }
}

function OrderScreen() {
  const { query } = useRouter();
  const orderID = query.id;

  const [{ loading, error, order }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchOrder() {
      try {
        dispatch({ type: Actions.FETCH_REQUEST });
        const { data } = await axios.get(`/api/orders/${orderID}`);
        dispatch({ type: Actions.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: Actions.FETCH_FAIL, payload: getError(err) });
      }
    }

    if (!order._id || (order._id && order._id !== orderID)) {
      fetchOrder();
    }
  }, [order, orderID]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  console.log(order);

  return (
    <Layout title={`Order: ${orderID}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderID}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country},
              </div>
              {isDelivered ? (
                <div className="alert-success">
                  Delivered at {deliveredAt?.toISOString()}
                </div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">
                  Paid at {paidAt?.toISOString()}
                </div>
              ) : (
                <div className="alert-error">Not Paid</div>
              )}
            </div>
            <div className="card p-5 overflow-x-auto">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="px-5 text-left">Quantity</th>
                    <th className="px-5 text-left">Price</th>
                    <th className="px-5 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems?.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td>
                        <Link
                          className="flex items-center"
                          href={`/product/${product.slug}`}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={50}
                            height={50}
                          />
                          &nbsp;
                          {product.name}
                        </Link>
                      </td>
                      <td className="p-5 text-right">
                        {product.quantityInCart}
                      </td>
                      <td className="p-5 text-right">{product.price}</td>
                      <td className="p-5 text-right">
                        {product.quantityInCart * product.price} BYN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>{itemsPrice} BYN</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>{taxPrice} BYN</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>{shippingPrice} BYN</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>{totalPrice} BYN</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
