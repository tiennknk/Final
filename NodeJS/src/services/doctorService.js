import db from "../models/index.js";

const getTopDoctorHome = async (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: {
                    roleId: 'R2',
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'] // Đừng exclude 'image'
                },
                include: [
                    { model: db.Allcode, as: 'positionData' },
                    { model: db.Allcode, as: 'genderData' }
                ],
                raw: true,
                nest: true
            });

            // SỬA Ở ĐÂY: Chỉ convert buffer sang base64, KHÔNG thêm tiền tố nào!
            users = users.map(user => ({
                ...user,
                image: user.image ? Buffer.from(user.image).toString('base64') : null
            }));

            resolve({
                errCode: 0,
                data: users,
            });
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    getTopDoctorHome,
};