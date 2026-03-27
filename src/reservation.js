import { ValidationError } from "./errors.js";

export function createReservation(reservations, newReservation) {
    
    // Manque une date
    if (!newReservation.start || !newReservation.end) {
        throw new ValidationError("Start and end dates are required");
    }

    // Date de fin avant début
    if (newReservation.end < newReservation.start) {
        throw new ValidationError("End date must be after start date");
    }
    
    // Chevauchement de réservation
    const clash = reservations.some(r => {
        return !(newReservation.start >= r.end || newReservation.end <= r.start);
    });

    // ID déjà existant
    if (reservations.some(r => r.id === newReservation.id)) {
        throw new ValidationError("Reservation ID already exists");
    }

    if (clash) {
        throw new ValidationError("Reservation clash");
    }

    reservations.push(newReservation);
    return reservations;
}