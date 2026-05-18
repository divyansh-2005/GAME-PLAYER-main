import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ToppicGameSection = () => {
  const [games, setGames] = useState([
    {
      name: "Car Rash",
      description: "Dodge traffic at breakneck speeds down a high-octane neon cyberpunk highway. Survive the heat!",
      link: "/car-rash",
    },
    {
      name: "Realm Rush",
      description: "Save Your Gold Enventory with fight with Enemy.",
      link: "/realmrush",
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
      name: "Flappy Bird",

      description:
        "Navigate the bird through pipes and test your reflexes in this classic Flappy Bird game!",
      link: "/flappybird",
    },
    {
      name: "Sudoku",
      description:
        "Challenge your mind with Sudoku - the ultimate logic puzzle that’s fun, addictive, and endlessly satisfying!",
      link: "/sudoku",
    },
    {
      name: "Aim Shooter",
      description:
        "This game offers an enjoyable experience where players can enhance their shooting skills.",
      link: "/aimshooter",
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
      name: "PianoTiles",
      description:
        "Piano Tiles is a fast-paced mobile game where players tap black tiles while avoiding white ones to simulate playing piano music.",
      link: "/pianotiles",
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
        <h1>Top Picks Games</h1>
        <br />
        
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

export default ToppicGameSection
