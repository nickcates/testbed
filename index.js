const express = require('express');
const moment = require('moment');
const lodash = require('lodash');
const underscore = require('underscore');
const axios = require('axios');
const request = require('request');
const validator = require('validator');
const chalk = require('chalk');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  const data = lodash.map([1, 2, 3], n => n * 2);

  res.json({
    message: 'Hello World',
    timestamp: now,
    data: data
  });
});

app.listen(port, () => {
  console.log(chalk.green(`Server running on port ${port}`));
});
