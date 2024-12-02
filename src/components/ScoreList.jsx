import React, { useEffect, useState } from "react";
import "../styles/ScoreList.css";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const ScoreList = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const scoresQuery = query(
      collection(db, "score"),
      orderBy("score", "desc")
    );
    const unsubscribe = onSnapshot(scoresQuery, (snapshot) => {
      const scores = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setScores(scores);
    });
    return () => unsubscribe();
  }, []);

  console.log(scores);

  return (
    <div className="score_list">
      <h2> ScoreList</h2>
      <div className="score_list_container">
        {scores.map((it, idx) => (
          <div key={idx} className="score_item">
            <p>{idx + 1}등</p>
            <p>{it.name}</p>
            <p>{it.score}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/")} className="return_btn">
        다시 게임하기
      </button>
    </div>
  );
};

export default ScoreList;
