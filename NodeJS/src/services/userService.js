import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });
            resolve(!!user);
        } catch (e) {
            reject(e);
        }
    });
};

const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let userData = {};
        try {
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: [
                        'id',
                        'email',
                        'roleId',
                        'password',
                        'firstName',
                        'lastName',
                        'phonenumber',
                        'address',
                        'gender'
                    ],
                    where: { email: email },
                    raw: true,
                });

                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Đăng nhập thành công';
                        delete user.password;
                        userData.user = user;

                        // ===> Bổ sung tạo token ở đây:
                        const payload = {
                            id: user.id,
                            email: user.email,
                            roleId: user.roleId
                        };
                        const token = jwt.sign(
                            payload,
                            process.env.JWT_SECRET || "your_jwt_secret",
                            { expiresIn: "2h" }
                        );
                        userData.token = token;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Sai mật khẩu';
                        userData.token = null;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found';
                    userData.token = null;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = 'Sai email';
                userData.token = null;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId == 'ALL') {
                users = await db.User.findAll({
                    attributes: { exclude: ['password'] }
                });
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ['password'] }
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email đã tồn tại, vui lòng nhập email khác!'
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);

                let base64String = data.avatar;
                if (base64String) {
                    base64String = base64String.replace(/^data:image\/\w+;base64,/, "");
                }

                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: base64String ? Buffer.from(base64String, 'base64') : null,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Tạo user thành công!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let founduser = await db.User.findOne({
            where: { id: userId }
        });
        if (!founduser) {
            resolve({
                errCode: 2,
                errMessage: `User không tồn tại`
            });
        }
        await db.User.destroy({
            where: { id: userId }
        });
        resolve({
            errCode: 0,
            message: 'Xóa người dùng thành công'
        });
    });
};

const updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                });
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                if (data.avatar) {
                    let base64String = data.avatar.replace(/^data:image\/\w+;base64,/, "");
                    user.image = Buffer.from(base64String, 'base64');
                }
                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Cập nhật người dùng thành công'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllCodeSerVice = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    updateUserData,
    deleteUser,
    getAllCodeSerVice
};