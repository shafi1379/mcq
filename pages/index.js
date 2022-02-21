import * as React from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [datas, setDatas] = React.useState();
  const [page, setPage] = React.useState(0);
  const [disableNext, setDisableNext] = React.useState(true);
  const [correct, setCorrect] = React.useState(false);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    const initLoad = async () => {
      const res = await fetch(`https://opentdb.com/api.php?amount=10`);
      const data = await res.json();
      setDatas(data.results);
    };
    initLoad();
  }, []);

  const handlePrev = () => {
    if (page >= 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page <= 9) {
      setPage(page + 1);
      setDisableNext(true);
    if (correct === true) {
      setScore(score + 10);
    } else {
      setScore(score - 5);
    }
    }
  };

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  const generateChoices = (data) => {
    let choices = [...data.incorrect_answers];
    choices.push(data.correct_answer);
    choices = shuffle(choices);
    if (data.type === "boolean") {
      return (
        <>
          {choices.map((choice) => (
            <button onClick={() => handleChoiceSelection(data, choice)} style={{ margin: 10 }}>{choice}</button>
          ))}
        </>
      );
    } else if (data.type === "multiple") {
      return (
        <>
          {choices.map((choice) => (
            <button onClick={() => handleChoiceSelection(data, choice)} style={{ margin: 10 }}>{choice}</button>
          ))}
        </>
      );
    }
  };

  function handleChoiceSelection(data, slected) {
    setDisableNext(false);
    if (data.correct_answer === slected) {
      setCorrect(true)
    } else {
      setCorrect(false);
    }
  }

  return (
    <div>
      <div>Total score:- {score}</div>
      <button onClick={handlePrev}>Prev</button>
      <button disabled={disableNext} onClick={handleNext}>Next</button>
      <div>
        {datas?.slice(page, page + 1).map((data) => (
          <>
            <div>
              {page + 1}. {data.question}
            </div>
            {generateChoices(data)}
          </>
        ))}
      </div>
    </div>
  );
}

// export async function getServerSideProps() {
//   // Fetch data from external API
//   debugger;

//   debugger;
//   // Pass data to the page via props
//   return { props: { data } }
// }
