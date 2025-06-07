import db from "../models/index.js";
import dotenv from "dotenv";
import lodash from 'lodash'

const _ = lodash;
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
                        { model: db.Markdown,as: 'Markdown', attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                        { model: db.Allcode, as: 'positionData' },
                        {
                            model: db.Doctor_Info,
                            as: 'doctorInfo',
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi'] }
                            ]
                        }
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

const saveDetailInfoDoctor = async (inputData) => {
    return new Promise(async (resolve, reject) => { 
        try {
            const checkObject = checkRequiredFields(inputData);
            if (!checkObject.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameter! ${checkObject.element}`
                });
                return;
            } else {
                if (inputData.action === 'CREATE'){
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    });
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updatedAt = new Date();
                        await doctorMarkdown.save();
                    }
                }
    
                // Kiểm tra doctorId + specialtyId thay vì chỉ doctorId
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: inputData.doctorId, specialtyId: inputData.specialtyId },
                    raw: false
                });
    
                if (doctorInfo) {
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.priceId;
                    doctorInfo.provinceId = inputData.provinceId;
                    doctorInfo.paymentId = inputData.paymentId;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.specialtyId;
                    doctorInfo.clinicId = inputData.clinicId;
                    await doctorInfo.save();
                } else {
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.priceId,
                        provinceId: inputData.provinceId,
                        paymentId: inputData.paymentId,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    });
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
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName']
                        }
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

const getExtraInfoDoctorById = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId'],
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi'] }
                    ],
                    raw: false,
                    nest: true
                });

                if (!data) {
                    data = {};
                }

                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const getProfileDoctorById = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: { exclude: ['password'] },
                    include: [
                        { 
                            model: db.Markdown,
                            as: 'Markdown', 
                            attributes: ['contentHTML', 'contentMarkdown', 'description'] 
                        },
                        { 
                            model: db.Allcode, 
                            as: 'positionData', 
                            attributes: ['valueVi'] 
                        },
                        { 
                            model: db.Doctor_Info,
                            as: 'doctorInfo', 
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                });

                if (data && data.image) {
                    data.image = Buffer.from(data.image).toString('base64');
                }

                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const checkRequiredFields = (inputData) => {
    const arrFields = [
        'doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'priceId', 'paymentId', 'provinceId', 'nameClinic', 
        'addressClinic', 'note', 'specialtyId'
    ];

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }

    return {
        isValid,
        element
    };
}

export default {
    getTopDoctorHome,
    getAllDoctors,
    getDetailDoctorById,
    saveDetailInfoDoctor,
    saveBulkScheduleDoctor,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
};