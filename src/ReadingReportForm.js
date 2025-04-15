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
  const [meterId, setMeterId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const { id: pathParamMeterId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const { ref: scanRef } = useZxing({
    onDecodeResult(result) {
      console.log(result.getText());
    },
  });

  // useEffect(() => {
  //   if (scanResult) {
  //     setScannedData(scanResult.getText());
  //     setIsScanning(false);
  //   }
  // }, [scanResult]);

  // useEffect(() => {
  //   if (scanError) {
  //     alert("二维码扫描失败，请重试！");
  //     console.error("Error scanning QR code:", scanError);
  //     setIsScanning(false);
  //   }
  // }, [scanError]);

  const token = localStorage.getItem("accessToken");

  const GET_METER_INFO_URL =
    "http://phaseddd.s7.tunnelfrp.com/business/h5/getMeterInfoById";
  const POST_METER_READING_URL =
    "http://phaseddd.s7.tunnelfrp.com/business/h5/submitMeterReading";

  const fetchMeterData = async () => {
    console.log("jwt: ", localStorage.getItem("authToken"));
    try {
      const response = await axios.get(
        `${GET_METER_INFO_URL}?id=${pathParamMeterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log("获取水表", response.data);
      if (response.data.code === 200) {
        setMeterData(response.data.data);
        setMeterId(response.data.data.id);
        setIsLoading(false);
      } else {
        setErrorMessage(response.data.msg);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (pathParamMeterId) {
      setIsLoading(true);
      fetchMeterData();
    } else {
      setErrorMessage("扫描水表ID失败");
    }
  }, [pathParamMeterId]);

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
    console.log("开始抄表");
    if (meterId) {
      setIsLoading(true);
      axios
        .post(
          POST_METER_READING_URL,
          {
            id: meterId,
            readingValue: parseFloat(data.reading),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        )
        .then((response) => {
          console.log("抄表", response.data);
          if (response.data.code === 200) {
            setMessage("抄表成功！");
            setErrorMessage("");
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
                <h4>请扫描二维码v1.2</h4>
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
          <h4>{token}</h4>
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
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              {message && <p className="text-success">{message}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingReportForm;
