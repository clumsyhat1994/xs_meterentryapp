import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LOGIN_URL = "http://phaseddd.s7.tunnelfrp.com/login";
const AuthenticationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const mapFormFieldsToAPI = (data, mapping) => {
    const transformedData = {};
    for (const key in data) {
      transformedData[mapping[key] || key] = data[key];
    }
    return transformedData;
  };

  const onSubmit = async (data) => {
    const mapping = {
      username: "username",
      password: "password",
    };

    data = mapFormFieldsToAPI(data, mapping);

    try {
      const response = await axios.post(LOGIN_URL, data);
      if (response.data.code === 200) {
        localStorage.setItem("authToken", response.data.token);
        setLoginError("");
        clearErrors();
        navigate(from, { replace: true });
      } else {
        setLoginError(response.data.msg);
      }
    } catch (error) {
      setLoginError("未知错误，请联系系统管理员！");
      console.log("未知错误，请联系系统管理员！:", error);
    }
  };

  return (
    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="Card shadow p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {loginError && (
              <div className="alert alert-danger" role="alert">
                {loginError}
              </div>
            )}
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-lable">
                用户名：
              </label>
              <input
                id="username"
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                {...register("username", { required: "请输入用户名" })}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="form-group mb-3 position-relative">
              <label htmlFor="password" className="form-lable">
                密码：
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control pe-5 ${
                  errors.password ? "is-invalid" : ""
                }`}
                {...register("password", { required: "请输入密码" })}
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 me-1"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
                style={{ top: "1.4rem" }}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              {/* <span
                className="position-relative"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span> */}
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              登陆
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AuthenticationPage;
