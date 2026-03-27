import { describe, test, expect } from "@jest/globals";
import { createReservation, cancelReservation } from "../src/reservation";
import { ValidationError } from "../src/errors.js";

describe("Given I try to create a reservation", () => {
    test("When reservation is valid, it is added", () => {
        const reservations = [];
        const result = createReservation(reservations, {
            id: 1,
            name: "reservation1",
            start: new Date("2026-05-10"),
            end: new Date("2026-05-12")
        });
        expect(result.length).toBe(1);
    });
    test("When reservation starts exactly at the end of another, it is allowed", () => {
        const reservations = [{
                id: 1,
                name: "reservation1",
                start: new Date("2026-05-10"),
                end: new Date("2026-05-12")
            }];
        const result = createReservation(reservations, {
            id: 2,
            name: "reservation2",
            start: new Date("2026-05-12"),
            end: new Date("2026-05-14")
        });
        expect(result.length).toBe(2);
    });

    test("When reservation has no start date", () => {
        const reservations = [];
        expect(() => createReservation(reservations, {
            id: 1,
            name: "reservation1",
            start: null,
            end: new Date("2026-05-12")
        })).toThrow("Start and end dates are required");
    });

    test("When reservation has no end date", () => {
        const reservations = [];
        expect(() => createReservation(reservations, {
            id: 2,
            name: "reservation2",
            start: new Date("2026-05-10"),
            end: null
        })).toThrow("Start and end dates are required");
    });

    test("When end date is before start date", () => {
        const reservations = [];
        expect(() => createReservation(reservations, {
            id: 1,
            name: "reservation1",
            start: new Date("2026-05-12"),
            end: new Date("2026-05-10")
        })).toThrow("End date must be after start date");
    });

    test("When reservation clash another", () => {
        const reservations = [{
                id: 1,
                name: "reservation1",
                start: new Date("2026-05-10"),
                end: new Date("2026-05-12")
            }];
        expect(() => createReservation(reservations, {
            id: 2,
            name: "reservation2",
            start: new Date("2026-05-11"),
            end: new Date("2026-05-13")
        })).toThrow("Reservation clash");
    });

    test("When reservation ID is already used", () => {
        const reservations = [{
                id: 1,
                name: "reservation1",
                start: new Date("2026-05-10"),
                end: new Date("2026-05-12")
            }];
        expect(() => createReservation(reservations, {
            id: 1,
            name: "reservation2",
            start: new Date("2026-05-12"),
            end: new Date("2026-05-14")
        })).toThrow("Reservation ID already exists");
    });

});

describe("Given I try to cancel a reservation", () => {
    test("When cancellation is requested at least 48h before start", () => {
        const reservations = [{ id: 1, name: "reservation1", start: new Date("2026-05-10T10:00:00"), end: new Date("2026-05-12") }];
        const result = cancelReservation(reservations, 1, new Date("2026-05-08T10:00:00"));
        expect(result.some(r => r.id === 1)).toBe(false);
    });
    
    test("When reservation does not exist", () => {
        const reservations = [ { id: 1, name: "reservation1", start: new Date("2026-05-10"), end: new Date("2026-05-12") }];
        expect(() => cancelReservation(reservations, 2, new Date("2026-05-08")))
            .toThrow(new ValidationError("Reservation does not exist"));
    });

    test("When cancellation is less than 48h before", () => {
        const reservations = [{ id: 1, name: "reservation1", start: new Date("2026-05-10T10:00:00"), end: new Date("2026-05-12") }];
        expect(() => cancelReservation(reservations, 1, new Date("2026-05-09T12:00:00")))
            .toThrow(new ValidationError("Cannot cancel reservation less than 48h before start"));
    });

});

describe("Given I try to search for reservations on a specific date", () => {

    test("When no reservations exist, it returns empty", () => {
        const reservations = [];
        const result = getReservationsByDate(reservations, new Date("2026-05-09"));
        expect(result.length).toBe(0);
    });

    test("When a reservation covers the searched date, it is returned", () => {
        const reservations = [{ id: 1, name: "res1", start: new Date("2026-05-08"), end: new Date("2026-05-10") }];
        const result = getReservationsByDate(reservations, new Date("2026-05-09"));
        expect(result.some(r => r.id === 1)).toBe(true);
    });

    test("When a reservation does not cover the searched date, it is not returned", () => {
        const reservations = [{ id: 1, name: "res1", start: new Date("2026-05-10"), end: new Date("2026-05-12") }];
        const result = getReservationsByDate(reservations, new Date("2026-05-09"));
        expect(result.length).toBe(0);
    });

    test("When multiple reservations overlap the searched date, all are returned", () => {
        const reservations = [
            { id: 1, name: "res1", start: new Date("2026-05-08"), end: new Date("2026-05-10") },
            { id: 2, name: "res2", start: new Date("2026-05-09"), end: new Date("2026-05-11") },
            { id: 3, name: "res3", start: new Date("2026-05-12"), end: new Date("2026-05-14") }
        ];
        const result = getReservationsByDate(reservations, new Date("2026-05-09"));
        expect(result.map(r => r.id)).toEqual(expect.arrayContaining([1, 2]));
        expect(result.some(r => r.id === 3)).toBe(false);
    });

});