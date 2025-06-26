import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./DoctorHistory.scss";
import { FormattedMessage } from "react-intl";
import { getHistoryPatientsByDoctor } from "../../../services/userService";
import moment from "moment";

const DoctorHistory = ({ userInfo }) => {
    const [dataHistory, setDataHistory] = useState([]);
    const [date, setDate] = useState(""); // yyyy-mm-dd

    useEffect(() => {
        let ignore = false;

        const fetchHistory = async () => {
            if (!userInfo || !userInfo.id) return;
            let res = await getHistoryPatientsByDoctor(userInfo.id);

            // Debug: log API response
            console.log("FE - API response:", res);

            if (!ignore) {
                // CHỈNH SỬA: Hỗ trợ cả object và array trả về từ API
                if (Array.isArray(res)) {
                    setDataHistory(res);
                    console.log("FE - setDataHistory (array):", res);
                } else if (res && res.errCode === 0 && Array.isArray(res.data)) {
                    setDataHistory(res.data);
                    console.log("FE - setDataHistory (object.data):", res.data);
                } else {
                    setDataHistory([]);
                }
            }
        };

        if (userInfo && userInfo.id) {
            fetchHistory();
        }

        return () => {
            ignore = true;
        };
    }, [userInfo]);

    // Debug log
    useEffect(() => {
        console.log("FE - dataHistory state:", dataHistory);
    }, [dataHistory]);

    useEffect(() => {
        console.log("FE - date state:", date);
    }, [date]);

    const handleDateChange = (e) => {
        setDate(e.target.value);
        console.log("Ngày trên input:", e.target.value);
    };

    const historyToShow = date
        ? dataHistory.filter(item =>
            !!item.date && moment(Number(item.date)).isValid()
            && moment(Number(item.date)).format("YYYY-MM-DD") === date
        )
        : dataHistory;

    // Debug log
    useEffect(() => {
        console.log("FE - historyToShow:", historyToShow);
    }, [historyToShow]);

    return (
        <div className="doctor-history-container">
            <div className="doctor-history-title">
                <FormattedMessage id="doctor.history.title" defaultMessage="LỊCH SỬ KHÁM BỆNH" />
            </div>
            <div className="doctor-history-filter">
                <label>
                    <FormattedMessage id="doctor.history.chooseDate" defaultMessage="Chọn ngày khám" />{" "}
                    <input type="date" value={date} onChange={handleDateChange} />
                </label>
            </div>
            <div className="doctor-history-table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Thời gian</th>
                            <th>Họ tên</th>
                            <th>Giới tính</th>
                            <th>SĐT</th>
                            <th>Email</th>
                            <th>Địa chỉ</th>
                            <th>Lý do khám</th>
                            <th>Trạng thái</th> {/* Thêm cột trạng thái */}
                        </tr>
                    </thead>
                    <tbody>
                        {historyToShow && historyToShow.length > 0 ? (
                            historyToShow.map((item, idx) => {
                                const patient = item.patientData || {};
                                const timeTypeObj = item.timeTypeDataPatient || {};
                                const timeType = timeTypeObj.valueVi || timeTypeObj.valueEn || "-";
                                const dateStr =
                                    !!item.date && moment(Number(item.date)).isValid()
                                        ? moment(Number(item.date)).format("DD/MM/YYYY")
                                        : "-";
                                const fullName =
                                    (patient.lastName ? patient.lastName : "") +
                                    (patient.firstName ? " " + patient.firstName : "");
                                const gender =
                                    patient.gender === "M"
                                        ? "Nam"
                                        : patient.gender === "F"
                                            ? "Nữ"
                                            : "-";
                                const phone =
                                    patient.phonenumber ||
                                    item.phoneNumber ||
                                    "-";
                                const email = patient.email || "-";
                                const address =
                                    patient.address ||
                                    item.address ||
                                    "-";
                                const reason = item.reason || "-";
                                const status =
                                    item.statusId === "S4"
                                        ? "Đã hủy"
                                        : item.statusId === "S3"
                                            ? "Đã khám"
                                            : "-"; // Hiển thị trạng thái

                                // Log từng dòng sẽ render ra bảng
                                console.log('Render dòng:', {
                                    idx, timeType, dateStr, fullName, gender, phone, email, address, reason, status
                                });

                                return (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            {timeType} <br /> {dateStr}
                                        </td>
                                        <td>{fullName || "-"}</td>
                                        <td>{gender}</td>
                                        <td>{phone}</td>
                                        <td>{email}</td>
                                        <td>{address}</td>
                                        <td>{reason}</td>
                                        <td>{status}</td> {/* Thêm trạng thái vào cột */}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center", fontStyle: "italic", color: "#888" }}>
                                    Không có dữ liệu lịch sử khám
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    userInfo: state.user.userInfo,
});
export default connect(mapStateToProps)(DoctorHistory);
