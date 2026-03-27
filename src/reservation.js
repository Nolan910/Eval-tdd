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
export function cancelReservation(reservations, reservationId, requestDate) {
  const index = reservations.findIndex(r => r.id === reservationId);

    // Existe
    if (index === -1) {
        throw new ValidationError("Reservation does not exist");
    }
    const reservation = reservations[index];

    // Vérification 48h avant
    const diffEnMs = reservation.start - requestDate;
    const diffEnHours = diffEnMs / (1000 * 60 * 60);
    if (diffEnHours < 48) {
        throw new ValidationError("Cannot cancel reservation less than 48h before start");
    }

    
    reservations.splice(index, 1);
    return reservations;
}