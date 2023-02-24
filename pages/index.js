import Link from "next/link";
import baseUrl from "../helpers/baseUrl";
import styles from "../styles/Home.module.css";

function Home(props) {
  const { products } = props;

  // console.log("propspropspropsprops", products);

  const productList = products?.map((items) => {
    return (
      <>
        <div key={items?._id} >
          <div className="col s12 m6">
            <div className="card pcard">
              <div className="card-image">
                <img src={items?.mediaUrl} />
              </div>
              <div className="card-content">
                <span className="card-title">{items?.name}</span>
                <p>RS . {items?.price}</p>
              </div>
              <div className="card-action">
                <Link legacyBehavior href={`/product/${items?._id}`}>
                  View Product
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  });

  return <div className="rootcard"> {productList}</div>;
}

export async function getStaticProps(context) {
  const res = await fetch(`${baseUrl}/api/products`);
  const ProductData = await res.json();
  // console.log("ProductData++++", ProductData);
  return {
    props: {
      products: ProductData,
    },
  };
}

export default Home;
