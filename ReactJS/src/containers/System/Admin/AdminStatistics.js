import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { getAdminStatistics } from '../../../services/userService';
import './AdminStatistics.scss';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#d32f2f'];

function AdminStatistics() {
    const [stats, setStats] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        getAdminStatistics()
            .then(res => {
                if (isMounted) {
                    console.log('[API RAW RESPONSE]', res);
                    setStats(res); // SỬA Ở ĐÂY!
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setLoading(false);
                    setStats(null);
                    if (err.response) {
                        console.error('API ERROR', err.response.status, err.response.data);
                    } else {
                        console.error('API ERROR', err.message);
                    }
                }
            });
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        console.log('[STATS STATE CHANGED]', stats);
    }, [stats]);

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>Không có dữ liệu</div>;

    const isValidStatus = Array.isArray(stats.bookingByStatus) && stats.bookingByStatus.some(i => i.paymentStatus && i.count > 0);
    const isValidDate = Array.isArray(stats.bookingByDate) && stats.bookingByDate.some(i => i.total > 0);

    const bookingStatusData = isValidStatus ? stats.bookingByStatus.filter(item => item.paymentStatus && item.count > 0) : [];
    const bookingByDate = isValidDate ? stats.bookingByDate.filter(item => item.total > 0) : [];
    const totalPatientsToday = stats.totalPatientsToday ?? 0;

    if (!isValidStatus && !isValidDate && totalPatientsToday === 0) return <div>Không có dữ liệu</div>;

    return (
        <div className="admin-statistics-container">
            <h2 className="stat-title">Thống kê tổng quan</h2>
            <div className="stat-kpi-cards">
                <div className="kpi-card">
                    <div className="kpi-title">Bệnh nhân mới hôm nay</div>
                    <div className="kpi-value">{totalPatientsToday}</div>
                </div>
            </div>
            <div className="stat-charts-wrapper">
                <div className="stat-chart">
                    <h3>Tỷ lệ trạng thái booking</h3>
                    {bookingStatusData.length > 0 ? (
                        <PieChart width={300} height={240}>
                            <Pie
                                data={bookingStatusData}
                                dataKey="count"
                                nameKey="paymentStatus"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {bookingStatusData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    ) : (
                        <div>Không có dữ liệu trạng thái booking</div>
                    )}
                </div>
                <div className="stat-chart">
                    <h3>Số booking theo ngày</h3>
                    {bookingByDate.length > 0 ? (
                        <BarChart width={400} height={240} data={bookingByDate}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bookingDate" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#1677ff" />
                        </BarChart>
                    ) : (
                        <div>Không có dữ liệu booking theo ngày</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminStatistics;