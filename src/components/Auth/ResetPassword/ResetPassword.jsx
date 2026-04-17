import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { baseUrl } from "../../../utils/baseUrl";
import { ResetShell, ResetSteps } from "../ForgotPassword/ForgotPassword";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isLodaing, setIsloading] = useState(false);
  const navigate = useNavigate();
  const resetEmail = localStorage.getItem("resetEmail") || "";

  const ResetPasswordSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/^[A-Z]/, "Password must start with an uppercase letter")
      .required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords must match").required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      email: resetEmail,
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: ({ email, newPassword }) => resetPassword({ email, newPassword }),
  });

  async function resetPassword(values) {
    setIsloading(true);
    setErrorMsg(false);
    axios
      .put(`${baseUrl}/auth/resetPassword`, values)
      .then((data) => {
        if (data.data?.token) {
          localStorage.removeItem("resetEmail");
          localStorage.removeItem("resetCodeVerified");
          navigate("/auth/signin");
        } else {
          setErrorMsg("Unable to reset password. Please try again.");
        }
      })
      .catch((error) => setErrorMsg(error.response?.data?.message || "Unable to reset password."))
      .finally(() => setIsloading(false));
  }

  return (
    <>
      <Helmet>
        <title>FreshCart-Reset Password</title>
      </Helmet>
      <ResetShell>
        <section className="fresh-reset-card">
          <h2><span>Fresh</span>Cart</h2>
          <h3>Create New Password</h3>
          <p>Your new password must be different from previous passwords</p>
          <ResetSteps step={3} />
          <form onSubmit={formik.handleSubmit}>
            <input type="hidden" name="email" value={formik.values.email} readOnly />
            {!resetEmail && (
              <>
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
              </>
            )}

            <label>New Password</label>
            <div className="fresh-reset-input">
              <i className="fa-solid fa-lock"></i>
              <input
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {formik.errors.newPassword && formik.touched.newPassword && <div className="fresh-auth-error">{formik.errors.newPassword}</div>}

            <label>Confirm Password</label>
            <div className="fresh-reset-input">
              <i className="fa-solid fa-lock"></i>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {formik.errors.confirmPassword && formik.touched.confirmPassword && <div className="fresh-auth-error">{formik.errors.confirmPassword}</div>}
            {errorMsg && <div className="alert alert-danger text-center font-sm">{errorMsg}</div>}
            <button type="submit" className="btn fresh-auth-submit" disabled={isLodaing}>
              {isLodaing ? <span className="spinner-border spinner-border-sm"></span> : "Reset Password"}
            </button>
            <Link to="/auth/signin" className="fresh-change-email">← Back to Sign In</Link>
          </form>
        </section>
      </ResetShell>
    </>
  );
}
