import React, { useEffect, useState } from 'react';
import './styles/game.css';
import Navbar from './nav.jsx';

function Game() {
  const [flashcards, setFlashcards] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [matchedFlashcards, setMatchedFlashcards] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [matchResult, setMatchResult] = useState(null);

  // Utility function to shuffle an array
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ ...item, sortKey: Math.random() }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ sortKey, ...item }) => item);
  };

  // Load flashcards from localStorage and shuffle them when the component mounts
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    if (savedFlashcards) {
      const parsedFlashcards = JSON.parse(savedFlashcards);
      setFlashcards(parsedFlashcards);
      setShuffledQuestions(shuffleArray(parsedFlashcards));
      setShuffledAnswers(shuffleArray(parsedFlashcards));
    }
  }, []);

  const selectQuestion = (question) => {
    setSelectedQuestion(question);
    setMatchResult(null); // Reset match result when a new question is selected
  };

  const selectAnswer = (answer) => {
    // Ensure a question is selected before proceeding
    if (!selectedQuestion) {
      setMatchResult('Please select a question first!');
      setTimeout(() => setMatchResult(null), 1000); // Clear the message after 1 second
      return;
    }
  
    setSelectedAnswer(answer);
  
    if (selectedQuestion.answer === answer) {
      setCorrectCount((prevCount) => prevCount + 1);
      setMatchResult('Correct!');
      setMatchedFlashcards((prev) => [...prev, selectedQuestion.id]); // Add matched flashcard ID
    } else {
      setWrongCount((prevCount) => prevCount + 1);
      setMatchResult('Wrong!');
    }
  
    setTimeout(() => {
      setSelectedQuestion(null); // Reset the selected question after delay
      setSelectedAnswer(null); // Reset the selected answer after delay
      setMatchResult(null); // Reset match result
    }, 1000);
  };

  const restartGame = () => {
    setMatchedFlashcards([]);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setMatchResult(null);
    setShuffledQuestions(shuffleArray(flashcards)); // Reshuffle questions
    setShuffledAnswers(shuffleArray(flashcards)); // Reshuffle answers
  };

  const isGameOver = matchedFlashcards.length === flashcards.length;

  return (
    <>
      <Navbar />
      <div className="game-container">
        <h2>Match the Question to the Answer</h2>
        <div className="counter">
          <p>Correct: {correctCount} | Wrong: {wrongCount}</p>
        </div>

        {isGameOver ? (
          <div className="game-over">
            <h3>Game Over! 🎉</h3>
            <button onClick={restartGame} className="restart-button">
              Restart Game
            </button>
          </div>
        ) : (
          <div className="flashcard-container">
            <div>
              <h4>Questions</h4>
              <div className="flashcard-list">
                {shuffledQuestions
                  .filter((flashcard) => !matchedFlashcards.includes(flashcard.id)) // Exclude matched questions
                  .map((flashcard) => (
                    <div
                      key={flashcard.id}
                      onClick={() => selectQuestion(flashcard)}
                      className={`flashcards ${selectedQuestion === flashcard ? 'selected' : ''}`}
                    >
                      {flashcard.question}
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4>Answers</h4>
              <div className="answer-list">
                {shuffledAnswers
                  .filter((flashcard) => !matchedFlashcards.includes(flashcard.id)) // Exclude matched answers
                  .map((flashcard) => (
                    <div
                      key={flashcard.id}
                      onClick={() => selectAnswer(flashcard.answer)}
                      className={`answer ${selectedAnswer === flashcard.answer ? 'selected-answer' : ''}`}
                    >
                      {flashcard.answer}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {matchResult && (
          <div className={`match-result ${matchResult === 'Correct!' ? 'correct' : 'wrong'}`}>
            {matchResult}
          </div>
        )}
      </div>
    </>
  );
}

export default Game;



