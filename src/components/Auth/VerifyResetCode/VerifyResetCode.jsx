import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { baseUrl } from "../../../utils/baseUrl";
import { ResetShell, ResetSteps } from "../ForgotPassword/ForgotPassword";

export default function VerifyResetCode() {
  const [errorMsg, setErrorMsg] = useState(false);
  const [isLodaing, setIsloading] = useState(false);
  const navigate = useNavigate();
  const resetEmail = localStorage.getItem("resetEmail") || "demo@gmail.com";

  const verifyResetCodeSchema = Yup.object({
    resetCode: Yup.string().required("Verification code is required"),
  });

  const formik = useFormik({
    initialValues: { resetCode: "" },
    validationSchema: verifyResetCodeSchema,
    onSubmit: (values) => verifyResetCode(values),
  });

  async function verifyResetCode(values) {
    setIsloading(true);
    setErrorMsg(false);
    axios
      .post(`${baseUrl}/auth/verifyResetCode`, values)
      .then((data) => {
        if (data.data?.status === "Success") {
          localStorage.setItem("resetCodeVerified", "true");
          navigate("/auth/reset-password");
        } else {
          setErrorMsg("Invalid verification code.");
        }
      })
      .catch((error) => setErrorMsg(error.response?.data?.message || "Invalid verification code."))
      .finally(() => setIsloading(false));
  }

  return (
    <>
      <Helmet>
        <title>FreshCart-Verify Reset Code</title>
      </Helmet>
      <ResetShell>
        <section className="fresh-reset-card">
          <h2><span>Fresh</span>Cart</h2>
          <h3>Check Your Email</h3>
          <p>Enter the 6-digit code sent to <strong>{resetEmail}</strong></p>
          <ResetSteps step={2} />
          <form onSubmit={formik.handleSubmit}>
            <label>Verification Code</label>
            <div className="fresh-reset-input">
              <i className="fa-solid fa-shield-halved"></i>
              <input
                name="resetCode"
                type="text"
                className="fresh-code-field"
                placeholder="• • • • • •"
                value={formik.values.resetCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.resetCode && formik.touched.resetCode && <div className="fresh-auth-error">{formik.errors.resetCode}</div>}
            {errorMsg && <div className="alert alert-danger text-center font-sm">{errorMsg}</div>}
            <p className="fresh-resend">Didn't receive the code? <Link to="/auth/forgot-password">Resend Code</Link></p>
            <button type="submit" className="btn fresh-auth-submit" disabled={isLodaing}>
              {isLodaing ? <span className="spinner-border spinner-border-sm"></span> : "Verify Code"}
            </button>
            <Link to="/auth/forgot-password" className="fresh-change-email">← Change email address</Link>
          </form>
        </section>
      </ResetShell>
    </>
  );
}
