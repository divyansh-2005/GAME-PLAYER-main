import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GameSection = () => {
  const [games, setGames] = useState([
    {
      name: "Car Rash",
      description:
        "Dodge traffic at breakneck speeds down a high-octane neon cyberpunk highway. How long can you survive the heat of Car Rash?",
      link: "/car-rash",
    },
    {
      name: "Guess the Hex",
      description:
        "Put your color-matching skills to the test! Match the Hex code to its perfect color card and become the ultimate shade master!",
      link: "/gth",
    },
    {
      name: "Flip Card Game",
      description:
        "Challenge your memory in this flip card game! Flip two cards at a time, and see if you can find the matching pair.",
      link: "/flipcard",
    },
    {
      name: "Snake Game",
      description:
        "Guide the hungry snake with the arrow keys in a race to gobble up as many boxes as you can! Each box boosts your score—how many can you collect without letting the snake crash?",
      link: "/snakegame",
    },
    {
      name: "Emoji Intruder",
      description:
        "Test your observation skills in this emoji intruder game! Spot the one sneaky, different emoji hiding among a sea of identical faces.",
      link: "/emojiintruder",
    },
    {
      name: "Rock Paper Scissors",
      description:
        "Challenge the computer in the classic game of Rock, Paper, Scissors! Make your move and see if you can outsmart the machine.",
      link: "/rckpapsc",
    },
    {
      name: "Ping Pong Game",
      description: "Challenge your reflexes in this fast-paced ping pong game!",
      link: "/pingpong",
    },
    {
      name: "Reaction Time",
      description:
        "The Reaction Time Checker game challenges players to test their reflexes by clicking a button",
      link: "/reaction",
    },
    {
      name: "Simon Says",
      description:
        "Test your memory in the classic Simon Says game! Repeat the sequence of colors as it gets progressively harder. Can you keep up?",
      link: "/simon-says",
    },
    {
      name: "Hangman",
      description:
        "Challenge your vocabulary in this exciting word guessing game! Guess letters or the whole word based on clues provided.",
      link: "/word-guessing-game",
    },
    {
      name: "Chess Game",
      description: "Play a classic game of Chess against friend!",
      link: "/chessgame",
    },
    {
      name: "Rocket Boost",
      description: "Challenge to Controll rocket with speed boost!",
      link: "/rocketboost",
    },
    {
      name: "endless Runner",
      description:
        " This is a fun, simple game where you control a chicken navigating through obstacles. The game ends when the chicken collides with an obstacle. ",
      link: "/endless-runner",
    },
    {
      name: "Dice Roller",
      description:
        "The simulator mimics the action of rolling a dice, providing a random outcome between 1 and 6 each time the user interacts with the interface",
      link: "/dice-roller",
    },

    {
      name: "Flappy Bird",

      description:
        "Navigate the bird through pipes and test your reflexes in this classic Flappy Bird game!",
      link: "/flappybird",
    },

    {
      name: "Arkanoid",
      description:
        "The player is tasked with clearing a formation of colorful blocks by deflecting a ball towards it without letting the ball leave the bottom edge of the playfield.",
      link: "/arkanoid",
    },
    {
      name: "Whack A Mole",
      description:
        "This game provides the fun and fast-paced action of clicking moles as they pop up, with clear instructions and smooth interactions.",
      link: "/whack-a-mole",
    },
    {
      name: "Lights Out Game",
      description:
        "Dive into the challenging world of LightsOut, where strategy meets puzzle-solving! Your objective is to turn off all the lights on the grid by clicking on them.",
      link: "/LightsOut",
    },

    {
      name: "Sudoku",
      description:
        "Challenge your mind with Sudoku - the ultimate logic puzzle that’s fun, addictive, and endlessly satisfying!",
      link: "/sudoku",
    },
    {
      name: "Color Memo",
      description:
        "The Memory Game with Colors challenges players to remember and match sequences of colors, improving their focus and memory skills through engaging gameplay.",
      link: "/colormemo",
    },
    {
      name: "Aim Shooter",
      description:
        "This game offers an enjoyable experience where players can enhance their shooting skills.",
      link: "/aimshooter",
    },
    {
      name: "Candy Crush Saga",
      description:
        "Candy Crush Saga is a popular match-three puzzle game where players swap colorful candies to create matches, clear levels, and earn points.",
      link: "/candycrush",
    },

    {
      name: "Dice Game Tenzi",
      description:
        "Roll, match, and race to victory in the fast-paced, addictive fun of Tenzi—can you be the first to roll all ten dice the same?",
      link: "/dicegame",
    },
    {
      name: "Math Quiz",
      description:
        "Math Quiz game with a broader range of math questions including addition, subtraction, multiplication, division, and even questions with powers (exponentiation) and modulus operations.",
      link: "/math-quiz",
    },
    {
      name: "Stack Tower 3D",
      description:
        "Build the tallest tower you can in Stack Tower 3D—precision and timing are the keys to victory!",
      link: "/stacktowergame",
    },
    {
      name: "DuckHunt",
      description:
        "The main goal is to shoot as many ducks as possible before they disappear. Players have a limited number of misses; missing three ducks results in game over",
      link: "/duckhunt",
    },
    {
      name: "Tower of Hanoi",
      description:
        "The Tower of Hanoi is a classic puzzle game that challenges players to move a stack of disks from one rod to another, following specific rules.",
      link: "/towerofhanoi",
    },
    {
      name: "Connect Four ",
      description:
        "The Tower of Hanoi is a classic puzzle game that challenges players to move a stack of disks from one rod to another, following specific rules.",
      link: "/connectFour",
    },
    {
      name: "Click speed test",
      description:
        "The player has 10 seconds to click as many times as possible. The game tracks the number of clicks, displays the countdown timer, and shows the final score when the time is up. Players can restart the game to try again.",
      link: "click-speed-test",
    },
    {
      name: "Slot Machine",
      description:
        "A slot machine game where players spin reels to match symbols and win coins or rewards.",
      link: "/slot-machine-game",
    },
    {
      name: "3D Tetris",
      description:
        "A 3D Tetris game where players manipulate falling blocks to fit them into a three-dimensional grid.",
      link: "/tetrisgame",
    },
    {
      name: "Write Typing Game",
      description:
        "Challenge yourself to improve your typing skills and speed in this engaging game where every word matters!",
      link: "/typing-game",
    },
    {
      name: "Realm Rush",
      description: "Save Your Gold Enventory with fight with Enemy.",
      link: "/realmrush",
    },
    {
      name: "Crossword",
      description:
        "Crossword is a word puzzle game where players fill a grid with words using clues for each word. The goal is to complete the grid by solving all the clues, testing vocabulary, knowledge, and problem-solving skills.",
      link: "/crossword",
    },
    {
      name: "PianoTiles",
      description:
        "Piano Tiles is a fast-paced mobile game where players tap black tiles while avoiding white ones to simulate playing piano music.",
      link: "/pianotiles",
    },
    {
      name: "Tile Conquest",
      description:
        "Capture tiles with higher values to outscore your opponent and control the board.",
      link: "/tileConquest",
    },
    {
      name: "Aargon Assualt",
      description: "Challenge to Fight with enemy aircraft .",
      link: "/aargon-assualt",
    },
    {
      name: "Othello",
      description:
        "Othello is a strategy game where players flip their opponent's pieces on an 8x8 grid to control the board.",
      link: "/othello",
    },
    {
      name: "Obstacle 3D",
      description:
        "Dive into the obstacle and stay in live world",
      link: "/obstacle3D",
    },{
      name: "Rolling Ball",
      description:
        "Challenge to balance the ball.",
      link: "/rollingBall",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm)
  );

  const navigate = useNavigate();

  const handleNavigate = (link) => {
    navigate(link); // Navigate directly to the game's route
  };

  return (
    <div className="container" id="games">
      <div id="searchBar">
        <h1>Search Games</h1>
        <br />
        <div className="search-input-container">
          <input
            className="text-gray-800"
            type="text"
            id="gameSearch"
            placeholder="Enter Game Name"
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredGames.length > 0 ? (
        filteredGames.map((game, index) => (
          <div className="box" key={index}>
            <div className="content">
              <h2>{game.name}</h2>
              <h3>{game.description}</h3>
              <div className="card-footer">
                <button onClick={() => handleNavigate(game.link)}>PLAY</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div id="noResults">No results found</div>
      )}
    </div>
  );
};

export default GameSection;
