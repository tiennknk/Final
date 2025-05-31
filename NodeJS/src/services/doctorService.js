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
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData' },
                    { model: db.Allcode, as: 'genderData' }
                ],
                raw: true,
                nest: true
            });

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

const getAllDoctors = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: [
                    { roleId: 'R2' }
                ],
                attributes: {
                    exclude: ['password']
                },
            });
            resolve({
                errCode: 0,
                data: doctor,
            });
        } catch (e) {
            reject(e);
        }
    });
}

const saveDetailInfoDoctor = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Save doctor info successfully!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor
};