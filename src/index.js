import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/Main';

// Render the main component into the dom
ReactDOM.render(<App.Clock />,document.getElementById('clock'));
ReactDOM.render(<App.AppComponent />, document.getElementById('warp'));
