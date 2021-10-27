const api = require("../api/api");

module.exports = {
    scan: async (req, res, next) => {
        let table = req.params.table;
        let results = await api.scan(table);
        res.json(results.data);
    },

    pscan: async (req, res, next) => {
        let table = req.params.table;
        let per_page;
        if (req.query.per_page) { per_page=req.query.per_page }
        let results = await api.pscan(table, per_page);
        res.json(results.data);
    },

    get: async (req, res, next) => {
        let table = req.params.table;
        let id = req.params.id;
        let result = await api.get(table, id);
        res.json(result.data[0]);
    },

    update: async (req, res, next) => {
        let table = req.params.table;
        let data = JSON.stringify(req.body);

        try {
            await api.update(table, data);
            res.json({"status": "success", "message": "Updated the object successfully"});
        } catch (error) {
            res.json({"status": "error", "message": "There was an error updating the object."});
        }
    }
}