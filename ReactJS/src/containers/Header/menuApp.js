export const adminMenu = [
    {
        name: 'menu.system.header', 
        menus: [
            // { name: 'menu.admin.crud', link: '/system/user-manage' }, // ĐÃ XOÁ DÒNG NÀY
            { name: 'menu.admin.crud-redux', link: '/system/user-redux' },
            { name: 'menu.admin.manage-doctor', link: '/system/manage-doctor' },
            { name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule' },
            { name: 'menu.admin.manage-qr-payment', link: '/system/manage-qr-payment' }
        ]
    },
    {
        name: 'menu.admin.clinic',
        menus: [
            { name: 'menu.admin.manage-clinic', link: '/system/manage-clinic' }
        ]
    },
    {
        name: 'menu.admin.specialty',
        menus: [
            { name: 'menu.admin.manage-specialty', link: '/system/manage-specialty' }
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.header',
        menus: [
            { name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule' },
            { name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient' },
            { name: 'menu.doctor.history', link: '/doctor/history' },
        ]
    }
];

