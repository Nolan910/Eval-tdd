import { describe, test, expect } from "@jest/globals";
import { createReservation } from "../src/reservation";

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