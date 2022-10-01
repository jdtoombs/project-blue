import projectBlueGame from './ProjectBlueGame';
import InitialScene from './scenes/InitialScene';

const scene = projectBlueGame.scene.keys.Initial as InitialScene;
function App() {
  return <div className="App" onLoad={()=>scene.create()}></div>;
}

export default App;
