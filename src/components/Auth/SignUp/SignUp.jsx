import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { baseUrl } from "../../../utils/baseUrl";
import signupCart from "../../../assets/images/signup-cart.png";

export default function SignUp() {
  const [errorMsg, setErrorMsg] = useState(false);
  const [isLodaing, setIsloading] = useState(false);
  const navigate = useNavigate();

  const SignupSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/^[A-Z]/, "Password must start with an uppercase letter")
      .required("Password is required"),
    rePassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Please confirm your password"),
    phone: Yup.string().matches(/^01[0125][0-9]{8}$/, "01xxxxxxxxx").required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
    validationSchema: SignupSchema,
    onSubmit: (values) => register(values),
  });

  async function register(values) {
    setIsloading(true);
    setErrorMsg(false);
    axios.post(`${baseUrl}/auth/signup`, values)
      .then((data) => {
        if (data.data?.message === "success" || data.data?.status === "success" || data.data?.token) {
          navigate("/auth/signin");
        } else {
          setErrorMsg("Account created response was not recognized. Please try signing in.");
        }
      })
      .catch((err) => setErrorMsg(err.response?.data?.message || "Unable to create account"))
      .finally(() => setIsloading(false));
  }

  return (
    <>
      <Helmet><title>FreshCart - Create Account</title></Helmet>
      <section className="fresh-page-label auth-label">
        <h1><i className="fa-solid fa-cart-shopping"></i> Sign up Page</h1>
        <p>Last Updated: <strong>9 Feb 2026</strong></p>
      </section>
      <main className="fresh-auth-page signup">
        <div className="container">
          <div className="fresh-auth-grid signup-grid">
            <section className="fresh-signup-copy">
              <div className="fresh-signup-image">
                <img src={signupCart} alt="Fresh groceries in shopping cart" />
              </div>
              <h1>Welcome to <span>FreshCart</span></h1>
              <p>Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.</p>
              <div className="fresh-signup-points">
                <Point icon="fa-solid fa-star" title="Premium Quality" text="Premium quality products sourced from trusted suppliers." />
                <Point icon="fa-solid fa-truck" title="Fast Delivery" text="Same-day delivery available in most areas." />
                <Point icon="fa-solid fa-shield" title="Secure Shopping" text="Your data and payments are completely secure." />
              </div>
              <div className="fresh-testimonial">
                <div><span>Sarah Johnson</span><small>★★★★★</small></div>
                <p>FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the delivery is always on time. Highly recommend!</p>
              </div>
            </section>

            <section className="fresh-auth-card signup-card">
              <h3>Create Your Account</h3>
              <p>Start your fresh journey with us today</p>
              <div className="fresh-auth-social-row">
                <button className="btn" type="button"><i className="fa-brands fa-google"></i> Google</button>
                <button className="btn" type="button"><i className="fa-brands fa-facebook"></i> Facebook</button>
              </div>
              <div className="fresh-auth-divider">or</div>
              <form onSubmit={formik.handleSubmit}>
                <Field label="Name*" name="name" placeholder="Ali" formik={formik} />
                <Field label="Email*" name="email" type="email" placeholder="ali@example.com" formik={formik} />
                <Field label="Password*" name="password" type="password" placeholder="create a strong password" formik={formik} />
                <small className="fresh-password-note">Start with a capital letter and use at least 8 characters <b>{formik.values.password.length >= 8 ? "Good" : "Weak"}</b></small>
                <Field label="Confirm Password*" name="rePassword" type="password" placeholder="confirm your password" formik={formik} />
                <Field label="Phone Number*" name="phone" type="tel" placeholder="01012345678" formik={formik} />
                <label className="fresh-check"><input type="checkbox" /> I agree to the <Link to="/">Terms of Service</Link> and <Link to="/">Privacy Policy</Link></label>
                {Object.keys(formik.errors).length > 0 && formik.submitCount > 0 && (
                  <div className="alert alert-danger font-sm">Please fix the highlighted fields, especially phone format: 01012345678.</div>
                )}
                {errorMsg && <div className="alert alert-danger font-sm">{errorMsg}</div>}
                <button type="submit" className="btn fresh-auth-submit" disabled={isLodaing}>
                  {isLodaing ? <span className="spinner-border spinner-border-sm me-2"></span> : <><i className="fa-solid fa-user-plus me-2"></i>Create My Account</>}
                </button>
                <p className="fresh-auth-switch">Already have an account? <Link to="/auth/signin">Sign In</Link></p>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({ label, name, type = "text", placeholder, formik }) {
  return (
    <div className="fresh-field">
      <label>{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
      {formik.errors[name] && formik.touched[name] && <div className="fresh-auth-error">{formik.errors[name]}</div>}
    </div>
  );
}

function Point({ icon, title, text }) {
  return (
    <div className="fresh-signup-point">
      <i className={icon}></i>
      <span><strong>{title}</strong>{text}</span>
    </div>
  );
}
