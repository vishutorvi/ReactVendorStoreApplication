import React, { Component } from 'react';
import './App.css';
import Table from 'react-bootstrap/lib/Table';
import ToDoList from './components/ToDoList';
import Crud from './components/Crud';


class App extends Component {
  render() {
    return (
      
      <div className="App">
      <link rel="stylesheet" type="text/css" href="path/to/notifications.css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
          <h1>Vendor's Vehicle commerce</h1>
         <Crud />
      </div>
    );
  }
}

export default App;
