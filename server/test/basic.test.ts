import assert from "assert";
import AppointmentsRepo from "../src/db/appointmentsRepo.js";

console.log("Running server create/delete test...");

const repo = new AppointmentsRepo();

// create a unique datetime (next day, rounded to next 30-minute mark)
const dt = new Date(Date.now() + 24 * 3600 * 1000);
const minutes = dt.getMinutes();
const rounded = Math.ceil(minutes / 30) * 30;
dt.setMinutes(rounded % 60, 0, 0);
if (rounded >= 60) dt.setHours(dt.getHours() + 1);
const iso = dt.toISOString();

const created = repo.insert({
	datetime: iso,
	name: "Test User",
	email: "test@example.com",
	phone: null,
	reason: "test create/delete",
});

assert.ok(created && typeof created.id === "number", "insert should return created appointment with numeric id");

const fetched = repo.getById(created.id);
assert.ok(fetched, "getById should return the created appointment");
assert.strictEqual(fetched?.email, "test@example.com", "fetched row should have the same email");

repo.deleteById(created.id);
const afterDelete = repo.getById(created.id);
assert.strictEqual(afterDelete, undefined, "appointment should be removed after deleteById");

console.log("Server create/delete test passed");
process.exit(0);
