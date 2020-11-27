"use strict";

require("dotenv/config");

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
const port = process.env.PORT || 3000;
app.use((0, _cors.default)());
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use(_bodyParser.default.json());
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.post('/sheet', async (req, res) => {
  try {
    const postOnSheet = await (0, _helpers.postToSheet)(req.body);

    if (postOnSheet) {
      res.status(201).json({
        message: 'Form data has been successfully stored on Google Sheet'
      });
    } else {
      res.status(421).json({
        message: 'Something went wrong!'
      });
    }
  } catch (e) {
    res.status(400).json({
      message: 'Response couldn\'t be processed at this itme!'
    });
  }
});
app.post('/hooks/order', async (req, res) => {
  const data = req.body;
  console.log(data.note_attributes);
  let attribute = data.note_attributes.find(item => item.name == 'gsheet_id');
  const postData = {
    attribute: attribute && attribute.value ? attribute.value : 'AAAAA',
    order_id: data.id
  };

  try {
    console.log('Here');
    let update = await (0, _helpers.updateSheet)(postData);
    res.json({
      response: 'Submission Successfull'
    });
  } catch (e) {
    res.json({
      response: 'Submission Failed',
      reason: e
    });
  }
});
app.post('/hooks/payment', async (req, res) => {
  const data = req.body;
  console.log(data.id);

  try {
    let update = await (0, _helpers.updatePayment)({
      order_id: data.id
    });
    res.json({
      response: 'Submission Successfull'
    });
  } catch (e) {
    res.json({
      response: 'Submission Failed',
      reason: e
    });
  }
});
app.listen(port, () => {
  console.log(`Express server on http://localhost:${port}`);
});