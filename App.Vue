<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
  <div id="app">
    <h1>{{message}}</h1>

    <form @submit.prevent="submitForm" id="form">
      <input type="search" id="query" name="query" placeholder="Input your search here..." v-model.trim="searchString">
      <button>Search</button>
    </form>
    
    <div id="results">
      <div v-if="error">
        <p>Error receiving response from API!</p>
      </div>
      <table v-if="(books.length > 0)">
        <tr>
          <th>Cover Art</th>
          <th>Title</th>
          <th>Author</th>
          <th>Average Rating</th>
          <th>GoodReads URL</th>
        </tr>
        <tr v-for="book in books" :key="book.id">
          <td><img :src=book.best_book.small_image_url._text></td>
          <td>{{ book.best_book.title._text }}</td>
          <td>{{ book.best_book.author.name._text }}</td>
          <td>{{ book.average_rating._text }}⭐</td>
          <td>
            <a :href="'https://www.goodreads.com/book/show/'+book.best_book.id._text">Link</a>
          </td>
        </tr>
      </table>
      <input id="pageNumber" type="number" v-if="(books.length > 0)" v-model="page" v-on:input="submitForm" min="1" max="20" value="1" onkeydown="javascript: return event.keyCode === 8 ||
event.keyCode === 46 ? true : !isNaN(Number(event.key))"></input>
<!--   There's a bug in my code that exists appears because e can be used in input type=number. Need to handle this or else it causes an infinite crashing loop.   -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Search the GoodReads library!',
      error: false,
      searchString: '',
      page: '1',
      books: [],
    };
  },
  methods: {
    submitForm() {
      if(this.page === ''){
        this.page = '1';
      }
      // the only character we can type in the number input is delete or backspace, this solves that issue by forcing page to default to 1 if the string is deleted
      this.books = [];
      this.error = false;
      console.log('Query: ' + this.searchString);
      fetch(`https://ringedrosybrownsubweb.jonathanzeng1.repl.co/search/${encodeURIComponent(this.searchString)}/page/${this.page}`)
      .then(res => {
          if (!res.ok){
            //add error handling if request returns non 200 response
            this.error = true;
          }
          else{
            res.json().then((data) => {
              console.log(data);
              this.books = data;
            });
          }
      })
      .catch(res => {
        this.error = true;
      })
    }
  },
};
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  
input, button, ::placeholder{
  color: #cb4154;
}  
  
::placeholder{
  opacity: 0.5;
  font-style: italic;
}
  
tr:nth-child(even){
  background-color: #f2f2f2;
}
  
input, button {
  background: none;
  border: solid 1px;
  border-radius: 2em;
  font: inherit;
  padding: 0.75em 2em;
  outline: none;
}
  
button{
  cursor: pointer;
}

table {
  border: solid black 1px;
  border-radius: 2em;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: auto;
  margin-top: 10px;
}
  
  #pageNumber {
    all: unset;
    margin-top: 10px;
    border: solid black 1px;
  }
  
</style>