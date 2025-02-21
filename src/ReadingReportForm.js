import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const ReadingReportForm = () => {
  //const [meterId, setMeterId] = useState();
  const [meterData, setMeterData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  //const [token,setToken] = useState(localStorage.getItem('jwtToken'));
  const [isLoading, setIsLoading] = useState(false);
  //const { id: meterId } = useParams();
  const meterId = 6;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const token = localStorage.getItem("authToken");

  const GET_METER_INFO_URL = "";
  const POST_METER_READING_URL = `api/meters/${meterId}/readings`;

  useEffect(() => {
    if (meterId) {
      console.log("***********************************");
      setIsLoading(true);
      /******************************************** */
      setMeterData({ id: 12, location: "港口大厦一楼", last_reading: 108.5 });
      setIsLoading(false);
      return;
      /******************************************** */
      axios
        .get(`${GET_METER_INFO_URL}/${meterId}`)
        .then((response) => {
          setMeterData(response.data);
        })
        .catch((error) => {
          setErrorMessage("扫描水表失败！请稍后再试。");
          console.log("Error fetching meter data:", error);
        })
        .finally(() => setIsLoading(false));
    } else {
      setErrorMessage("读取水表ID失败");
    }
  }, [meterId]);

  const onSubmit = (data) => {
    /******************************************** */
    setMessage("抄表成功！");
    return;
    /******************************************** */
    if (meterId) {
      setIsLoading(true);
      axios
        .post(`/api/meters/${meterId}/readings`, {
          reading: parseFloat(data.reading),
        })
        .then((response) => {
          setMessage("抄表成功！");
          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage("系统忙，抄表失败！请稍后再试");
          console.log("Error submitting reading:", error);
        })
        .finally(() => setIsLoading(false));
    }
  };

  console.log(meterData);

  return (
    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-11 col-md-6 col-lg-4">
        <div className="Card shadow p-4">
          {isLoading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">加载中...</span>
            </div>
          )}
          {meterData && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <dl className="row g-0 mb-3">
                <dt className="col-4">水表ID：</dt>
                <dd className="col-8 fw-bold">{meterData.id}</dd>

                <dt className="col-4">水表定位：</dt>
                <dd className="col-8 fw-bold">{meterData.location}</dd>

                <dt className="col-4">上月读数：</dt>
                <dd className="col-8 fw-bold">{meterData.last_reading}</dd>
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
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingReportForm;
