const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const convert = require('xml-js')

const app = express();
const mySecret = process.env['API_KEY']
const allowed_keys = ["average_rating", "best_book"] 

app.get('/', (req, res) => {
  res.send("Home");
})

app.get('/search/:query/page/:pageNum', cors(), (req, res) => {
  res.header("Content-Type",'application/json');
  const search_query = req.params["query"];
  const page_number = req.params["pageNum"];
  fetch(`https://www.goodreads.com/search/index.xml?q=${search_query}&page=${page_number}&key=${mySecret}
`)
  .then(response => response.text())
  .then(xml => convert.xml2json(xml, {compact: true, spaces: 4}))
  .then(json => res.send(JSON.stringify(parse_goodreads_response(json), null, 4)));
});

app.listen(3000, () => {
  console.log('server started');
});

function parse_goodreads_response (json){
  const books = JSON.parse(json)["GoodreadsResponse"]["search"]["results"]["work"];
  let filtered_books = books.map(
    item => construct_obj(item["average_rating"], item["best_book"])
  );
  return filtered_books;
  return books;
}

function construct_obj (average_rating_object, best_book_object){
  let obj = {
    average_rating: average_rating_object,
    best_book: best_book_object
  };
  return obj;
}