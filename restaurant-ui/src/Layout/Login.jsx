import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import "./button.css";

export const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState();
const [sessionId, setSessionId] = useState(Math.random().toString().substring(7));
  const handleLogin = () => {
  if (username == undefined) {
     alert("Please enter the name");
    }
    else {
    history.push({
      pathname: `/chat/${sessionId}`,
      state: {searchCriteria: 'loggedIn', userName : username},
    });
    }
  };

  return (
    <div
      className=" d-flex align-items-center justify-content-center"
      style={{
        height: "100vh",
        backgroundImage: `url("https://picsum.photos/1536/735?grayscale")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="container form-group w-25  d-flex align-items-center justify-content-center gap-2"
      style={{
              height: "30vh",
              backgroundImage: `url("https://picsum.photos/1536/735?grayscale")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
      >
      <table>
<tbody>

      <tr>
      <td  style={{
                      fontSize :22,
                      color : '#e83f3f'
                      }}> <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to Restaurant Finder</b></td>
      </tr>
      <tr>
            <td  style={{
                             fontSize :18,
                                                  color : '#809e08'
                            }}> <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start your session</b></td>
            </tr>
      <tr>
      <td>
      <input
                type="text"
                name=""
                id=""
                className="rounded-3 form-control"
                placeholder="Name"
                onChange={(e) => setUsername(e.target.value)}
                onKeyUp={(e) => {
                  console.log(e.key);
                  if (e.key == "Enter" || e.key == 13) handleLogin();
                }}
              />
              <button type="button" value={"Connect"} onClick={handleLogin}>
                <span>Connect</span>
              </button>
      </td>
      </tr>
      </tbody>
      </table>
        

      </div>
    </div>
  );
};
