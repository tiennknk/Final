/**
 * Sinh link ảnh QR chuyển khoản VietQR. 
 * Sử dụng API public của vietqr.io, không cần đăng ký merchant.
 * Nên dùng cho demo/đồ án.
 * 
 * bank: mã ngân hàng (VCB, BIDV, TCB, ...),
 * accountNumber: số tài khoản,
 * accountName: tên chủ tài khoản,
 * amount: số tiền chuyển (VNĐ),
 * addInfo: nội dung chuyển khoản (ví dụ: Ma dat lich 12345)
 */
function generateVietQRLink({ bank, accountNumber, accountName, amount, addInfo }) {
    // Tạo URL ảnh QR code
    const qrUrl = `https://img.vietqr.io/image/${bank}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}`;
    return qrUrl;
}

export default {
    generateVietQRLink,
};