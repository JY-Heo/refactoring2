const invoices = require('../json/invoices.json');
const plays = require('../json/plays.json');
const statement = require('./statement');

invoices.forEach((invoice) => {
    console.log(statement(invoice, plays));
});
