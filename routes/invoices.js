const db = require("../db");
const express = require("express");
const router = new express.Router();

router.get('', async function (req, res, next){
    try {
        const result = await db.query('SELECT * FROM invoices');
        return res.json({"invoices": result.rows});
    } catch (err){
        return next(err)
    }
})

router.get('/:id', async function (req, res, next){
    try {
        const id = req.params.id;
        const result = await db.query('SELECT id, comp_code, paid, add_date, paid_date FROM invoices WHERE id = $1', [id]);
        const invoice = result.rows[0];
        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${id}`, 404)
        }
        return res.json({"invoices": invoice});

    } catch (err) {
        return next(err)
    }

})

router.post('', async function(req, res, next){
    try{
        let {comp_code, amt} = req.body;
        const result = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date', [comp_code, amt]);
            return res.json({"invoice": result.rows[0]});

    } catch (err) {
        return next (err);
    }
})

router.delete("/:id", async function (req, res, next) {
    try {
      let id = req.params.id;
  
      const result = await db.query(
            `DELETE FROM invoices
             WHERE id = $1
             RETURNING id`,
          [id]);
  
      if (result.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
      }
  
      return res.json({"status": "deleted"});
    }
  
    catch (err) {
      return next(err);
    }
});

module.exports = router;