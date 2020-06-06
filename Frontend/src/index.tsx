import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//PEDINDO PARA O REACT MOSTRAR OS DADOS DENTRO DA DIV COM O ID ROOT 
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
