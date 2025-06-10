import db from '../models/index.js';
import dotenv from "dotenv";
import emailService from './emailService.js';
import {v4 as uuidv4} from 'uuid';
import bodyParser from 'body-parser';
const { raw } = bodyParser;

dotenv.config();

const buildUrlEmail = (doctorId, token) => {
    return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
};

const postBookAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName
                || !data.selectedGender || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let token = uuidv4(); // Tạo token duy nhất cho mỗi booking
                await emailService.sendEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        firstName: data.fullName,
                        address: data.address,
                    },
                });

                if (user && user[0]) {
                    let [booking, created] = await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType,
                        },
                        defaults: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType,
                            statusId: 'S1',
                            token: token, // Lưu token vào booking
                        },
                    });
                    if (!created) {
                        // Nếu lịch đã tồn tại, trả về thông báo để dễ debug FE
                        resolve({
                            errCode: 2,
                            errMessage: 'Booking already exists for this slot',
                        });
                        return;
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Booking appointment successfully',
                });
            }
        } catch (error) {
            console.log('BOOKING ERROR:', error); // Thêm dòng này
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
                    errMessage: 'Missing required parameters',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1', // Chỉ xác nhận những lịch hẹn chưa được xác nhận
                    },
                    raw: false
                });

                if (appointment) {
                    appointment.statusId = 'S2'; // Cập nhật trạng thái thành đã xác nhận
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Booking confirmed successfully',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Booking not found or already confirmed',
                    });
                }
            }
        } catch (error) {
            console.log('VERIFY BOOKING ERROR:', error);
            reject(error);
        }
    });
}

export default {
    postBookAppointment,
    postVerifyBookingAppointment,
};