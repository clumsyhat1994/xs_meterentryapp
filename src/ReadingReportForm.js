import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useZxing } from "react-zxing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";

const ReadingReportForm = () => {
  const [meterData, setMeterData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { id: meterId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();
  const { scanRef, result: scanResult, error: scanError } = useZxing();

  useEffect(() => {
    if (scanResult) {
      setScannedData(scanResult.getText());
      setIsScanning(false);
    }
  }, [scanResult]);

  useEffect(() => {
    if (scanError) {
      alert("二维码扫描失败，请重试！");
      console.error("Error scanning QR code:", scanError);
      setIsScanning(false);
    }
  }, [scanError]);

  const token = localStorage.getItem("authToken");

  const GET_METER_INFO_URL = "";
  const POST_METER_READING_URL = `api/meters/${meterId}/readings`;

  useEffect(() => {
    if (meterId) {
      console.log("***********************************");
      setIsLoading(true);
      /******************************************** */
      setMeterData({
        id: meterId,
        location: "港口大厦一楼",
        last_reading: 108.5,
      });
      setIsLoading(false);
      return;
      /******************************************** */
      // axios
      //   .get(`${GET_METER_INFO_URL}/${meterId}`)
      //   .then((response) => {
      //     setMeterData(response.data);
      //   })
      //   .catch((error) => {
      //     setErrorMessage("扫描水表失败！请稍后再试。");
      //     console.log("Error fetching meter data:", error);
      //   })
      //   .finally(() => setIsLoading(false));
    } else {
      setErrorMessage("读取水表ID失败");
    }
  }, [meterId]);

  // const handleScan = (result) => {
  //   if (result) {
  //     setScannedData(result.getText());
  //     setIsScanning(false);
  //   }
  // };

  // const handleScanError = () => {
  //   console.error("Error scanning QR code:", scanError);
  // };

  const onSubmit = (data) => {
    /******************************************** */
    setMessage("抄表成功！");
    return;
    /******************************************** */
    // if (meterId) {
    //   setIsLoading(true);
    //   axios
    //     .post(`/api/meters/${meterId}/readings`, {
    //       reading: parseFloat(data.reading),
    //     })
    //     .then((response) => {
    //       setMessage("抄表成功！");
    //       setErrorMessage("");
    //     })
    //     .catch((error) => {
    //       setErrorMessage("抄表失败！请稍后再试");
    //       console.log("Error submitting reading:", error);
    //     })
    //     .finally(() => setIsLoading(false));
    // }
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
          <div className="row mb-2">
            {!isScanning ? (
              <button
                type="button"
                className="btn btn secondary w-100 mb-3"
                onClick={() => setIsScanning(true)}
              >
                <FontAwesomeIcon icon={faCamera} size="lg" />
              </button>
            ) : (
              <div>
                <h4>请扫描二维码</h4>
                {/* <Reader
                  onResult={handleScan}
                  onError={handleScanError}
                  constraints={{ video: { facingMode: "environment" } }}
                /> */}
                <video ref={scanRef} />
                <button
                  type="button"
                  className="btn btn-danger w-100 mt-3"
                  onClick={() => setIsScanning(false)}
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>
            )}
          </div>
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
