const db = require("../db");
const express = require("express");
const slugify = require("slugify");
const router = new express.Router();

router.get('', async function (req, res, next) {
    try {
        const result = await db.query(
              `SELECT code, name, description 
               FROM companies 
               ORDER BY name`
        );
    
        return res.json({"companies": result.rows});
      }
    
      catch (err) {
        return next(err);
      }

});

router.get('/:code', async function (req, res, next) {
  try {
    let code = req.params.code;

    const result = await db.query(
      `SELECT code, name, description FROM companies WHERE code = $1`, [code]
    );
    
    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    }
    
    const company = result.rows[0];
    
    return res.json({"company": company});
  } catch (err) {
    return next(err);
  }
});

router.post('', async function (req, res, next){
  try {
    let {name, description} = req.body;
    let code = slugify(name, {lower: true});

    const result = await db.query(
          `INSERT INTO companies (code, name, description) 
           VALUES ($1, $2, $3) 
           RETURNING code, name, description`,
        [code, name, description]);

    return res.status(201).json({"company": result.rows[0]});
  }

  catch (err) {
    return next(err);
  }
});

router.put('/:code', async function (req, res, next) {
  try {
    const { name, description } = req.body; 
    const code = req.params.code;

    const result = await db.query(
      `UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *`,
      [name, description, code]
    );

    const company = result.rows[0];

    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
      return res.json({"company": company});
    }
  } catch (err) {
    return next(err);
  }
});

router.delete('/:code', async (req, res, next) => {
  try {
    const code = req.params.code;
    
    
    const result = await db.query('DELETE FROM companies WHERE code = $1', [code]);
    
    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
    return res.status(200).json({ message: `Company with code ${code} deleted successfully` });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'An error occurred while deleting the company' });
  }
});



module.exports = router;