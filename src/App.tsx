import { IonPhaser } from '@ion-phaser/react';
import { phaser } from './ProjectBlueGame';

function App() {
  // user will use right click in-game.
  window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
  }, false);
  return (
    <div id="phaser-container" className="App">
      <IonPhaser game={phaser.game} initialize={phaser.initialize} />
    </div>
  );
}

export default App;
