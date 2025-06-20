import React, { useEffect, useState } from "react";
import { getPatientHistory } from "../../services/userService";
import { useSelector } from "react-redux";
import "./PatientHistory.scss";
import moment from "moment";

const PatientHistory = () => {
  const userInfo = useSelector(state => state.user.userInfo);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (userInfo && userInfo.id) {
        setLoading(true);
        const res = await getPatientHistory(userInfo.id);
        console.log("API getPatientHistory:", res);
        // Sửa ở đây: dùng res.data thay vì res.data.data
        if (res?.errCode === 0 && Array.isArray(res.data)) {
          setHistory(res.data);
        } else {
          setHistory([]);
        }
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userInfo]);

  useEffect(() => {
    // Log kiểm tra dữ liệu đã vào state chưa
    console.log("PatientHistory - history state:", history);
  }, [history]);

  return (
    <div className="patient-history-card">
      <div className="history-title">LỊCH SỬ KHÁM BỆNH</div>
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Thời gian</th>
              <th>Bác sĩ</th>
              <th>Chuyên khoa</th>
              <th>Phòng khám</th>
              
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", fontStyle: "italic" }}>Đang tải dữ liệu...</td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", fontStyle: "italic", color: "#888" }}>
                  Bạn chưa có lịch sử khám bệnh.
                </td>
              </tr>
            ) : (
              history.map((item, idx) => {
                const doctor = item.doctorData || {};
                const specialty = item.specialtyData || {};
                const clinic = item.clinicData || {};
                const dateStr = item.date
                  ? moment(Number(item.date)).isValid()
                    ? moment(Number(item.date)).format("DD/MM/YYYY")
                    : "-"
                  : "-";
                const timeTypeObj = item.timeTypeDataPatient || {};
                const timeType = timeTypeObj.valueVi || timeTypeObj.valueEn || "-";

                // Log ra từng dòng để debug
                console.log("Render dòng:", {
                  idx,
                  doctor,
                  specialty,
                  clinic,
                  item
                });

                return (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      {timeType} <br /> {dateStr}
                    </td>
                    <td>
                      {(doctor.lastName || "") + " " + (doctor.firstName || "") || "-"}
                    </td>
                    <td>{specialty.name || "-"}</td>
                    <td>{clinic.name || "-"}</td>
                    
                    <td>
                      {item.statusId === 'S2' ? "Đã khám" : "Chờ xác nhận"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;