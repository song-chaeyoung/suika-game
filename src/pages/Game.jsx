import React, { useRef, useEffect, useState, useContext } from "react";
import { Bodies, Engine, Render, Runner, World, Body, Events } from "matter-js";
import { ballImg } from "../util";
import "../styles/Game.css";
import { useNavigate } from "react-router-dom";
import { ScoreContext } from "../App";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const Game = () => {
  const [scores, setScores] = useState([]);
  const [scoreList, setScoreList] = useState(true);
  const [info, setInfo] = useState(true);
  const { score, setScore } = useContext(ScoreContext);
  const navigate = useNavigate();
  const gameBody = useRef(null);
  let engine, render, world, currentBody, currentBall, disableAction, interval;

  useEffect(() => {
    engine = Engine.create();
    render = Render.create({
      engine,
      element: gameBody.current,
      options: {
        wireframes: false,
        background: "#f7d8eece",
        width: 620,
        height: 850,
      },
    });

    world = engine.world;

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: { fillStyle: "#a18cd1" },
    });

    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#a18cd1" },
    });

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#a18cd1" },
    });

    const topLine = Bodies.rectangle(310, 150, 620, 4, {
      name: "topLine",
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#a18cd1" },
    });

    World.add(world, [ground, leftWall, rightWall, topLine]);

    // 게임 시작
    Render.run(render);
    Runner.run(Runner.create(), engine);

    // Ball 추가 함수
    const addBall = () => {
      const index = Math.floor(Math.random() * 4);
      const ball = ballImg[index];
      const scale = ball.radius / 200;

      const body = Bodies.circle(300, 50, ball.radius, {
        restitution: 0.3,
        isSleeping: true,
        render: {
          sprite: {
            texture: `/${ball.name}.png`,
            xScale: scale,
            yScale: scale,
          },
        },
      });

      body.index = index;
      currentBody = body;
      currentBall = ball;

      World.add(world, body);
    };

    addBall();

    // 키보드 이벤트 핸들러
    const keyDownHandler = (e) => {
      if (disableAction) return;

      switch (e.code) {
        case "KeyA":
          if (interval) return;
          interval = setInterval(() => {
            if (currentBody.position.x - currentBall.radius > 30)
              Body.setPosition(currentBody, {
                x: currentBody.position.x - 1,
                y: currentBody.position.y,
              });
          }, 5);
          break;
        case "KeyD":
          if (interval) return;
          interval = setInterval(() => {
            if (currentBody.position.x + currentBall.radius < 590)
              Body.setPosition(currentBody, {
                x: currentBody.position.x + 1,
                y: currentBody.position.y,
              });
          }, 5);
          break;
        case "KeyS":
          currentBody.isSleeping = false;
          disableAction = true;
          setTimeout(() => {
            addBall();
            disableAction = false;
          }, 1500);
          break;
      }
    };

    const keyUpHandler = (e) => {
      if (e.code === "KeyA" || e.code === "KeyD") {
        clearInterval(interval);
        interval = null;
      }
    };

    const collisionHandler = (event) => {
      event.pairs.forEach((collision) => {
        const { bodyA, bodyB } = collision;

        if (bodyA.index !== undefined && bodyA.index === bodyB.index) {
          const index = bodyA.index;

          if (index === ballImg.length - 1) return;

          World.remove(world, [bodyA, bodyB]);
          const newBall = ballImg[index + 1];
          const scale = newBall.radius / 200;

          const newBody = Bodies.circle(
            collision.collision.supports[0].x,
            collision.collision.supports[0].y,
            newBall.radius,
            {
              render: {
                sprite: {
                  texture: `/${newBall.name}.png`,
                  xScale: scale,
                  yScale: scale,
                },
              },
              index: index + 1,
            }
          );
          World.add(world, newBody);
          setScore((prevScore) => prevScore + (index + 1) * 10);
        }

        if (
          !disableAction &&
          (collision.bodyA.name === "topLine" ||
            collision.bodyB.name === "topLine")
        ) {
          disableAction = true;
          alert("Game Over");
          navigate("/result");
        }
      });
    };

    // 이벤트 리스너 추가
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    Events.on(engine, "collisionStart", collisionHandler);
    Events.on(engine, "collisionActive", collisionHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      Events.off(engine, "collisionStart", collisionHandler);
      Events.off(engine, "collisionActive", collisionHandler);
      Engine.clear(engine);
      Render.stop(render);
    };
  }, []);

  useEffect(() => {
    const scoresQuery = query(
      collection(db, "score"),
      orderBy("score", "desc"),
      limit(3)
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

  // console.log(scores);

  return (
    <section ref={gameBody} className="game_section">
      {info && (
        <div className="startInfo" onClick={() => setInfo(false)}>
          <h1>Infomation</h1>
          <h5>Use KeyA and KeyD to move to either side</h5>
          <div className="keyboard">
            <p>Key A</p>
            <p>Key D</p>
          </div>
          <h5>Use KeyS to drop objects</h5>
          <div className="keyboard">
            <p>Key S</p>
          </div>
          <h5>Press Start Info to start</h5>
          <h5>Click Here!</h5>
        </div>
      )}
      <div className="game_score">
        <h5>Score List</h5>
        {scores.map((score, idx) => (
          <div className="scoreList_item">
            <span>{idx + 1}등</span>
            <span>{score.name}</span>
            <span>{score.score}점</span>
          </div>
        ))}
        <h1>Score</h1>
        <h1>{score}</h1>
      </div>
    </section>
  );
};

export default Game;
