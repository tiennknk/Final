import userService from '../services/userService.js';

const handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing input parameter'
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
        token: userData.token || null
    });
};

const handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: []
        });
    }

    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OKKK',
        users
    });
};

const handleCreateNewUser = async (req, res) => {
    const data = req.body;
    let message = await userService.createNewUser(data);
    return res.status(200).json(message);
};

const handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter'
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeSerVice(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

export default {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode
};