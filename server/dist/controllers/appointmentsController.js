export default class AppointmentController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    listAll(_req, res, next) {
        try {
            const out = this.svc.listAll();
            return res.json(out);
        }
        catch (err) {
            return next(err);
        }
    }
    getAvailable(req, res, next) {
        try {
            const qs = req.query.weekStart;
            let weekStart;
            if (qs) {
                const d = new Date(`${qs}T00:00:00`);
                if (Number.isNaN(d.getTime())) {
                    const e = new Error("Invalid weekStart date");
                    e.status = 400;
                    throw e;
                }
                weekStart = d;
            }
            else {
                const temp = new Date();
                const d = temp.getDay();
                const diff = (d === 0 ? -6 : 1 - d);
                temp.setDate(temp.getDate() + diff);
                temp.setHours(0, 0, 0, 0);
                weekStart = temp;
            }
            const { available, booked } = this.svc.getAvailableSlots(weekStart);
            return res.json({ weekStart: weekStart.toISOString(), resp: { available, booked } });
        }
        catch (err) {
            return next(err);
        }
    }
    create(req, res, next) {
        try {
            const created = this.svc.create(req.body || {});
            return res.status(201).json(created);
        }
        catch (err) {
            return next(err);
        }
    }
    cancel(req, res, next) {
        try {
            const out = this.svc.cancel(req.params.id);
            return res.json(out);
        }
        catch (err) {
            return next(err);
        }
    }
    update(req, res, next) {
        try {
            const out = this.svc.update(req.params.id, req.body || {});
            return res.json(out);
        }
        catch (err) {
            return next(err);
        }
    }
}
