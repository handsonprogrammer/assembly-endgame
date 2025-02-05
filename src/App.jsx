import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { languages } from './languages'
import clsx from 'clsx'
import { getFarewellText,getRandomWord } from './util'
import Confetti from 'react-confetti'

function App() {

  const[currentWord, setCurrentWord] = useState(getRandomWord())
  const[guessLetters, setGuessLetters] = useState([])
  let isLanguageLost = useRef(false)
  let lastLanguageLost = useRef("")
  
  // Derived values
  const wrongGuessCount = guessLetters.filter(letter => !currentWord.includes(letter.text)).length
  const isGameWon = currentWord.split("").every(letter => guessLetters.some(key=>key.text===letter))
  const isGameLost = wrongGuessCount >= languages.length-1
  const isGameOver = isGameWon || isGameLost

 

  const currentWordChars = [...currentWord].map((char,index)=>{

    const shouldRevealLetter = isGameLost || guessLetters.some(letter=>letter.text===char)
    const letterClassName = clsx(
      isGameLost && !guessLetters.some(letter=>letter.text===char) && "missed"
    )
    
    return (
      <span key={index} className={letterClassName}>
          {shouldRevealLetter ? char.toUpperCase() : ""}
      </span>
    )
    
  })
  
  const keys = Array(26).fill(0).map((_, i) => {
    return {
      id: i+97,
      text: String.fromCharCode(i+97)
    }
  })

  function handleKeyPress(key){
    setGuessLetters((prev)=>{
      if(prev.length>0 
        && prev.some(letter => letter.id === key.id)){
          return prev
      }else{
        isLanguageLost.current = !currentWord.includes(key.text);
        return [...prev,key]
      }
    })
  }

  const languageElements= languages.map((lang,index)=>{
      const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
    }
    if(index===wrongGuessCount-1) lastLanguageLost.current = lang.name
    return (
        <span className={index<wrongGuessCount?"chip lost":"chip"} key={lang.name} style={styles}>{lang.name}</span>
    )
  })

  const keyElements = [...keys].map((key)=>{

    const isGuessed = guessLetters.some(letter=>letter.id===key.id)
    const isCorrect = isGuessed && currentWord.includes(key.text)
    const isWrong = isGuessed && !currentWord.includes(key.text)
    const className = clsx({
        correct: isCorrect,
        wrong: isWrong
    })
  
    return(
      <button key={key.id} className={className} disabled={isGameOver} onClick={()=>handleKeyPress(key)}>{key.text.toUpperCase()}</button>
  )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    languageLost: !isGameOver && isLanguageLost.current
  })

  function renderGameStatus() {
    if (!isGameOver && isLanguageLost.current) {
      return (
          <>
              <h2>{getFarewellText(lastLanguageLost.current)}</h2>
              <p>{languages.length-1-wrongGuessCount} attempts left</p>
          </>
      )
    }else if(!isGameOver){
      return (
        <>
            <h2>{languages.length-1-wrongGuessCount} attempts left</h2>
        </>
    )
    }
    if (isGameWon) {
        return (
            <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </>
        )
    } else {
        return (
            <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
            </>
        )
    }
  }

  function resetGame(){
    setCurrentWord(getRandomWord())
    setGuessLetters([])
  }

  return (
    <main>
      <header>
        {isGameWon && <Confetti recycle={false} numberOfPieces={1000}/>}
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within {languages.length-1} attempts to keep the 
        programming world safe from Assembly!</p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}
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
      {isGameOver?<button className='reset' onClick={()=>resetGame()}>New Game</button>:''}
    </main>
  )
}

export default App
