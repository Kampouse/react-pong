import { useState,useRef,useEffect} from 'react'
import logo from './logo.svg'
import './App.css'
import CanvasPractice from './CanvasPratice'
function display_key()
{
	key_pressed(event);
	console.log(key)

}

function App() {

  return (
    <div className="App">
      <header className="App-header">
		  <CanvasPractice/>
     </header>
    </div>
  )
}

export default App
