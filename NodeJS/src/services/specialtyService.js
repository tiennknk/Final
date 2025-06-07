import db from "../models/index.js";

const createNewSpecialty = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                resolve({
                    errCode: 0,
                    errMessage: "Create specialty successfully",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllSpecialty = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({});
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data: data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailSpecialtyById = async (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                });

                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: inputId, provinceId: location },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    }

                    resolve({
                        errCode: 0,
                        data: {
                            ...data.dataValues,
                            doctorSpecialty: doctorSpecialty,
                        },
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Specialty not found",
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
}

export default {
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
};