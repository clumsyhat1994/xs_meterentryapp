import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "./api";

const ReadingReportForm = () => {
  const [meterData, setMeterData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [meterId, setMeterId] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const { id: pathParamMeterId } = useParams();
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const GET_METER_INFO_URL =
    "http://phaseddd.s7.tunnelfrp.com/business/h5/getMeterInfoById";
  const POST_METER_READING_URL =
    "http://phaseddd.s7.tunnelfrp.com/business/h5/submitMeterReading";
  const GET_READING_LIST_URL =
    "http://phaseddd.s7.tunnelfrp.com/business/h5/getMeterReadingList";

  const NUM_OF_READING_ENTRY = 5;
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
      redirectToLogin();
      setErrorMessage("系统错误，请联系管理员！");
    }
  }, [pathParamMeterId, redirectToLogin]);

  const fetchReadingHistory = useCallback(async () => {
    const baseDateStr =
      meterData.latestReadingTime?.split(" ")[0] ||
      new Date().toISOString.slice(0, 10);
    const baseDate = new Date(baseDateStr);
    baseDate.setMonth(baseDate.getMonth() - 2);
    const startTime = baseDate.toISOString().slice(0, 10);

    try {
      if (!meterId) return;
      const url = `${GET_READING_LIST_URL}?id=${meterId}&startTime=${startTime}`;
      const response = await api.get(url);
      if (response.data.code === 200 && Array.isArray(response.data.data)) {
        setReadingHistory(response.data.data);
      } else {
        console.warn("Failed to load reading history: ", response.data.msg);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    }
  }, [meterData, meterId]);

  const renderRows = () => {
    const list = showAllHistory
      ? readingHistory
      : readingHistory.slice(0, NUM_OF_READING_ENTRY);
    return list.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.readingValue}</td>
          <td>{item.readingTime}</td>
          <td>{item.readerName}</td>
        </tr>
      );
    });
  };

  useEffect(() => {
    if (pathParamMeterId) {
      setIsLoading(true);
      fetchMeterData();
    } else {
      setErrorMessage("扫描水表ID失败");
    }
  }, [pathParamMeterId, fetchMeterData]);

  useEffect(() => {
    if (meterId) {
      fetchReadingHistory();
    }
  }, [meterId, fetchReadingHistory]);

  const onSubmit = (data) => {
    setErrorMessage("");
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
          {meterData && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <dl className="row g-0 mb-3">
                <dt className="col-5">水表ID：</dt>
                <dd className="col-7 fw-bold">{meterData.id}</dd>

                <dt className="col-5">水表名称：</dt>
                <dd className="col-7 fw-bold">{meterData.meterName}</dd>

                <dt className="col-5">上次抄表读数：</dt>
                <dd className="col-7 fw-bold">{meterData.latestReading}</dd>
                <dt className="col-5">上次抄表时间：</dt>
                <dd className="col-7 fw-bold">{meterData.latestReadingTime}</dd>
              </dl>
              <label htmlFor="reading" className="form-label fw-bold">
                本次读数:
              </label>
              <input
                id="reading"
                type="number"
                step="0.01"
                className={`form-control  mb-2 ${
                  errors.reading ? "is-invalid" : ""
                }`}
                {...register("reading", {
                  required: "请输入读数",
                  onChange: (e) => {
                    setMessage("");
                    e.target.setCustomValidity("");
                    if (!e.target.validity.valid)
                      e.target.setCustomValidity(
                        "请输入数字，最大精度为小数点后两位"
                      );
                  },
                })}
                placeholder="输入水表读数"
                onInvalid={(e) => {
                  const { validity } = e.target;
                  console.log(validity);
                  e.target.setCustomValidity(
                    "请输入数字，最大精度为小数点后两位"
                  );
                }}
              />
              {errors.reading && (
                <div className="invalid-feedback mb-2">
                  {errors.reading.message}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary w-100 mb-2"
                style={{ backgroundColor: "rgb(23, 51, 114)", border: "none" }}
              >
                确认
              </button>

              {message && (
                <div className="alert alert-success mb-2" role="alert">
                  {message}
                </div>
              )}
            </form>
          )}
          {errorMessage && (
            <div className="alert alert-danger mb-2" role="alert">
              {errorMessage}
            </div>
          )}
          {readingHistory.length > 0 && (
            <div>
              <h6 className="text-center border-bottom mt-3 fw-bold pb-2">
                近两月抄表历史
              </h6>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>读数</th>
                    <th>抄表时间</th>
                    <th>抄表人</th>
                  </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
              </table>
              {readingHistory.length > 5 && (
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setShowAllHistory((v) => !v)}
                >
                  {showAllHistory ? "收起" : "展开"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingReportForm;
