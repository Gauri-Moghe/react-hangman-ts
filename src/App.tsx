import { useCallback, useEffect, useState } from "react"
import words from "./wordList.json" //importing the word list 
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";



function getWord(){

return words[Math.floor(Math.random() * words.length)] //call a random word from the word list

}


function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord); //call a random word from the word list through func getWord

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]) // to keep a track of the letters guessed till now (use state will specifically be an array of length 1 strings)

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter)) //all incorrect letters are the ones not in the wordToGuess

  const isLoser =  incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))
  
  const addGuessedLetter = useCallback((letter : string) => {

    if(guessedLetters.includes(letter) || isLoser || isWinner) return //if the letter is already guessed

    setGuessedLetters(currentLetters => [...currentLetters, letter]) //if not add the letter to the end of the current letters into the setGuessedLetters

  }, [guessedLetters, isWinner, isLoser])

  const { width, height } = useWindowSize();

  
  

  // useEffect(() => {
  //   const handler = (e : KeyboardEvent) => {

  //     // const key = e.key 
  //     const key = e.key.toLowerCase();

  //      if(!key.match(/^[a-z]$/)) return 

  //     e.preventDefault()

  //     addGuessedLetter(key)


  //   }

  //   //hooking the eventListener 
  //   document.addEventListener("keypress", handler)

  //   return () => { //to clean and remove the eventlistener when the use event is done listening(when the component is removed)
  //     document.removeEventListener("keypress", handler)
  //   } 

  // }, [guessedLetters])

  // useEffect(() => {
  //   const handler = (e : KeyboardEvent) => {

  //     const key = e.key 

  //     if(key !== "Enter" ) return 

  //     e.preventDefault()
  //     setGuessedLetters([])
  //     setWordToGuess(getWord())
     
  //   }

  //   //hooking the eventListener 
  //   document.addEventListener("keypress", handler)

  //   return () => { //to clean and remove the eventlistener when the use event is done listening(when the component is removed)
  //     document.removeEventListener("keypress", handler)
  //   }

  // }, [])

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    // restart game on Enter only if over
    if (key === "enter" && (isWinner || isLoser)) {
      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
      return;
    }

    // ignore non-letters
    if (!key.match(/^[a-z]$/)) return;

    e.preventDefault();
    addGuessedLetter(key);
  };

  document.addEventListener("keypress", handler);
  return () => document.removeEventListener("keypress", handler);
}, [addGuessedLetter, isWinner, isLoser]);

//handles scroll-to-top when game ends
useEffect(() => {
  if (isWinner || isLoser) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [isWinner, isLoser]);

  return (
  
    <>
    {isWinner && (
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}
        recycle={false}
        gravity={0.3}
      />
    )}

    {isLoser && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(200, 0, 0, 0.25)",
          zIndex: 10,
          animation: "fadeOverlay 1s ease-in-out",
          pointerEvents: "none",
        }}
      />
    )}
  
  <div
    style={{
      // maxWidth: "800px",
      // display: "flex",
      // flexDirection: "column",
      // gap: "2rem", //space between each item is 2rem
      // margin: "0 auto",
      // alignItems: "center"

      
      width: "min(90vw, 800px)", // scales width
      display: "flex",
      flexDirection: "column",
      gap: "3rem 0",
      margin: "0 auto",
      alignItems: "center",
      padding: "2rem 1rem",
      textAlign: "center",
      
      // background: "linear-gradient(135deg, #FFD6A5 0%, #ffd3cbff 100%)",
      // backgroundSize: "400% 400%",
      // animation: "gradientShift 10s ease infinite",

      
    }}>

    {/* section for winning or losing */}
    
    <div 
    className={isWinner ? "win" : isLoser ? "lose" : ""}
  style={{
    fontSize: "2rem",
    fontWeight: 600,
    textAlign: "center",
    marginTop: "1.5rem",
    marginBottom: "2rem",
    minHeight: "2.5rem", // keeps layout consistent
    transition: "all 0.3s ease-in-out",
  }}
    // style={{ fontSize: "2rem", textAlign: "center" }}
    >

      {isWinner && "🎉 You Won! Refresh to play again"}
      {isLoser && "😔 You Lost! Refresh the game to start again"}

      </div>
    <HangmanDrawing numberOfGuesses = {incorrectLetters.length}/> 
    <HangmanWord reveal = {isLoser} guessedLetters = {guessedLetters} wordToGuess = {wordToGuess}/>

    <div style = {{alignSelf: "stretch"}}>

      <Keyboard 
        disabled = {isWinner || isLoser }
        activeLetters = {guessedLetters.filter(letter =>
        wordToGuess.includes(letter)
       )}
       inactiveLetters = {incorrectLetters}
       addGuessedLetter = {addGuessedLetter}
      />

    </div>

  </div>
  </>
  )
}

export default App
