import db from '../models/index.js';

// Lấy danh sách booking QR chờ xác nhận, include giá tiền và khung giờ tiếng Việt
const getBookingsWaitConfirm = async () => {
    return await db.Booking.findAll({
        where: {
            paymentStatus: 'wait_confirm',
            paymentMethod: 'QR_BANK'
        },
        order: [['date', 'DESC']],
        include: [
            {
                model: db.User,
                as: 'patientData',
                attributes: ['firstName', 'lastName', 'phonenumber', 'email']
            },
            // Lấy valueVi khung giờ (Allcode)
            {
                model: db.Allcode,
                as: 'timeTypeDataPatient',
                attributes: ['valueVi']
            },
            // Lấy Doctor_Info theo doctorId booking
            {
                model: db.Doctor_Info,
                as: 'doctorInfoBooking',
                attributes: ['priceId'],
                include: [
                    {
                        model: db.Allcode,
                        as: 'priceTypeData',
                        attributes: ['valueVi']
                    }
                ]
            }
        ]
    });
};

// Lấy tất cả booking
const getAllBookings = async () => {
    return await db.Booking.findAll({
        order: [['date', 'DESC']],
        include: [
            {
                model: db.User,
                as: 'patientData',
                attributes: ['firstName', 'lastName', 'phonenumber', 'email']
            },
            {
                model: db.Allcode,
                as: 'timeTypeDataPatient',
                attributes: ['valueVi']
            },
            {
                model: db.Doctor_Info,
                as: 'doctorInfoBooking',
                attributes: ['priceId'],
                include: [
                    {
                        model: db.Allcode,
                        as: 'priceTypeData',
                        attributes: ['valueVi']
                    }
                ]
            }
        ]
    });
};

// Xác nhận thanh toán bởi admin/phòng khám
const clinicConfirmPayment = async (bookingCode, user) => {
    if (!bookingCode) return { errCode: 1, errMessage: "Thiếu bookingCode" };
    if (!user || (user.roleId !== 'R1' && user.roleId !== 'R2')) {
        return { errCode: 3, errMessage: "Không có quyền xác nhận!" };
    }
    const updated = await db.Booking.update({ paymentStatus: 'paid' }, { where: { bookingCode } });
    if (updated[0] === 0) return { errCode: 2, errMessage: "Không tìm thấy booking!" };
    return { errCode: 0, errMessage: "Đã xác nhận thanh toán thành công!" };
};

// Xác nhận trạng thái chờ kiểm tra thanh toán (bệnh nhân đã chuyển khoản, chờ admin xác nhận)
const confirmPayment = async (bookingCode) => {
    if (!bookingCode) return { errCode: 1, errMessage: "Thiếu bookingCode" };
    const updated = await db.Booking.update(
        { paymentStatus: 'wait_confirm' },
        { where: { bookingCode } }
    );
    if (updated[0] === 0) {
        return { errCode: 2, errMessage: "Không tìm thấy booking!" };
    }
    return { errCode: 0, errMessage: "Đã xác nhận chờ kiểm tra thanh toán!" };
};

export default {
    getBookingsWaitConfirm,
    getAllBookings,
    clinicConfirmPayment,
    confirmPayment,
};