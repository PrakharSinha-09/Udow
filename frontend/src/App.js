import './App.css';
import {Route} from 'react-router-dom'
import HomePage from './Components/HomePage';
import Chat from './Components/Chat';
function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route exact path="/chat" component={Chat} />
    </div>
  );
}

export default App;
