import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Hàm tạo HTML email đặt lịch (có bôi đậm, tăng size, loại bỏ thông tin thừa, sửa lỗi undefined)
const getBodyHTMLEmail = (dataSend) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #222;">
            <h2 style="color: #1677ff; font-size: 1.4rem; margin-bottom: 12px;">
                Thông tin đặt lịch khám bệnh
            </h2>
            <p style="font-size: 1.08rem; margin-bottom: 8px;">
                <strong>Xin chào <span style="color:#1677ff;">${dataSend.patientName}</span>!</strong>
            </p>
            <p style="font-size: 1.02rem;">
                Bạn đã đặt lịch khám bệnh thành công với bác sĩ: 
                <strong style="color:#1677ff;">${dataSend.doctorName}</strong>
            </p>
            <div style="margin: 18px 0; padding: 10px 20px; background: #f6faff; border-radius: 7px;">
                <span style="font-size:1.08rem;"><strong>Thông tin chi tiết:</strong></span><br>
                <span style="font-size:1.08rem;">
                    <strong>Thời gian:</strong> <span style="color:#1677ff;">${dataSend.time}</span>
                </span>
            </div>
            <p style="margin-top:12px; font-size: 1.01rem;">
                Vui lòng truy cập vào đường dẫn bên dưới để xác nhận lịch hẹn:
            </p>
            <p>
                <a href="${dataSend.redirectLink}" style="color: #1677ff; font-size: 1.07rem; font-weight: bold;">
                    Xác nhận lịch hẹn
                </a>
            </p>
        </div>
    `;
};

// Hàm gửi mail xác nhận đặt lịch
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

// Hàm tạo HTML email gửi kết quả/remedy (có bôi đậm, tăng size)
const getBodyHTMLEmailRemedy = (dataSend) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #222;">
            <h2 style="color: #1677ff; font-size: 1.3rem; margin-bottom: 12px;">
                Xác nhận khám bệnh thành công
            </h2>
            <p style="font-size: 1.08rem; margin-bottom: 8px;">
                <strong>Xin chào <span style="color:#1677ff;">${dataSend.patientName}</span>!</strong>
            </p>
            <p style="font-size: 1.02rem;">
                Bạn đã xác nhận lịch khám bệnh thành công với bác sĩ: 
                <strong style="color:#1677ff;">${dataSend.doctorName}</strong>
            </p>
            <div style="margin: 18px 0; padding: 10px 20px; background: #f6faff; border-radius: 7px;">
                <span style="font-size:1.08rem;"><strong>Thông tin chi tiết:</strong></span><br>
                <span style="font-size:1.08rem;">
                    <strong>Thời gian:</strong> <span style="color:#1677ff;">${dataSend.time}</span><br>
                    <strong>Địa chỉ:</strong> ${dataSend.address || ""}<br>
                    <strong>Số điện thoại:</strong> ${dataSend.phoneNumber || ""}<br>
                    <strong>Lý do khám:</strong> ${dataSend.reason || ""}<br>
                    <strong>Email:</strong> ${dataSend.email || ""}
                </span>
            </div>
            <p style="margin-top:12px; font-size: 1.01rem;">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
            </p>
        </div>
    `;
};

// Hàm gửi mail remedy có file đính kèm
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
};