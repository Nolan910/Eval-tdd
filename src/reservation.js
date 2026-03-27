import { ValidationError } from "./errors.js";

function isClashing(existing, newRes) {
    return existing.some(r => !(newRes.start >= r.end || newRes.end <= r.start));
}

// Création réservation
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
    if (isClashing(reservations, newReservation)) {
        throw new ValidationError("Reservation clash");
    }

    // ID déjà existant
    if (reservations.some(r => r.id === newReservation.id)) {
        throw new ValidationError("Reservation ID already exists");
    }

    reservations.push(newReservation);
    return reservations;
}

// Annulation réservation
export function cancelReservation() {
  throw new Error("Not implemented yet");
}