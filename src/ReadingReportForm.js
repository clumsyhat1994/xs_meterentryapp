import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "./api";

import { Scanner } from "./Scanner";

const ReadingReportForm = () => {
  const [meterData, setMeterData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [meterId, setMeterId] = useState(null);
  const { id: pathParamMeterId } = useParams();
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();

  const GET_METER_INFO_URL =
    "http://phaseddd.s7.tunnelfrp.com/business/h5/getMeterInfoById";
  const POST_METER_READING_URL =
    "http://phaseddd.s7.tunnelfrp.com/business/h5/submitMeterReading";

  const redirectToLogin = useCallback(() => {
    if (window.location.pathname !== "/login") {
      navigate("/login", {
        state: { from: currentPath },
        replace: true,
      });
    }
  }, [navigate, currentPath]);

  const fetchMeterData = useCallback(async () => {
    try {
      const response = await api.get(
        `${GET_METER_INFO_URL}?id=${pathParamMeterId}`
      );
      console.log("获取水表", response.data);
      if (response.data.code === 401) {
        redirectToLogin();
        return;
      }
      if (response.data.code === 200) {
        setMeterData(response.data.data);
        setMeterId(response.data.data.id);
        setIsLoading(false);
      } else {
        setErrorMessage(response.data.msg);
      }
    } catch (error) {
      setErrorMessage("系统错误，请联系管理员！");
    }
  }, [pathParamMeterId, redirectToLogin]);

  useEffect(() => {
    if (pathParamMeterId) {
      setIsLoading(true);
      fetchMeterData();
    } else {
      setErrorMessage("扫描水表ID失败");
    }
  }, [pathParamMeterId, fetchMeterData]);

  const onSubmit = (data) => {
    if (meterId) {
      setIsLoading(true);
      api
        .post(POST_METER_READING_URL, {
          id: meterId,
          readingValue: parseFloat(data.reading),
        })
        .then((response) => {
          if (response.data.code === 401) {
            redirectToLogin();
          }
          if (response.data.code === 200) {
            setMessage("抄表成功！");
            setErrorMessage("");
            reset();
            fetchMeterData();
          } else {
            setErrorMessage(response.data.msg);
          }
        })
        .catch((error) => {
          setErrorMessage("抄表失败,请联系管理员");
          console.log("Error submitting reading:", error);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-11 col-md-6 col-lg-4">
        <div className="Card shadow p-4">
          {isLoading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">加载中...</span>
            </div>
          )}
          {/* <Scanner /> */}
          {meterData && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <dl className="row g-0 mb-3">
                <dt className="col-4">水表ID：</dt>
                <dd className="col-8 fw-bold">{meterData.id}</dd>

                <dt className="col-4">水表名称：</dt>
                <dd className="col-8 fw-bold">{meterData.meterName}</dd>

                <dt className="col-4">上月读数：</dt>
                <dd className="col-8 fw-bold">{meterData.latestReading}</dd>
              </dl>
              <label htmlFor="reading" className="form-label fw-bold">
                本月读数:
              </label>
              <input
                id="reading"
                type="number"
                step="0.01"
                className={`form-control  mb-2 ${
                  errors.reading ? "is-invalid" : ""
                }`}
                {...register("reading", { required: "请输入读数" })}
                placeholder="输入水表读数"
              />
              {errors.reading && (
                <div className="invalid-feedback">{errors.reading.message}</div>
              )}
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{ backgroundColor: "rgb(23, 51, 114)", border: "none" }}
              >
                确认
              </button>

              {message && <p className="text-success">{message}</p>}
            </form>
          )}{" "}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingReportForm;
