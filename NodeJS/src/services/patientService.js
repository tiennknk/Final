import db from '../models/index.js';
import dotenv from "dotenv";
import emailService from './emailService.js';
import {v4 as uuidv4} from 'uuid';

dotenv.config();

const buildUrlEmail = (doctorId, token) => {
    return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
};

const postBookAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName
                || !data.selectedGender || !data.address || !data.phoneNumber || !data.reason
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin bắt buộc!',
                });
            } else {
                let token = uuidv4();
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
                            token: token,
                            address: data.address,
                            phoneNumber: data.phoneNumber,
                            reason: data.reason,
                        },
                    });
                    if (!created) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Bạn đã đặt lịch khám này rồi!',
                        });
                        return;
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Đặt lịch khám thành công!',
                });
            }
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
}

export default {
    postBookAppointment,
    postVerifyBookingAppointment,
};