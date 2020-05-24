const invoices = require('../json/invoices.json');
const plays = require('../json/plays.json');
const {
    statement,
    htmlStatement
} = require('./statement');

invoices.forEach((invoice) => {
    console.log(statement(invoice, plays));
    console.log(htmlStatement(invoice, plays));
});
