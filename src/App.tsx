import projectBlueGame from './ProjectBlueGame';
import BootScene from './scenes/BootScene';

const scene = projectBlueGame.scene.keys.Boot as BootScene;

const create = () => {
  scene.create();
};

function App() {
  return <div id="phaser-container" className="App" onLoad={create}></div>;
}

export default App;
