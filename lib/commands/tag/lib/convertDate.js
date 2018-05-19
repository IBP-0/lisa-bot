const moment = require("moment");

const convertDate = date => moment(date).format("YYYY-MM-DD HH:mm:ss:SSSSSS");

module.exports = convertDate;
