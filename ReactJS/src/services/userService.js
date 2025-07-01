import axios from '../axios';

/**
 * =========================
 * USER AUTHENTICATION
 * =========================
 */

// [User] Đăng nhập hệ thống
const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', {email: userEmail, password: userPassword});
};

// [Admin] Lấy tất cả người dùng (hoặc theo id)
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
};

// [Admin] Tạo mới người dùng
const createNewUserService = (data) => {
    console.log('check data from service', data);
    return axios.post('/api/create-new-user', data);
};

// [Admin] Sửa thông tin người dùng
const editUserService = (inputData) => {
    return axios.put('api/edit-user' , inputData);
};

// [Admin] Xoá người dùng
const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: { id: userId }
    });
};

/**
 * =========================
 * CODE & COMMON INFORMATION
 * =========================
 */

// [Common] Lấy các giá trị code (giới tính, vị trí, ...)
const getAllCodeService = (inputData) => {
    return axios.get(`/api/allcode?type=${inputData}`)
};


/**
 * =========================
 * DOCTOR
 * =========================
 */

// [Home] Lấy top bác sĩ nổi bật
const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

// [Admin] Lấy tất cả bác sĩ
const getAllDoctors = () => {
    return axios.get('/api/get-all-doctors');
};

// [Admin] Lưu chi tiết thông tin bác sĩ
const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-info-doctor', data);
};

// [Common] Lấy chi tiết thông tin bác sĩ theo id
const getDetailInfoDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
};

// [Admin/Doctor] Lưu nhiều lịch khám cho bác sĩ
const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data);
};

// [Patient/Doctor] Lấy lịch khám của bác sĩ theo ngày
const getScheduleByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
};

// [Doctor] Lấy các khung giờ đã được đặt trong ngày
const getBookedTimeTypesByDate = (doctorId, date) => {
    return axios.get(`/api/get-booked-time-type-by-date?doctorId=${doctorId}&date=${date}`);
};

// [Common] Lấy thông tin bổ sung của bác sĩ
const getExtraInfoDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`);
};

// [Common] Lấy profile bác sĩ
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};


/**
 * =========================
 * BOOKING & PATIENT
 * =========================
 */

// [Patient] Đặt lịch khám bệnh
const postBookAppointment = (data) => {
    // Lấy token từ localStorage (hoặc nơi bạn lưu token sau khi login)
    const token = localStorage.getItem('token');
    console.log('[userService][postBookAppointment] token:', token);
    console.log('[userService][postBookAppointment] data:', data);
    return axios.post(
        '/api/patient-book-appointment',
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

// [Patient] Xác thực đặt lịch qua email
const postVerifyBookingAppointment = (data) => {
    return axios.post('/api/verify-booking', data);
};

// [Admin] Huỷ lịch đặt khám
const cancelBooking = (bookingId) => {
    return axios.post('/api/cancel-booking', { bookingId });
};

// [Doctor] Lấy danh sách bệnh nhân cho bác sĩ trong ngày
const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
};

// [Doctor] Gửi đơn thuốc, kết quả khám cho bệnh nhân
const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data);
};

// [Doctor] Lấy lịch sử bệnh nhân đã khám
const getHistoryPatientsByDoctor = (doctorId) => {
    let url = `/api/get-history-patients-by-doctor?doctorId=${doctorId}`;
    return axios.get(url).then(res => res.data);
};

/**
 * =========================
 * SPECIALTY & CLINIC
 * =========================
 */

// [Admin] Tạo mới chuyên khoa
const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data);
};

// [Common] Lấy danh sách chuyên khoa
const getAllSpecialty = (type) => {
    return axios.get(`/api/get-all-specialty?type=${type}`);
};

// [Common] Lấy chi tiết chuyên khoa theo id
const getDetailSpecialtyById = (id, location) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${id}&location=${location}`);
};

// [Admin] Tạo mới phòng khám
const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data);
};

// [Common] Lấy danh sách phòng khám
const getAllClinic = () => {
    return axios.get('/api/get-all-clinic');
};

// [Common] Lấy chi tiết phòng khám theo id
const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};

/**
 * =========================
 * PATIENT PROFILE & HISTORY
 * =========================
 */

// [Patient] Lấy profile cá nhân
const getPatientProfile = (patientId) => {
    return axios.get(`/api/patient-profile?patientId=${patientId}`);
};

// [Patient] Cập nhật profile cá nhân
const updatePatientProfile = (data) => {
    return axios.put('/api/update-patient-profile', data);
};

// [Patient] Lấy lịch sử khám bệnh
const getPatientHistory = (patientId) => {
    return axios.get(`/api/patient-history?patientId=${patientId}`);
};

/**
 * =========================
 * REVIEW
 * =========================
 */

// [Patient] Gửi đánh giá bác sĩ/phòng khám
const createReviewService = (data) => {
    return axios.post('/api/create-review', data);
};

// [Common] Lấy danh sách đánh giá
const getAllReviewsService = ({ doctorId, clinicId } = {}) => {
    let query = [];
    if (doctorId !== undefined && doctorId !== null) query.push(`doctorId=${doctorId}`);
    if (clinicId !== undefined && clinicId !== null) query.push(`clinicId=${clinicId}`);
    let queryString = query.length ? '?' + query.join('&') : '';
    const url = `/api/get-all-reviews${queryString}`;
    return axios.get(url)
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
};

/**
 * =========================
 * SCHEDULE SLOT
 * =========================
 */

// [Admin/Doctor] Xoá slot lịch khám
const deleteScheduleSlot = (doctorId, date, timeType) => {
    return axios.delete('/api/delete-schedule-slot', { data: { doctorId, date, timeType } });
};

/**
 * =========================
 * PAYMENT & CONFIRMATION
 * =========================
 */

// [Admin] Xác nhận thanh toán QR (admin/clinic)
const confirmQrPayment = (bookingCode) => {
    const token = localStorage.getItem('token');
    const req = axios.post(
        '/api/admin/clinic-confirm-payment',
        { bookingCode },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    req.then(res => console.log('[userService] confirmQrPayment result:', res));
    return req;
};

// [Admin] Lấy danh sách các thanh toán QR
const getAllQrPayments = () => {
    const token = localStorage.getItem('token');
    return axios.get('/api/get-all-qr-payments', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// [Admin/Doctor] Lấy các booking chờ xác nhận
const getBookingsWaitConfirm = () => {
    const token = localStorage.getItem('token');
    return axios.get('/api/get-bookings-wait-confirm', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// [Doctor] Xác nhận thanh toán tiền mặt
const confirmPaymentCash = (bookingCode) => {
    const token = localStorage.getItem('token');
    return axios.post('/api/doctor/confirm-payment-cash', { bookingCode }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// [Doctor] Xác nhận thanh toán QR
const confirmQrPaymentStatus = (bookingCode) => {
    const token = localStorage.getItem('token');
    return axios.post('/api/doctor/confirm-qr-payment', { bookingCode }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

const getAdminStatistics = () => {
    const token = localStorage.getItem('token');
    return axios.get('/api/admin/statistics', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export {
    // Auth & Users
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    editUserService,
    deleteUserService,
    getAllCodeService,

    // Doctor
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorService,
    getDetailInfoDoctor,
    saveBulkScheduleDoctor,
    getScheduleByDate,
    getBookedTimeTypesByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,

    // Booking & Patient
    postBookAppointment,
    postVerifyBookingAppointment,
    cancelBooking,
    getAllPatientForDoctor,
    postSendRemedy,
    getHistoryPatientsByDoctor,

    // Specialty & Clinic
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getDetailClinicById,
    getAllClinic,

    // Patient Profile & History
    getPatientProfile,
    updatePatientProfile,
    getPatientHistory,

    // Review
    createReviewService,
    getAllReviewsService,

    // Schedule Slot
    deleteScheduleSlot,

    // Payment & Confirmation
    getAllQrPayments,
    confirmQrPayment,
    getBookingsWaitConfirm,
    confirmPaymentCash,
    confirmQrPaymentStatus,

    getAdminStatistics
};