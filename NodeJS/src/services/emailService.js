// emailService.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Hàm tạo nội dung HTML của email
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

// Hàm gửi email
const sendEmail = async (dataSend) => {
    // 1. Tạo transporter (kết nối SMTP server của Gmail)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true nếu dùng port 465, false cho 587
        auth: {
            user: process.env.EMAIL_APP,            // Email người gửi (từ biến môi trường)
            pass: process.env.EMAIL_APP_PASSWORD,   // Mật khẩu ứng dụng
        },
    });

    // 2. Gửi email với nội dung đã dựng ở trên
    let info = await transporter.sendMail({
        from: `"Booking" <${process.env.EMAIL_APP}>`, // Tên người gửi
        to: dataSend.receiverEmail,                   // Email người nhận
        subject: "Thông tin đặt lịch khám bệnh",     // Tiêu đề email
        html: getBodyHTMLEmail(dataSend),            // Nội dung HTML của email
    });

    // 3. Trả về thông tin gửi mail
    return info;
};

// Export module
export default {
    sendEmail,
};