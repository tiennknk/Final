import specialtyService from "../services/specialtyService.js";

const createNewSpecialty = async (req, res) => {
    try {
        let result = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Server error' });
    }
};

const getAllSpecialty = async (req, res) => {
    try {
        let result = await specialtyService.getAllSpecialty();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Server error' });
    }
};

const getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(infor);
        
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Server error' });
    }
}

export default {
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
};