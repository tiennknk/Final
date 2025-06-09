import db from "../models/index.js";

const createClinic = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.address ||
                !data.descriptionMarkdown ||
                !data.descriptionHTML ||
                !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                    image: data.imageBase64,
                });
                resolve({
                    errCode: 0,
                    errMessage: "Tạo phòng khám thành công",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllClinic = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({});
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: "OK",
                data: data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailClinicById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: id },
                    attributes: ['name', 'address', 'descriptionMarkdown', 'descriptionHTML'],
                });

                if (data) {
                    let doctorClinic = await db.Doctor_Info.findAll({
                        where: { clinicId: id },
                        attributes: ['doctorId', 'provinceId'],
                    });
                    data.doctorClinic = doctorClinic;
                } else {
                    data = {};
                }

                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    createClinic,
    getAllClinic,
    getDetailClinicById,
};