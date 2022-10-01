import projectBlueGame from './ProjectBlueGame';
import BootScene from './scenes/BootScene';

const scene = projectBlueGame.scene.keys.Boot as BootScene;
function App() {
  return <div className="App" onLoad={()=>scene.create()}></div>;
}

export default App;
