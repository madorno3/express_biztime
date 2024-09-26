/** BizTime express application. */


const express = require("express");

const app = express();
const ExpressError = require("./expressError");
const companies_routes = require("./routes/companies");
const invoice_routes = require("./routes/invoices");

app.use(express.json());

app.use('/companies', companies_routes);
app.use('/invoices', invoice_routes);


app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

app.listen(3000, function () {
  console.log('Server started on 3000');
});
