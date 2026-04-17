import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { baseUrl } from "../../../utils/baseUrl";

export default function ForgotPassword() {
  const [errorMsg, setErrorMsg] = useState(false);
  const [isLodaing, setIsloading] = useState(false);
  const navigate = useNavigate();

  const ForgotPasswordSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: localStorage.getItem("resetEmail") || "" },
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values) => forgotPassword(values),
  });

  async function forgotPassword(values) {
    setIsloading(true);
    setErrorMsg(false);
    axios
      .post(`${baseUrl}/auth/forgotPasswords`, values)
      .then((data) => {
        if (data.data?.statusMsg === "success") {
          localStorage.setItem("resetEmail", values.email);
          navigate("/auth/verify-reset-code");
        } else {
          setErrorMsg("Unable to send reset code. Please try again.");
        }
      })
      .catch((error) => setErrorMsg(error.response?.data?.message || "Unable to send reset code."))
      .finally(() => setIsloading(false));
  }

  return (
    <>
      <Helmet>
        <title>FreshCart-Forgot Password</title>
      </Helmet>
      <ResetShell>
        <section className="fresh-reset-card">
          <h2><span>Fresh</span>Cart</h2>
          <h3>Forgot Password?</h3>
          <p>No worries, we'll send you a reset code</p>
          <ResetSteps step={1} />
          <form onSubmit={formik.handleSubmit}>
            <label>Email Address</label>
            <div className="fresh-reset-input">
              <i className="fa-solid fa-envelope"></i>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.email && formik.touched.email && <div className="fresh-auth-error">{formik.errors.email}</div>}
            {errorMsg && <div className="alert alert-danger text-center font-sm">{errorMsg}</div>}
            <button type="submit" className="btn fresh-auth-submit" disabled={isLodaing}>
              {isLodaing ? <span className="spinner-border spinner-border-sm"></span> : "Send Reset Code"}
            </button>
            <Link to="/auth/signin" className="fresh-change-email">← Back to Sign In</Link>
            <div className="fresh-reset-bottom">Remember your password? <Link to="/auth/signin">Sign In</Link></div>
          </form>
        </section>
      </ResetShell>
    </>
  );
}

export function ResetShell({ children }) {
  return (
    <main className="fresh-reset-page">
      <div className="container">
        <div className="fresh-reset-grid">
          <section className="fresh-reset-illustration">
            <div className="fresh-reset-art">
              <span></span><span></span><span></span>
              <div className="fresh-reset-icons">
                <i className="fa-solid fa-envelope"></i>
                <i className="fa-solid fa-lock active"></i>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="fresh-reset-dots"><b></b><b></b><b></b></div>
            </div>
            <h1>Reset Your Password</h1>
            <p>Don't worry, it happens to the best of us. We'll help you get back into your account in no time.</p>
            <div className="fresh-reset-benefits">
              <span><i className="fa-solid fa-envelope"></i>Email Verification</span>
              <span><i className="fa-solid fa-shield"></i>Secure Reset</span>
              <span><i className="fa-solid fa-lock"></i>Encrypted</span>
            </div>
          </section>
          {children}
        </div>
      </div>
    </main>
  );
}

export function ResetSteps({ step }) {
  return (
    <div className="fresh-reset-steps">
      <span className={step >= 1 ? "done" : ""}><i className={step > 1 ? "fa-solid fa-check" : "fa-solid fa-envelope"}></i></span>
      <b className={step >= 2 ? "done" : ""}></b>
      <span className={step >= 2 ? "done" : ""}><i className={step > 2 ? "fa-solid fa-check" : "fa-solid fa-key"}></i></span>
      <b className={step >= 3 ? "done" : ""}></b>
      <span className={step >= 3 ? "done" : ""}><i className="fa-solid fa-lock"></i></span>
    </div>
  );
}
