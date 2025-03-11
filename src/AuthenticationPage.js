import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

const LOGIN_URL = "";
//const SIGNUP_URL = "";
const AuthenticationPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [loginError, setLoginError] = useState(null);

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
    const accessToken = "access_token_for_test ";
    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("loggedIn", "true");

    //************************************** */
    navigate("/meter-reading-test/6");
    return;
    //************************************** */
    try {
      const response = await axios.post(LOGIN_URL, data);
      localStorage.setItem("authToken", response.data.token);
      navigate("/meter-reading");
      clearErrors();
    } catch (error) {
      setLoginError("用户名或密码错误！");
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
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-lable">
                密码：
              </label>
              <input
                id="password"
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                {...register("password", { required: "请输入密码" })}
              />
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
