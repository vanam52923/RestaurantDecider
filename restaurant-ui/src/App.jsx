import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,useParams
} from "react-router-dom";
import { Login } from "./Layout/Login";
import { RestaurantPage } from "./Layout/RestaurantPage";
function App() {

  const history = useHistory();

/*   if (localStorage.getItem("chat-username")) {
    history.push("/chat");
  } else history.push("/login");
  */

  return (
    <Router>
      <Switch>
        <Route exact path={"/"}>
          <Redirect to={"/login"}></Redirect>
        </Route>
        <Route path={"/login"}>
          <Login></Login>
        </Route>
        <Route path="/chat/:sessionId" component = {RestaurantPage}>
                </Route>
      </Switch>
    </Router>
  );
}

export default App;
