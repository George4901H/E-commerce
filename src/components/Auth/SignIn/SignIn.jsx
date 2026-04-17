import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { tokenContext } from "../../../Context/TokenContext";
import { Helmet } from "react-helmet";
import heroImage from "../../../assets/images/signup-cart.png";

export default function SignIn() {
  const { updateToken } = useContext(tokenContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isLodaing, setIsloading] = useState(false);
  const navigate = useNavigate();

  const SigninSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: SigninSchema,
    onSubmit: (values) => login(values),
  });

  async function login(values) {
    setIsloading(true);
    axios
      .post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values)
      .then((data) => {
        if (data.data.message === "success") {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userName", data.data.user?.name || "demo");
          localStorage.setItem("userEmail", data.data.user?.email || values.email);
          updateToken(data.data.token);
          navigate("/");
        }
      })
      .catch((error) => {
        setErrorMsg(error.response?.data?.message || "Unable to sign in");
      })
      .finally(() => setIsloading(false));
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-signin</title>
      </Helmet>
      <section className="fresh-page-label auth-label">
        <h1><i className="fa-solid fa-cart-shopping"></i> Login Page</h1>
        <p>Last Updated: <strong>9 Feb 2026</strong></p>
      </section>
      <main className="fresh-auth-page signin">
        <div className="container">
          <div className="fresh-auth-grid">
            <section className="fresh-auth-marketing">
              <div className="fresh-auth-image">
                <img src={heroImage} alt="Fresh groceries" />
              </div>
              <h1>FreshCart - Your One-Stop Shop for Fresh Products</h1>
              <p>Join thousands of happy customers who trust FreshCart for their daily grocery needs.</p>
              <div className="fresh-auth-benefits">
                <span><i className="fa-solid fa-circle-check"></i> Free Delivery</span>
                <span><i className="fa-solid fa-circle-check"></i> Secure Payment</span>
                <span><i className="fa-solid fa-circle-check"></i> 24/7 Support</span>
              </div>
            </section>

            <section className="fresh-auth-card">
              <h2><span>Fresh</span>Cart</h2>
              <h3>Welcome Back!</h3>
              <p>Sign in to continue your fresh shopping experience</p>
              <div className="fresh-social-login">
                <button className="btn"><i className="fa-brands fa-google"></i>Continue with Google</button>
                <button className="btn"><i className="fa-brands fa-facebook"></i>Continue with Facebook</button>
              </div>
              <div className="fresh-auth-divider">OR CONTINUE WITH EMAIL</div>
              <form onSubmit={formik.handleSubmit}>
                <label>Email Address</label>
                <div className="fresh-auth-input">
                  <i className="fa-regular fa-envelope"></i>
                  <input id="email" name="email" type="email" placeholder="Enter your email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </div>
                {formik.errors.email && formik.touched.email && <div className="fresh-auth-error">{formik.errors.email}</div>}

                <div className="fresh-label-row">
                  <label>Password</label>
                  <Link to="/auth/forgot-password">Forgot Password?</Link>
                </div>
                <div className="fresh-auth-input">
                  <i className="fa-solid fa-lock"></i>
                  <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}><i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i></button>
                </div>
                {formik.errors.password && formik.touched.password && <div className="fresh-auth-error">{formik.errors.password}</div>}

                <label className="fresh-check"><input type="checkbox" /> Keep me signed in</label>
                {errorMsg && <div className="alert alert-danger font-sm">{errorMsg}</div>}
                <button type="submit" className="btn fresh-auth-submit" disabled={isLodaing}>
                  {isLodaing ? <span className="spinner-border spinner-border-sm me-2"></span> : "Sign In"}
                </button>
                <p className="fresh-auth-switch">New to FreshCart? <Link to="/auth/signup">Create an account</Link></p>
                <div className="fresh-auth-trust"><span>SSL Secured</span><span>50K+ Users</span><span>4.9 Rating</span></div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
