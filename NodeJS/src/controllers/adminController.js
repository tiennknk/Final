import adminService from "../services/adminService.js";


// Lấy danh sách booking QR chờ xác nhận
const getBookingsWaitConfirm = async (req, res) => {
    try {
        const result = await adminService.getBookingsWaitConfirm();
        return res.status(200).json({ errCode: 0, data: result });
    } catch (error) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

// Lấy tất cả booking (nếu cần)
const getAllBookings = async (req, res) => {
    try {
        const result = await adminService.getAllBookings();
        return res.status(200).json({ errCode: 0, data: result });
    } catch (error) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

// Xác nhận thanh toán QR (admin/phòng khám)
const clinicConfirmPayment = async (req, res) => {
    try {
        // Truyền vào bookingId hoặc bookingCode từ FE
        const { bookingId, bookingCode } = req.body;
        const result = await adminService.clinicConfirmPayment(bookingId, bookingCode);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

// Bệnh nhân xác nhận đã chuyển khoản (chờ admin xác nhận)
const confirmPayment = async (req, res) => {
    try {
        const { bookingCode } = req.body;
        const result = await adminService.confirmPayment(bookingCode);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

const getStatistics = async (req, res) => {
    try {
        const stats = await adminService.getStatistics();
        return res.status(200).json(stats);
    } catch (e) {
        console.error('Lỗi thống kê:', e); // Thêm dòng này để xem lỗi thực tế
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

export default {
    getBookingsWaitConfirm,
    getAllBookings,
    clinicConfirmPayment,
    confirmPayment,
    getStatistics,
};