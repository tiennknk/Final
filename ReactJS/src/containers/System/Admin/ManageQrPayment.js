import React, { Component } from "react";
import { toast } from "react-toastify";
import './ManageQrPayment.scss';
import { getBookingsWaitConfirm, confirmQrPayment } from "../../../services/userService";

class ManageQrPayment extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            loading: false,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchBookings();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchBookings = async () => {
        this.setState({ loading: true });
        try {
            const res = await getBookingsWaitConfirm();
            if (!this._isMounted) return;
            if (Array.isArray(res.data) && res.data.length >= 0) {
                this.setState({ bookings: res.data, loading: false });
            } else if (res.data && res.data.errCode === 0 && Array.isArray(res.data.data)) {
                this.setState({ bookings: res.data.data, loading: false });
            } else {
                this.setState({ bookings: [], loading: false });
                toast.error(res.data?.errMessage || "Lỗi tải danh sách booking!");
            }
        } catch (err) {
            if (!this._isMounted) return;
            this.setState({ bookings: [], loading: false });
            toast.error("Lỗi kết nối server!");
        }
    }

    handleConfirmPayment = async (bookingCode) => {
        if (!window.confirm("Xác nhận đã nhận tiền với mã booking: " + bookingCode + "?")) return;
        try {
            // Đoạn này xử lý cho cả trường hợp res là object (data luôn), hoặc là axios response (có res.data)
            const res = await confirmQrPayment(bookingCode);
            const result = res && res.data ? res.data : res; // Nếu có res.data thì lấy, không thì lấy chính res
            console.log('[userService] confirmQrPayment result:', result);
            if (result && result.errCode === 0) {
                toast.success(result.errMessage || "Đã xác nhận thanh toán!");
                this.fetchBookings();
            } else {
                toast.error(result?.errMessage || "Lỗi xác nhận!");
            }
        } catch (err) {
            toast.error("Server error khi xác nhận!");
        }
    }

    render() {
        const { bookings, loading } = this.state;

        return (
            <div className="manage-qr-payment-container">
                <div className="qr-title">Quản lý thanh toán QR</div>
                {loading ? <div className="loading">Đang tải...</div> : null}
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th>Mã booking</th>
                            <th>Tên bệnh nhân</th>
                            <th>Số điện thoại</th>
                            <th>Ngày khám</th>
                            <th>Khung giờ</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(bookings) && bookings.length === 0) ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center" }}>Không có booking chờ xác nhận.</td>
                            </tr>
                        ) : Array.isArray(bookings) && bookings.map(booking => (
                            <tr key={booking.id}>
                                <td>{booking.bookingCode}</td>
                                <td>
                                    {`${booking.patientData?.firstName || ''} ${booking.patientData?.lastName || ''}`.trim() || '-'}
                                </td>
                                <td>
                                    {booking.patientData?.phonenumber || booking.phoneNumber || '-'}
                                </td>
                                <td>
                                    {booking.date ? new Date(Number(booking.date)).toLocaleDateString('vi-VN') : '-'}
                                </td>
                                <td>
                                    {booking.timeTypeDataPatient?.valueVi || booking.timeType || '-'}
                                </td>
                                <td>
                                    {
                                        booking.doctorInfoBooking?.priceTypeData?.valueVi
                                            ? Number(booking.doctorInfoBooking.priceTypeData.valueVi).toLocaleString('vi-VN') + ' ₫'
                                            : '-'
                                    }
                                </td>
                                <td>
                                    {booking.paymentStatus === "wait_confirm"
                                        ? "Chờ xác nhận"
                                        : booking.paymentStatus}
                                </td>
                                <td>
                                    <button
                                        className="btn-confirm"
                                        onClick={() => this.handleConfirmPayment(booking.bookingCode)}
                                        disabled={booking.paymentStatus !== "wait_confirm"}
                                    >
                                        Xác nhận đã nhận tiền
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ManageQrPayment;