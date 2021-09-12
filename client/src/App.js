import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./home";
import ChatRoom from "./chatRoom";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/:roomName" component={ChatRoom} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
