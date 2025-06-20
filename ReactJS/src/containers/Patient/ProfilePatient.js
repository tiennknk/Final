import React, { useEffect, useState } from "react";
import { getPatientProfile, updatePatientProfile } from "../../services/userService";
import { useSelector } from "react-redux";
import PatientMenu from "../Patient/PatientMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePatient.scss";

const ProfilePatient = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (userInfo && userInfo.id) {
                setLoading(true);
                const res = await getPatientProfile(userInfo.id);
                // Log để debug
                console.log("Res gốc:", res);
                if (res && res.errCode === 0) {
                    setProfile(res.data);
                    setForm(res.data);
                    
                } else {
                    setProfile(null);
                }
                setLoading(false);
            } else {
                setProfile(null);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userInfo]);

    useEffect(() => {
    }, [profile]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const res = await updatePatientProfile(form);
  
        if (res && res.errCode === 0) {
            setProfile(form);
            setEditMode(false);
            toast.success("Cập nhật thành công!", { autoClose: 2000 });
        } else {
            toast.error("Cập nhật thất bại! Vui lòng thử lại.", { autoClose: 2000 });
        }
    };

    return (
        <>
            <PatientMenu />
            <div className="patient-profile-container">
                <div className="profile-box">
                    <h2>Hồ sơ cá nhân</h2>
                    {loading ? (
                        <div>Đang tải dữ liệu...</div>
                    ) : !profile ? (
                        <div>Không có dữ liệu hồ sơ.</div>
                    ) : editMode ? (
                        <form className="profile-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                            <div className="form-group">
                                <label>Họ:</label>
                                <input className="form-control" name="firstName" value={form?.firstName || ""} onChange={handleChange} placeholder="Họ" />
                            </div>
                            <div className="form-group">
                                <label>Tên:</label>
                                <input className="form-control" name="lastName" value={form?.lastName || ""} onChange={handleChange} placeholder="Tên" />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input className="form-control" name="email" value={form?.email || ""} onChange={handleChange} placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại:</label>
                                <input className="form-control" name="phonenumber" value={form?.phonenumber || ""} onChange={handleChange} placeholder="SĐT" />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ:</label>
                                <input className="form-control" name="address" value={form?.address || ""} onChange={handleChange} placeholder="Địa chỉ" />
                            </div>
                            <div className="btn-group">
                                <button className="btn btn-primary" type="submit">Lưu</button>
                                <button className="btn btn-secondary" type="button" onClick={() => setEditMode(false)}>Hủy</button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-row">
                                <span className="info-label">Họ tên:</span>
                                <span>{profile.lastName || ""} {profile.firstName || ""}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span>{profile.email || ""}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">SĐT:</span>
                                <span>{profile.phonenumber || ""}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Địa chỉ:</span>
                                <span>{profile.address || ""}</span>
                            </div>
                            <div className="btn-group">
                                <button className="btn btn-warning" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfilePatient;