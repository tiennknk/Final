import db from '../models/index.js';
import emailService from "./emailService.js";

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
const clinicConfirmPayment = async (bookingId, bookingCode) => {
    try {
        // 1. Tìm booking
        let where = {};
        if (bookingId) where.id = bookingId;
        if (bookingCode) where.bookingCode = bookingCode;
        const booking = await db.Booking.findOne({ where });

        if (!booking) {
            return { errCode: 1, errMessage: "Không tìm thấy booking!" };
        }

        if (booking.paymentStatus === "paid") {
            return { errCode: 2, errMessage: "Đã xác nhận thanh toán trước đó!" };
        }

        // 2. Cập nhật trạng thái thanh toán "paid"
        booking.paymentStatus = "paid";
        await booking.save();

        // 3. Lấy thông tin bệnh nhân, bác sĩ, thời gian và phòng khám
        const patient = await db.User.findOne({ where: { id: booking.patientId } });
        const doctor = await db.User.findOne({ where: { id: booking.doctorId } });
        // Lấy thêm thông tin timeTypeData nếu có
        let timeVi = booking.timeType;
        if (db.Allcode && booking.timeType) {
            const timeTypeData = await db.Allcode.findOne({ where: { keyMap: booking.timeType, type: 'TIME' } });
            if (timeTypeData) timeVi = timeTypeData.valueVi;
        }
        // Lấy tên phòng khám
        let clinicName = "";
        if (booking.clinicId) {
            const clinic = await db.Clinic.findOne({ where: { id: booking.clinicId } });
            clinicName = clinic ? clinic.name : "";
        }

        // 4. Gửi email xác nhận QR thành công
        await emailService.sendEmailQrSuccess({
            receiverEmail: patient.email,
            patientName: patient.firstName + " " + (patient.lastName || ""),
            doctorName: doctor.firstName + " " + (doctor.lastName || ""),
            time: timeVi,
            date: new Date(Number(booking.date)).toLocaleDateString('vi-VN'),
            clinicName,
        });

        return { errCode: 0, errMessage: "Đã xác nhận thanh toán QR và gửi email thông báo cho bệnh nhân." };
    } catch (error) {
        console.error(error);
        return { errCode: -1, errMessage: "Server error" };
    }
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