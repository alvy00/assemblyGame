import React, { useEffect, useRef, useState } from "react"
import confetti from 'canvas-confetti';
import languages from "./languages"
import { words } from "./word";
import getFarewellText from "./utils";

export default function App() {

  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLtr, setGuessedLtr] = useState([]);
  const [wrongGuessed, setWrongGuessed] = useState(false);
  const [gsLeft, setGsLeft] = useState(8);
  const [gameLost, setGameLost] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [frText, setFrText] = useState("");
  const spanRefs = useRef([]);
  const langSpanRefs = useRef([]);
  const keysRef = useRef([]);
  const secRef = useRef(null);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const style = {
    backgroundColor: "#7A5EA7",
    border: "1px dashed",
    fontWeight: "300"
  }
  

  function keyPressed(e) {
    setGuessedLtr((prev) => !prev.includes(e.target.innerText) ? [...prev, e.target.innerText]:prev);
    if(currentWord.indexOf(e.target.innerText.toLowerCase()) === -1 && !guessedLtr.includes(e.target.innerText))
      setGsLeft((prev) => prev-1);
    e.target.classList.add(currentWord.toUpperCase().includes(e.target.innerText)? "correct":"wrong");

  }
  function newGame(){
    // const randomWord = words[Math.floor(Math.random() * words.length)];
    // setCurrentWord(randomWord);
    // setGuessedLtr([]);
    // setGsLeft(8);
    window.location.reload();
  }
  function fireConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    console.log(randomWord);
  }, [])

  useEffect(() => {
    const targetSpan = langSpanRefs.current[7 - gsLeft];
    if (targetSpan){
      targetSpan.classList.add("lost");
      setWrongGuessed(true);
      Object.assign(secRef.current.style, style);
      //secRef.current.style.borderStyle = "dashed";
      setFrText(getFarewellText(targetSpan.innerText));
      //console.log(getFarewellText(targetSpan.innerText));
    }

    if(gsLeft === 0){
      keysRef.current.forEach((key) => {
        if(key) key.disabled = true;
      })
      spanRefs.current.forEach((span) => {
        if(span && !guessedLtr.includes(span.innerText.toUpperCase())){
          span.style.color = "#EC5D49";
        }
      })
      setGameLost(true);
    } 
  }, [gsLeft])

  useEffect(() => {
    spanRefs.current.forEach((span) => {
      if(span && guessedLtr.includes(span.innerText.toUpperCase())){
        span.style.color = "#F9F4DA";
      }   
    })    

    if(currentWord.toUpperCase().split("").every(letter => guessedLtr.includes(letter))){
      keysRef.current.forEach((key) => {
        if(key) key.disabled = true;
      })
      setGameWon(true);
    }
    //console.log(gameWon);
  }, [guessedLtr]);


  const langElem = languages.map((obj, index) => 
    <span 
      key={obj.name}
      className={""}
      ref={(r) => (langSpanRefs.current[index] = r)} 
      style={{color:obj.color, backgroundColor: obj.backgroundColor}}
      >
        {obj.name}
    </span>
  );

  const wordElem = currentWord.split("").map((letter, index) => 
      <span 
        key={letter}
        ref={(r) => (spanRefs.current[index] = r)}
        value={letter} 
        style={{color:"#323232"}}
        >
          {letter.toUpperCase()}
          </span>
);
  const keysElem = alphabet.split("").map((letter, index) => 
      <button 
        ref={(r) => keysRef.current[index] = r}
        key={index}
        aria-disabled={guessedLtr.includes(letter)}
        aria-label={`Letter ${letter}`}
        className={"keysBtn"}
        onClick={(e) => keyPressed(e)}
        >
          {letter.toUpperCase()}
        </button>
  );
  
  return (
      <main>
          <header>
              <h1>Assembly: Endgame</h1>
              <p>Guess the word within 8 attempts to keep the 
              programming world safe from Assembly!</p>
          </header>
          <section ref={secRef} className="game-status" style={{ backgroundColor: gameWon ? "#10A95B" : gameLost ? "#BA2A2A" : "#323232"}} >
              {((!gameWon && !gameLost) && <h2>{(frText !== "") ? frText:null}</h2>)}
              <h2 style={{display: gameWon? "block":"none"}}>You win!</h2>
              <p style={{display: gameWon? "block":"none"}}>Well done! 🎉</p>
              
              <h2 style={{display: gameLost? "block":"none"}}>Game over!</h2>
              <p style={{display: gameLost? "block":"none"}}>You lose! Better start learning Assembly 😭</p>
          </section>
          <div className="langs">
              {langElem}
          </div>
          <div className="word">
              {wordElem}
          </div>
          <div className="keyboard">
              {keysElem}
          </div>
          {(gameWon || gameLost) && <button className="new-game" onClick={newGame}>New Game</button>}
          {gameWon && fireConfetti()}
      </main>
  )
}
