import clinicService from '../services/clinicService.js';

let createClinic = async (req, res) => {
    try {
        let info = await clinicService.createClinic(req.body);
        // Sửa: trả về trực tiếp info (bên trong đã có errCode, errMessage, ...)
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let getAllClinic = async (req, res) => {
    try {
        let info = await clinicService.getAllClinic();
        // Sửa: trả về trực tiếp info (bên trong đã có errCode, errMessage, ...)
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let getDetailClinicById = async (req, res) => {
    try {
        let info = await clinicService.getDetailClinicById(req.query.id);
        // Sửa: trả về trực tiếp info (bên trong đã có errCode, errMessage, ...)
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

export default {
    createClinic,
    getAllClinic,
    getDetailClinicById,
};