import e from "express";
import db from "../models/index.js";
import dotenv from "dotenv";
import _ from 'lodash';

dotenv.config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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

let saveBulkScheduleDoctor = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => ({
                        ...item,
                        maxNumber: MAX_NUMBER_SCHEDULE
                    }));
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formattedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save bulk schedule successfully!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const getScheduleByDate = async (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },

                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                        },
                    ],
                    raw: false,
                    nest: true
                });

                if (!dataSchedule) {
                    dataSchedule = [];
                }

                resolve({
                    errCode: 0,
                    data: dataSchedule
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

export default {
    getTopDoctorHome,
    getAllDoctors,
    getDetailDoctorById,
    saveDetailInfoDoctor,
    saveBulkScheduleDoctor,
    getScheduleByDate
};