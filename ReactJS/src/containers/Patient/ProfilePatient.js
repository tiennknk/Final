import React, { useEffect, useState } from "react";
import { getPatientProfile, updatePatientProfile } from "../../services/userService";
import { useSelector } from "react-redux";
import "./ProfilePatient.scss";

const Profile = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const [profile, setProfile] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            if (userInfo && userInfo.id) {
                const res = await getPatientProfile(userInfo.id);
                if (res && res.data && res.data.errCode === 0) {
                    setProfile(res.data.data);
                    setForm(res.data.data);
                }
            }
        };
        fetchProfile();
    }, [userInfo]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const res = await updatePatientProfile(form);
        if (res && res.data && res.data.errCode === 0) {
            setProfile(form);
            setEditMode(false);
            alert("Cập nhật thành công!");
        } else {
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div className="patient-profile-container">
            <h2>Hồ sơ cá nhân</h2>
            {editMode ? (
                <div>
                    <input name="firstName" value={form.firstName || ""} onChange={handleChange} placeholder="Họ" />
                    <input name="lastName" value={form.lastName || ""} onChange={handleChange} placeholder="Tên" />
                    <input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" />
                    <input name="phonenumber" value={form.phonenumber || ""} onChange={handleChange} placeholder="SĐT" />
                    <input name="address" value={form.address || ""} onChange={handleChange} placeholder="Địa chỉ" />
                    <button onClick={handleSave}>Lưu</button>
                    <button onClick={() => setEditMode(false)}>Hủy</button>
                </div>
            ) : (
                <div>
                    <p><b>Họ tên:</b> {profile.lastName} {profile.firstName}</p>
                    <p><b>Email:</b> {profile.email}</p>
                    <p><b>SĐT:</b> {profile.phonenumber}</p>
                    <p><b>Địa chỉ:</b> {profile.address}</p>
                    <button onClick={() => setEditMode(true)}>Chỉnh sửa</button>
                </div>
            )}
        </div>
    );
};
export default Profile;