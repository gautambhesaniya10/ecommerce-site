import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import baseUrl from "../../helpers/baseUrl";

const Product = (props) => {
  const { products } = props;
  console.log("productsproducts", products);
  const router = useRouter();
  const modalRef = useRef(null);
  const cookie = parseCookies();
  const cookie2 = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  const [quantity,setQuantity] = useState(1);

  useEffect(() => {
    M.Modal.init(modalRef.current);
  }, []);

  const getModal = () => {
    return (
      <>
        <div id="modal1" className="modal" ref={modalRef}>
          <div className="modal-content">
            <h4>{products.name}</h4>
            <p>Are you sure you want to delete this</p>
          </div>
          <div className="modal-footer">
            <button className="btn waves-effect waves-light #1565c0 blue darken-3">cancel</button>
            <button className="btn waves-effect waves-light #c62828 red darken-3" onClick={() => deleteProduct()}>
              Yes
            </button>
          </div>
        </div>
      </>
    );
  };

  const AddToCart = async ()=>{
    const res =  await fetch(`${baseUrl}/api/cart`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":cookie.token
      },
      body:JSON.stringify({
       quantity,
       productId:products._id
      })
    })
  const res2 = await res.json()
  if(res2.error){
     M.toast({html:error,classes:"red"})
     cookie2.remove("user")
     cookie2.remove("token")
     router.push('/login')
  }
  M.toast({html:res2.message,classes:"green"})

  }

  const deleteProduct = async () => {
    // debugger
    const res = await fetch(`${baseUrl}/api/product/${products._id}`, {
      method: "DELETE",
    });
    await res.json();
    router.push("/");
  };

  return (
    <div className="container center-align">
      <h3>{products?.name}</h3>
      <img src={products?.mediaUrl} style={{ width: "30%" }} />
      <h5>RS {products?.price}</h5>
      <input
        type="number"
        style={{ width: "400px", margin: "10px" }}
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Qunatity"
      />
      {user ? (
      <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => AddToCart()}>
        Add
        <i className="material-icons right">add</i>
      </button>
      ) : (
      <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => router.push("/login")}>
          Login To Add
          <i className="material-icons right">add</i>
        </button>
      )}

      <p className="left-align">{products?.discription}</p>

      {user.role != "user" || user.role === "" && (
      <button data-target="modal1" className="btn modal-trigger waves-effect waves-light #c62828 red darken-3">
        Delete
        <i className="material-icons left">delete</i>
      </button>
      )}

      {getModal()}
    </div>
  );
};

export async function getServerSideProps(context) {
  // console.log("cccccccc",context?.params?.id);

  const res = await fetch(`${baseUrl}/api/product/${context?.params?.id}`);
  const ProductData = await res.json();
  return {
    props: {
      products: ProductData,
    },
  };
}

// export async function getStaticProps(context) {
//   // console.log("cccccccc",context?.params?.id);

//   const res = await fetch(`http://localhost:3000/api/product/${context?.params?.id}`);
//   const ProductData = await res.json();
//   return {
//     props: {
//       products: ProductData,
//     },
//   };
// }

// export async function getStaticPaths() {

//     return {
//       paths: [{ params: { id: '63f45c41361caa50a757541b' } }],
//       fallback: false, // can also be true or 'blocking'
//     }
//   }

export default Product;
