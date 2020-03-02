import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Offline, Online } from "react-detect-offline";
import Health from './Health';
import Detail from './Detail';

function App() {
  return (
    <div>
      <Online>
        <Switch>
          <Route exact path='/' component={Health}/>
          <Route path='/detail/:id' component={Detail}/>
        </Switch>
      </Online>
      <Offline>
        <p>Internet connection lost :(</p>
      </Offline>
    </div>
  );
}

export default App;