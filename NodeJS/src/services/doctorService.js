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

const getDetailDoctorById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let info = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                        { model: db.Allcode, as: 'positionData' },
                    ],
                    raw: false,
                    nest: true
                }); 

                if (info && info.image) {
                    info.image = Buffer.from(info.image).toString('base64');
                }

                if (!info) {
                    info = {};
                }

                resolve({
                    errCode: 0,
                    data: info,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const saveDetailInfoDoctor = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.action) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                if (data.action === 'CREATE'){
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
            } else if (data.action === 'EDIT') {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false
                });

                if (doctorMarkdown) {
                    doctorMarkdown.contentHTML = data.contentHTML;
                    doctorMarkdown.contentMarkdown = data.contentMarkdown;
                    doctorMarkdown.description = data.description;
                    doctorMarkdown.updatedAt = new Date();
                    await doctorMarkdown.save();
                }
            }
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
    getDetailDoctorById,
    saveDetailInfoDoctor
};