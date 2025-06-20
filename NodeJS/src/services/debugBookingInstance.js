import db from "../models/index.js";

export const debugBookingInstance = async (whereCondition) => {
    try {
        let bookings = await db.Booking.findAll({ where: whereCondition });
        console.log("---- Booking.findAll KHÔNG include ----");
        console.log("Is instance:", bookings[0] instanceof db.Booking);
        console.log("Prototype:", bookings[0] && bookings[0].__proto__);
        console.log("Keys:", bookings[0] && Object.keys(bookings[0]));

        let bookingsJoin = await db.Booking.findAll({
            where: whereCondition,
            include: [
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: [
                        'firstName', 'lastName', 'address', 'phonenumber',
                        'gender', 'email'
                    ]
                },
                {
                    model: db.Allcode,
                    as: 'timeTypeDataPatient',
                    attributes: ['valueVi', 'valueEn']
                }
            ]
        });
        console.log("---- Booking.findAll CÓ include ----");
        console.log("Is instance:", bookingsJoin[0] instanceof db.Booking);
        console.log("Prototype:", bookingsJoin[0] && bookingsJoin[0].__proto__);
        console.log("Keys:", bookingsJoin[0] && Object.keys(bookingsJoin[0]));
    } catch (e) {
        console.error("Error in debugBookingInstance:", e);
    }
};