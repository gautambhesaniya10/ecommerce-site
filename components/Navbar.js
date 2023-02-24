import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

const Navbar = () => {
  const router = useRouter();
  // console.log("routerrrr", router?.pathname);
  const cookieuser = parseCookies();
  const user = cookieuser?.user ? JSON.parse(cookieuser?.user) : "";

  const IsActive = (route) => {
    if (router?.pathname === route) {
      return "active";
    } else {
      return "";
    }
  };

  return (
    <nav>
      <div className="nav-wrapper #1565c0 blue darken-3">
        <Link legacyBehavior href="/">
          <a className="brand-logo left">My Store</a>
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">

        <li className={IsActive('/cart')}><Link href="/cart">Cart</Link></li>

          {(user?.role == "admin" || user?.role == "root") && (
            <li className={IsActive("/create")}>
              <Link href="/create">create</Link>
            </li>
          )}

          {user ? (
            <>
              <li className={IsActive("/account")}>
                <Link href="/account">Account</Link>
              </li>
              <li>
                <button
                  className="btn red"
                  onClick={() => {
                    Cookies.remove("token");
                    Cookies.remove("user");
                    router.push("/login");
                  }}
                >
                  logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={IsActive("/login")}>
                <Link href="/login">login</Link>
              </li>
              <li className={IsActive("/signup")}>
                <Link href="/signup">signup</Link>
              </li>
            </>
          )}

          {/* <li className={IsActive("/login")}>
            <Link legacyBehavior href="/login">
              <a>Login</a>
            </Link>
          </li>
          <li className={IsActive("/signup")}>
            <Link legacyBehavior href="/signup">
              <a>SignUp</a>
            </Link>
          </li>
          <li className={IsActive("/create")}>
            <Link legacyBehavior href="/create">
              <a>Create</a>
            </Link>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
