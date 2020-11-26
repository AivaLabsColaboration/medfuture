"use strict";

require("dotenv/config");

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireWildcard(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _helper = require("./helpers");

let _ = t => t,
    _t;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
const port = process.env.PORT || 3000;
app.use((0, _cors.default)());
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use(_bodyParser.default.json());
const schema = (0, _apolloServerExpress.gql)(_t || (_t = _`
  type Query {
    hello: String
    postToSheet(email: String!, apnt_date: String!, apnt_time: String!, first_name: String!, middle_name: String, last_name: String!, phone: String!, dob: String!, traveler: Boolean!, gender: String!, test: String!, order: String!, agreement: Boolean!): PostSuccess
  }
  type PostSuccess {
    message: String
  }
`));
const resolvers = {
  Query: {
    postToSheet: async (parent, args, context, info) => {
      try {
        const postOnSheet = await (0, _helper.postToSheet)(args);

        if (postOnSheet) {
          return {
            message: 'bbbb'
          };
        } else {
          return {
            message: 'bbb'
          };
        }
      } catch (e) {}
    },
    hello: () => {
      return 'Hello World!';
    }
  }
};
const server = new _apolloServerExpress.ApolloServer({
  typeDefs: schema,
  resolvers
});
server.applyMiddleware({
  app,
  path: '/graphql'
});
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.post('/hooks/order', async (req, res) => {
  const data = req.body;
  let attribute = data.note_attributes.find(item => item.name == 'gsheet_id');
  const postData = {
    attribute: attribute && attribute.value ? attribute.value : 'AAAAA',
    order_id: data.id
  };

  try {
    let update = await (0, _helper.updateSheet)(postData);
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

  try {
    let update = await (0, _helper.updatePayment)({
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
  console.log(`Apollo server on http://localhost:${port}/graphql`);
});