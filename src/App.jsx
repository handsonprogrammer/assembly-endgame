import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { languages } from './languages'

function App() {

  const[currentWord, setCurrentWord] = useState("react")

  const currentWordChars = [...currentWord].map((char,index)=>{
    return <span key={index} className="currentWordChar">{char}</span>
  })

  const languageElements= languages.map((lang)=>{
      const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
    }
    return (
        <span className="chip" key={lang.name} style={styles}>{lang.name}</span>
    )
  })

  const [keys, setKeys] = useState(()=>{return composeKeys()})

  function composeKeys(){
    let keys = []
    for (let i = 97; i <= 122; i++) {
      keys.push({
        id: i,
        text: String.fromCharCode(i),
        active: true
      })
    }
    return keys
  }

  const keyElements = [...keys].map((key)=>{
    return(
      <span key={key.id} className="key incorrectKey">{key.text.toUpperCase()}</span>
    )
  })

  console.log(keyElements)

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the 
        programming world safe from Assembly!</p>
      </header>
      <section className="game-status">
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
      </section>
      <section className="language-chips">
          {languageElements}
      </section>
      <section className="current-word">
        {currentWordChars}
      </section>
      <section className='keyboard'>
        {keyElements}
      </section>
    </main>
  )
}

export default App
