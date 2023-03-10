import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useState } from "react";
import baseUrl from "../helpers/baseUrl";
import StripeCheckout from "react-stripe-checkout";

const CartPage = ({ error, products }) => {
  const router = useRouter();
  const { token } = parseCookies();
  const [cProducts, setCartProduct] = useState(products);

  let price = 0;
  if (!token) {
    return (
      <div className="center-align">
        <h3>please login to view your cart</h3>
        <Link href="/login">
          <button className="btn #1565c0 blue darken-3">Login</button>
        </Link>
      </div>
    );
  }

  if (error) {
    M.toast({ html: error, classes: "red" });
    Cookies.remove("user");
    Cookies.remove("token");
    router.push("/login");
  }

  const handleRemove = async (pid) => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        productId: pid,
      }),
    });

    const res2 = await res.json();
    setCartProduct(res2);
  };

  // const CartItems = () => {
  //   return <></>;
  // };

  const handleCheckout = async (paymentInfo) => {
    // debugger
    console.log(paymentInfo);
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        paymentInfo,
      }),
    });
    const res2 = await res.json();
    // console.log("ressssssssssssssssssss",res2);
    M.toast({ html: res2.message, classes: "green " });
    router.push("/");
    M.toast({ html: res2.error, classes: "red " });
  };

  const TotalPrice = () => {
    return (
      <div className="container" style={{ display: "flex", justifyContent: "space-between" }}>
        <h5>total ₹ {price}</h5>
        {products?.length != 0 && (
          <StripeCheckout
            name="My store"
            amount={price * 100}
            image={products?.length > 0 ? products[0].product.mediaUrl : ""}
            currency="INR"
            shippingAddress={true}
            billingAddress={true}
            zipCode={true}
            stripeKey="pk_test_51MeGEgSHboxRIKsFHUrcbR8J3HG9ZVJg3asFfGuJE4RsQXWJOFW9OaEuLcwfINzHjgMMv5Zv2vukE0hbJF6RtSbq009zYbhFIB"
            token={(paymentInfo) => handleCheckout(paymentInfo)}
          >
            <button className="btn">Checkout</button>
          </StripeCheckout>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="container">
        {cProducts?.map((item) => {
          let price1 = item.quantity * item.product.price;
          price = price + price1;
          {
            console.log("0000000", item, price);
          }

          return (
            <div style={{ display: "flex", margin: "20px" }} key={item._id}>
              <img src={item.product.mediaUrl} style={{ width: "30%" }} />
              <div style={{ marginLeft: "20px" }}>
                <h6>{item.product.name}</h6>
                <h6>
                  {item.quantity} x ₹ {item.product.price}
                </h6>
                <button
                  className="btn red"
                  onClick={() => {
                    handleRemove(item.product._id);
                  }}
                >
                  remove
                </button>
              </div>
            </div>
          );
        })}
        <TotalPrice />
      </div>
    </>
  );
};

export async function getStaticProps(ctx) {
  const { token } = parseCookies(ctx);
  if (!token) {
    return {
      props: { products: [] },
    };
  }
  const res = await fetch(`${baseUrl}/api/cart`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const products = await res?.json();
  if (products.error) {
    return {
      props: { error: products.error },
    };
  }
  // console.log("products", products);
  return {
    props: { products },
  };
}

export default CartPage;
