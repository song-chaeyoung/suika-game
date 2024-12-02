import React, { useContext, useState } from "react";
import "../styles/Result.css";
import { ScoreContext } from "../App";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import ScoreList from "../components/ScoreList";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const { score, setScore } = useContext(ScoreContext);
  const [name, setName] = useState("");
  const [scoreList, setScoreList] = useState(false);
  const navigate = useNavigate();

  const scoreSubmit = async (e) => {
    e.preventDefault();
    // console.log("scoreSubmit");
    if (name === "") {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      await addDoc(collection(db, "score"), {
        name,
        score,
        createdAt: Date.now(),
      });

      setScoreList(true);
    } catch (err) {
      console.log(err);
    }

    setScore(0);
  };

  return (
    <section className="result_section">
      <h1>GameOver</h1>
      <div>
        <p>Score : {score}</p>
        <form>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button type="submit" onClick={scoreSubmit}>
            저장하기
          </button>
        </form>
      </div>
      <button
        onClick={() => {
          navigate("/");
          setScore(0);
        }}
        className="return_btn"
      >
        다시 게임하기
      </button>
      {scoreList && <ScoreList />}
    </section>
  );
};

export default Result;
