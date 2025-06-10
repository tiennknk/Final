import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const getBodyHTMLEmail = (dataSend) => {
    return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn đã đặt lịch khám bệnh thành công với bác sĩ: ${dataSend.doctorName}</p>
        <p>Thông tin chi tiết:</p>
        <div><b>Thời gian:</b> ${dataSend.time}</div>
        <div><b>Ngày khám:</b> ${dataSend.date}</div>
        <p>Vui lòng truy cập vào đường dẫn bên dưới để xác nhận lịch hẹn:</p>
        <a href="${dataSend.redirectLink}">Xác nhận lịch hẹn</a>
    `;
};

const sendEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: `"Booking" <${process.env.EMAIL_APP}>`,
        to: dataSend.email || dataSend.receiverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend),
    });

    return info;
};

const getBodyHTMLEmailRemedy = (dataSend) => {
    return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn đã xác nhận lịch khám bệnh thành công với bác sĩ: ${dataSend.doctorName}</p>
        <p>Thông tin chi tiết:</p>
        <div><b>Thời gian:</b> ${dataSend.time}</div>
        <div><b>Ngày khám:</b> ${dataSend.date}</div>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
    `;
};

const sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: `"Booking" <${process.env.EMAIL_APP}>`,
        to: dataSend.email || dataSend.receiverEmail,
        subject: "Kết quả đặt lịch khám bệnh",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64',
            },
        ],
    });
    return info;
}

export default {
    sendEmail,
    sendAttachment,
}