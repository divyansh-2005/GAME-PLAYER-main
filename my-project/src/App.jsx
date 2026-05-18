import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import FlipGame from "./Games/FlipCard/FlipCard";
import SnakeGame from "./Games/SnakeGame/SnakeGame";
import GTH from "./Games/GuessTheColor/GTH";
import PongGame from "./Games/PingPongGame/PongGame";
import EmojiIntruderHunt from "./Games/EmojiIntruder/EmojiIntruder";
import RockPaperScissors from "./Games/RockPaper Scissors/Game";
import GameSection from "./Components/GameSection";
import Dashboard from "./Components/Dashboard";
import AddGamePage from "./Components/AddGamePage";
import { useTma } from "./Context/tmaProvider";
import Games from "./Components/Games";
import AboutPage from "./Components/AboutPage";
import ContactPage from "./Components/ContactPage";
import Contributors from "./Components/Contributors";
import Game from "./Games/ReactionTime/Game";
import SimonSays from "./Games/SimonSays/SimonSays";
import EndlessRunner from "./Games/EndlessRunner/EndlessRunner";
import WordGuessingGame from "./Games/WordGuessingGame/WordGuessingGame"; // Adjust the path as needed
import DiceRoller from "./Games/Dice_rolling_simulator/Dice";
import RocketBoost from "./Games/RocketBoost/RocketBoost";
import ChessGame from "./Games/ChessGame/ChessGame";
import FlappyBird from "./Games/FlappyBirdGame/FlappyBird";
import ArkanoidGame from "./Games/Arkanoid/ArkanoidGame";
import WhackAMole from "./Games/WhackAMole/WhackAMole";
import SudokuGame from "./Games/SudokuGame/src/SudokuGame";
import LightsOut from "./Games/LightsOut/LightsOut";
import ColorMemoGame from "./Games/Color-memoGame/ColorMemoGame";
import AimShooterGame from "./Games/Aim-Shooter-Game/AimShooterGame";
import CandyCrushGame from "./Games/Candy-crush-saga/src/CandyCrushGame";
import DiceGameTenzi from "./Games/Dice-Game-Tenzi/src/DiceGameTenzi";
import MathQuiz from "./Games/Math-quiz/MathQuiz";
import StackTowerGame from "./Games/Stack-tower-game/src/StackTowerGame";
import TetrisGame from "./Games/3D-Tetris-Game/src/TetrisGame";
import SlotMachineGame from "./Games/Slot-Machine-Game/src/SlotMachineGame";
import WriteTypingGame from "./Games/Write-Typing-Game/src/WriteTypingGame";
import ClickSpeedTest from "./Games/Click-speed-test/ClickSpeedTest";
import TowerOfHanoi from "./Games/TowerOfHanoi/TowerOfHanoi";
import DuckHunt from "./Games/DuckHunt/DuckHunt";
import ConnectFour from "./Games/ConnectFour/ConnectFour";
import AnimatedCursor from "react-animated-cursor";
import RealmRush from "./Games/RealmRush/RealmRush";
import Crossword from "./Games/Crossword/Crossword";
import PianoTiles from "./Games/pianogame/PianoTiles";
import TileConquest from "./Games/Tile Conquest/TileConquest";
import Othello from "./Games/Othello/Othello";
import Toppicks from "./Components/Toppicks";
import AargonAssualt from "./Games/AargonAssualt/AargonAssualt";


import Obstacle3D from "./Games/Obstacle3D/Obstacle3D";
import RollingBall from "./Games/RollingBall/RollingBall";
import CarRashGame from "./Games/CarRashGame/CarRashGame";

const App = () => {
  const { user, isLoading, isError } = useTma();
  return (
    <>
      <AnimatedCursor
        innerSize={8}
        outerSize={18}
        color="245, 4, 20" // RGB equivalent of #f50414
        outerAlpha={0.5}
        innerScale={0.7}
        outerScale={5}
        clickables={[
          "a",
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          "label[for]",
          "select",
          "textarea",
          "button",
          ".link",
          {
            target: ".custom",
            options: {
              innerSize: 12,
              outerSize: 26,
              color: "255, 255, 255",
              outerAlpha: 0.3,
              innerScale: 0.7,
              outerScale: 8,
            },
          },
        ]}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reaction" element={<Game />}></Route>
        <Route path="/games" element={<Games />} />
        <Route path="/flipcard" element={<FlipGame />} />
        <Route path="/snakegame" element={<SnakeGame />} />
        <Route path="/gth" element={<GTH />} />
        <Route path="/emojiintruder" element={<EmojiIntruderHunt />} />
        <Route path="/rckpapsc" element={<RockPaperScissors />} />
        <Route path="/PingPong" element={<PongGame />} />
        <Route path="/simon-says" element={<SimonSays />} />
        <Route path="/rocketboost" element={<RocketBoost />} />
        <Route path="/word-guessing-game" element={<WordGuessingGame />} />{" "}
        {/* Add the new route here */}
        <Route path="/endless-runner" element={<EndlessRunner />} />
        <Route path="/dice-roller" element={<DiceRoller />} />{" "}
        {/* Add the new route here */}
        <Route path="/flappybird" element={<FlappyBird />} />
        <Route path="/pianotiles" element={<PianoTiles />} />
        <Route path="/arkanoid" element={<ArkanoidGame />} />
        <Route path="/duckhunt" element={<DuckHunt />} />
        <Route path="/addgame" element={<AddGamePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contributors" element={<Contributors />} />
        <Route path="/chessgame" element={<ChessGame />} />
        <Route path="/whack-a-mole" element={<WhackAMole />} />
        <Route path="/sudoku" element={<SudokuGame />} />
        <Route path="/candycrush" element={<CandyCrushGame />} />
        <Route path="/LightsOut" element={<LightsOut />} />
        <Route path="/colormemo" element={<ColorMemoGame />} />
        <Route path="/aimshooter" element={<AimShooterGame />} />
        <Route path="/candycrush" element={<CandyCrushGame />} />
        <Route path="/dicegame" element={<DiceGameTenzi />} />
        <Route path="/math-quiz" element={<MathQuiz />} />
        <Route path="/stacktowergame" element={<StackTowerGame />} />
        <Route path="/click-speed-test" element={<ClickSpeedTest />} />
        <Route path="/tetrisgame" element={<TetrisGame />} />
        <Route path="/slot-machine-game" element={<SlotMachineGame />} />
        <Route path="/typing-game" element={<WriteTypingGame />} />
        <Route path="/towerofhanoi" element={<TowerOfHanoi />} />
        <Route path="/realmrush" element={<RealmRush />} />
        <Route path="/connectFour" element={<ConnectFour />} />
        <Route path="/crossword" element={<Crossword />} />
        <Route path="/tileConquest" element={<TileConquest />} />
        <Route path="/othello" element={<Othello />} />
        <Route path="/toppicks" element={<Toppicks />} />
        <Route path="/aargon-assualt" element={<AargonAssualt />} />
        <Route path="/obstacle3D" element={<Obstacle3D />} />
        <Route path="/rollingBall" element={<RollingBall />} />
        <Route path="/car-rash" element={<CarRashGame />} />
      </Routes>
    </>
  );
};

export default App;
