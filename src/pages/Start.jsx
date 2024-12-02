import React, { useState } from "react";
import "../styles/Start.css";
import { Link } from "react-router-dom";
import { updateRelease } from "../util";

const Start = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="start_section">
      <h1>
        play <br /> game
      </h1>
      <Link to={"game"}>
        <p>press start! </p>
      </Link>
      <button onClick={() => setShowInfo(!showInfo)}>
        버전 {updateRelease[0].version}
      </button>
      {showInfo && (
        <div className="update_info">
          <p>업데이트 내역</p>
          <div className="xmark" onClick={() => setShowInfo(false)}>
            X
          </div>
          {updateRelease.map((it) => (
            <div className="update_item" key={it.id}>
              <p>날짜 : {it.date}</p>
              <p>버전 : {it.version}</p>
              <p>변경사항 : {it.info}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Start;
