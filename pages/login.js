import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import baseUrl from "../helpers/baseUrl";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const userLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" });
    } else {
      console.log(res2);
      Cookies.set("token", res2.token);
      Cookies.set("user", JSON.stringify(res2.user));
      // localStorage.setItem("user", JSON.stringify(res2.user));
      router.push("/account");
    }
  };
  return (
    <div className="container card authcard center-align">
      <h3>LOGIN</h3>
      <form onSubmit={(e) => userLogin(e)}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit">
          login
          <i className="material-icons right">forward</i>
        </button>
        <Link href="/signup">
          <h5>Dont have a account ?</h5>
        </Link>
      </form>
    </div>
  );
};

export default Login;
