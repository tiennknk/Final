import db from '../models/index.js';
import dotenv from "dotenv";
import emailService from './emailService.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const buildUrlEmail = (doctorId, token) => {
    return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
};

const postBookAppointment = async (data, loggedInUser = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Validate các field chung
            if (
                !data.doctorId ||
                !data.timeType ||
                !data.date ||
                !data.reason ||
                !data.specialtyId ||
                !data.clinicId ||
                !data.bookingFor
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin bắt buộc!',
                });
                return;
            }

            let token = uuidv4();
            let formattedDate = new Date(Number(data.date)).toLocaleDateString('vi-VN');

            let patientUser = null;
            let patientEmail = '';
            let patientName = '';

            if (data.bookingFor === 'me') {
                // Đặt cho mình, lấy thông tin user từ loggedInUser (req.user)
                if (!loggedInUser) {
                    resolve({ errCode: 99, errMessage: "Không xác định được user đăng nhập!" });
                    return;
                }
                patientUser = await db.User.findOne({ where: { id: loggedInUser.id } });
                if (!patientUser) {
                    resolve({ errCode: 100, errMessage: "User không tồn tại!" });
                    return;
                }
                patientEmail = patientUser.email;
                patientName = patientUser.firstName + (patientUser.lastName ? ' ' + patientUser.lastName : '');
            } else {
                // Đặt cho người khác, cần đủ info người bệnh
                if (
                    !data.email ||
                    !data.fullName ||
                    !data.selectedGender ||
                    !data.address ||
                    !data.phoneNumber
                ) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Thiếu thông tin người bệnh!',
                    });
                    return;
                }
                // Tìm hoặc tạo user mới
                let [userCreated] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        firstName: data.fullName,
                        address: data.address,
                        phonenumber: data.phoneNumber,
                    },
                });
                patientUser = userCreated;
                patientEmail = data.email;
                patientName = data.fullName;
            }

            // Gửi email xác nhận
            await emailService.sendEmail({
                receiverEmail: patientEmail,
                patientName: patientName,
                time: data.timeString,
                doctorName: data.doctorName,
                date: formattedDate,
                redirectLink: buildUrlEmail(data.doctorId, token),
            });

            // Tạo booking
            let [booking, created] = await db.Booking.findOrCreate({
                where: {
                    patientId: patientUser.id,
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType,
                },
                defaults: {
                    patientId: patientUser.id,
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType,
                    statusId: 'S1',
                    token: token,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    reason: data.reason,
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId,
                    // Nếu muốn lưu người đặt hộ, cần cột bookerId trong bảng Booking
                    bookerId: (data.bookingFor === 'other' && loggedInUser) ? loggedInUser.id : null,
                },
            });
            if (!created) {
                resolve({
                    errCode: 2,
                    errMessage: 'Bạn đã đặt lịch khám này rồi!',
                });
                return;
            }

            resolve({
                errCode: 0,
                errMessage: 'Đặt lịch khám thành công!',
            });
        } catch (error) {
            console.log('BOOKING ERROR:', error);
            reject(error);
        }
    });
};

const postVerifyBookingAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin xác thực!',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1',
                    },
                    raw: false
                });

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Xác nhận lịch khám thành công!',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Lịch khám không tồn tại hoặc đã được xác nhận!',
                    });
                }
            }
        } catch (error) {
            console.log('VERIFY BOOKING ERROR:', error);
            reject(error);
        }
    });
};

const getPatientProfile = async (patientId) => {
    try {
        const user = await db.User.findOne({
            where: { id: patientId },
            attributes: { exclude: ['password'] },
            raw: true
        });
        if (user) {
            return { errCode: 0, data: user };
        }
        return { errCode: 2, errMessage: "User not found" };
    } catch (e) {
        return { errCode: -1, errMessage: "Server error" };
    }
};

const updatePatientProfile = async (data) => {
    try {
        if (!data.id) return { errCode: 1, errMessage: "Missing user id" };
        let user = await db.User.findOne({ where: { id: data.id, roleId: 'R3' } });
        if (!user) return { errCode: 2, errMessage: "User not found" };

        // Update fields
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.email = data.email || user.email;
        user.address = data.address || user.address;
        user.phonenumber = data.phonenumber || user.phonenumber;
        user.gender = data.gender || user.gender;
        await user.save();

        return { errCode: 0, errMessage: "Update successful" };
    } catch (e) {
        return { errCode: -1, errMessage: "Server error" };
    }
};

const getPatientHistory = async (patientId) => {
    try {
        const history = await db.Booking.findAll({
            where: { patientId: patientId, statusId: 'S2' }, // hoặc S3 nếu là lịch sử đã khám
            include: [
                {
                    model: db.User,
                    as: 'doctorData',
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: db.Specialty,
                    as: 'specialtyData',
                    attributes: ['name']
                },
                {
                    model: db.Clinic,
                    as: 'clinicData',
                    attributes: ['name']
                }
            ],
            order: [['date', 'DESC']]
        });
        return { errCode: 0, data: history };
    } catch (e) {
        console.log('GET PATIENT HISTORY ERROR:', e);
        return { errCode: -1, errMessage: "Server error" };
    }
};

export default {
    postBookAppointment,
    postVerifyBookingAppointment,
    getPatientProfile,
    updatePatientProfile,
    getPatientHistory
};