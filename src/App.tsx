import { IonPhaser } from '@ion-phaser/react';
import { phaser } from './ProjectBlueGame';

function App() {
  return (
    <div id="phaser-container" className="App">
      <IonPhaser game={phaser.game} initialize={phaser.initialize} />
    </div>
  );
}

export default App;
