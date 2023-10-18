import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { over } from "stompjs";
import Cookies from 'js-cookie'
var stompClient = null;

export const RestaurantPage = () => {
  const history = useHistory();
  const [username, setUserName] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [restname, setRestName] = useState("");
  const [restloc, setRestLoc] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [publicChats, setPublicChats] = useState([]);
  const location = useLocation();
  const {sessionId} =useParams();
  
  const [currSession, setCurrSession] = useState(sessionId);
  const [addedRestaurant, setAddedRestaurant] = useState([]);
  const [randomRestaurant, setRandomRestaurant] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(location.state? location.state.searchCriteria : null);
  const [loggedInUserName, setLoggedInUserName] = useState(location.state? location.state.userName : '');
  
  
  
  
  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log(payloadData);
    if(payloadData.sessionId==="400"){
         alert(payloadData.message + ". Create new session or join some other session. Logging out.");
         handleLogout();
         }

    switch (payloadData.status) {
      case "JOIN":
         publicChats.push(payloadData);
         setPublicChats((prev) => [...prev, payloadData]);
        break;
      case "LEAVE":
       publicChats.push(payloadData);
       setPublicChats((prev) => [...prev, payloadData]);
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats((prev) => [...prev, payloadData]);
    }
  };


const onRestaurantAdd = (payload) => {
    const payloadData = JSON.parse(payload.body);
  if(payloadData.sessionId==="400"){
  alert(payloadData.name + ". Create new session or join some other session. Logging out.");
  handleLogout();
  }
  else {
   setAddedRestaurant((prev) => [...prev, payloadData]);
  }
  };


const onRandomRestaurant = (payload) => {
    const payloadData = JSON.parse(payload.body);
   if(payloadData.sessionId==="400"){
     alert(payloadData.name + ". Create new session or join some other session. Logging out.");
     handleLogout();
     }
     else {
     setRandomRestaurant((prev) => [...prev, payloadData]);
     }
  };


  const onConnect = () => {
    console.log("Connected");
   userJoin();
  };
  
  const onError = (err) => {
    console.log("err=>", err);
  };
  
  const handleLogout = () => {
    userLeft();
    history.push("/login");
  };

    const handleCopyLink = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(
          function () {
            alert("URL copied to clipboard");
          },
          function (err) {
            console.error("Could not copy URL: ", err);
          }
        );
      };


  const userJoin = () => {
    let chatMessage = {
      senderName: loggedInUserName,
      status: "JOIN",
      message: loggedInUserName + " joined",
      sessionId: currSession,
      loggedIn : loggedInUser
    };
    stompClient.subscribe(`/restaurant/add/public/${currSession}`, onRestaurantAdd);
    stompClient.subscribe(`/restaurant/pick/public/${currSession}`, onRandomRestaurant);
    stompClient.subscribe(`/chatroom/public/${currSession}`, onMessageReceived);

    stompClient.send(`/app/message/${currSession}`, {}, JSON.stringify(chatMessage));   
  };
  
  
  const userLeft = () => {
    let chatMessage = {
      senderName: loggedInUserName,
      status: "LEAVE",
      message: loggedInUserName + " left"

    };

    stompClient.send(`/app/message/${currSession}`, {}, JSON.stringify(chatMessage));
  };

  const connect = () => {
    let sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(sock);
    stompClient.connect({}, onConnect, onError);
  };


 const fetchSessionRestaurants = () => {
 let url = 'http://localhost:8080/getAll/' + currSession;
 fetch(url).then(
      (value) => {
        if (!value.ok) {
          return undefined;
        }

        return value.json().then((result) => {
           setAddedRestaurant(result);
        });
      },
      (e) => {
        console.error(e);
        return undefined;
      }
    );
  };

    
   
  useEffect(() => {
  if(!loggedInUser) {
  const enteredName = prompt('Please enter your name');
   setLoggedInUserName(enteredName);
  }

  }, [loggedInUser]);
  
  
    
   useEffect(() => {
     setAddedRestaurant([]);
     setPublicChats([]);
     setMessage("");
    connect();
  }, [loggedInUserName]); 
  

  
    useEffect(() => {
      fetchSessionRestaurants();
    }, []); 


  const sendMessage = () => {
      if (message.trim().length > 0 ) {
      stompClient.send(
         `/app/message/${currSession}`, 
        {},
        JSON.stringify({
          senderName: loggedInUserName,
          status: "MESSAGE",
          message:  message,
          sessionId: currSession,
          loggedIn : loggedInUser
        })
      );
      setMessage("");
    }
  };

  
  const handleSubmitRestaurant = () => {

      stompClient.send(
         `/app/restaurant/add/${currSession}`, 
        {},
        JSON.stringify({
          name: restname,
          location: restloc,
          cuisine: cuisine,
          sessionId: currSession,
          loggedIn : loggedInUser
        })
      );
      
      setRestName('');
      setRestLoc('');
      setCuisine('');
    };


const handleRandomRestaurant = () => {
  
      stompClient.send(
         `/app/restaurant/pick/${currSession}`, 
        {},
        JSON.stringify({
          sessionId: currSession
        })
      );
    };

  return (
  <div>
  
    <div
      className="d-flex justify-content-center align-items-center "
      style={{
        height: "80vh",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://picsum.photos/1536/735?grayscale")`,
        backgroundRepeat: "none",
        backgroundSize: "cover",
      }}
    >
      <div className="container d-flex p-0">
      <div className="d-flex flex-column" 
           style={{   height: "500px",
           flexGrow: 1,
           backgroundColor: "#f1f2e9",
           padding: "2px",
           border: "px solid green",
           display: "flex",
           flexDirection: "column",
           gap: "2px", }}>
           <span className="text-center text-uppercase text-dark" style ={{backgroundColor: "#f1f2e9"}}><b>Discuss venue </b> </span>

          <div
            className="chat-messages p-3"
            style={{
              height: "500px",
              flexGrow: 1,
              backgroundColor: "#d3d3c5",
              overflowY: "scroll",
              padding: "2px",
              border: "1px solid green",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
          
         { publicChats.map((message, index) => {
                  if (message.senderName != username) {
                    return (
                      <div className="d-flex justify-content-start" key={index}>
                        <div
                          className=" d-flex p-2 "
                          style={{
                            borderTopRightRadius: "5px",
                            borderBottomRightRadius: "5px",
                            borderTopLeftRadius: "5px",
                            backgroundColor: "white",
                          }}
                        >
                          <div className=" rounded-3 px-2 me-2 align-self-start">
                            <div className="bg-warning">
                              {message.senderName}
                            </div>
                            <div>
                              <div>{message.message}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="d-flex justify-content-end " key={index}>
                        <div
                          className=" bg-primary p-2"
                          style={{
                            borderTopRightRadius: "5px",
                            borderTopLeftRadius: "5px",
                            borderBottomLeftRadius: "5px",
                          }}
                        >
                          <div className="text-white">{message.message}</div>
                        </div>
                      </div>
                    );
                  }
                })
                
                }
          </div>
          {/*message box */}
          <div className="form-control d-flex">
            <input
              className="px-2 py-2"
              type="text"
              placeholder="Message"
              value={message}
              onKeyUp={(e) => {
                console.log(e.key);
                if (e.key == "Enter" || e.key == 13) {
                  sendMessage() ;
                }
              }}
              style={{
                flexGrow: 1,
                borderRight: "10px",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                
              }}
              onChange={(e) => setMessage(e.target.value)}
            />

            <input
              type="button"
              className="btn btn-dark text-light"
              value={"Send"}
             onClick={sendMessage}
              style={{ marginLeft: "10px" }}
            />
            
              {loggedInUser && <input
                                      type="button"
                                      className="btn btn-dark text-light"
                                      value={"Get Joining Link"}
                                      onClick={handleCopyLink}
                                      style={{ marginLeft: "10px" }}
                                    />    
                                    }  
                                    
            <input
              type="button"
              className="btn btn-dark text-light"
              value={"Logout"}
              onClick={handleLogout}
              style={{ marginLeft: "10px" }}
            />       
            
                   
          </div>
        </div>
        
        
       
     {/*   Start parallel div */}
                      <div className="d-flex flex-column" 
                       style={{   height: "500px",
                       flexGrow: 1,
                       backgroundColor: "#f1f2e9",
                       padding: "2px",
                       border: "px solid green",
                       display: "flex",
                       flexDirection: "column",
                       gap: "2px", }}>
                       <span className="text-center text-uppercase text-dark" style ={{backgroundColor: "#f1f2e9"}}><b>Add Restaurant of your choice</b> </span>
                                                                                 

                      <div
                        className="chat-messages p-3"
                        style={{
                          height: "550px",
                          flexGrow: 1,
                          backgroundColor: "#d3d3c5",
                          overflowY: "scroll",
                          padding: "2px",
                          border: "1px solid green",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                              
               <form>
                                  <label>Restaurant Name &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                                  <br></br>
                                    <input
                                      type="text" 
                                      value={restname}
                                      onChange={(e) => setRestName(e.target.value)}
                                    />
                                  </label>
                                  <br></br>
                            <label>Restaurant Location &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                            <br></br>
                                                 <input
                                                   type="text" 
                                                   value={restloc}
                                                   onChange={(e) => setRestLoc(e.target.value)}
                                                 />
                                               </label>
                                                 <br></br>
                            <label>Cuisine Type  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; 
                            <br></br>
                                                              <input
                                                                type="text" 
                                                                value={cuisine}
                                                                onChange={(e) => setCuisine(e.target.value)}
                                                              />
                                                            </label>
                                                            
                         
                             <span>

                             <br></br>
<br></br>
                              <input
                                                        type="button"
                                                        className="btn btn-dark text-light"
                                                        value={"Submit Restuarant"}
                                                        onClick={handleSubmitRestaurant}
                                                        style={{ marginLeft: "10px" }}
                                                      />
                                                      </span>
                                                      </form>
                                                      </div>


 <div className="d-flex flex-column" 
                       style={{   height: "200px",
                       flexGrow: 1,
                       backgroundColor: "#f1f2e9",
                       padding: "2px",
                       border: "px solid green",
                       display: "flex",
                       flexDirection: "column",
                       gap: "2px", }}>
                       <span className="text-center text-uppercase text-dark" style ={{backgroundColor: "#f1f2e9"}}><b>Chosen restaurants</b> </span>
                        
                         <div
                                                className="chat-messages p-3"
                                                style={{
                                                  height: "800px",
                                                  flexGrow: 1,
                                                  backgroundColor: "#d3d3c5",
                                                  overflowY: "scroll",
                                                  padding: "2px",
                                                  border: "1px solid green",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: "2px",
                                                }}
                                              >
                                   {  addedRestaurant.map((message, index) => (
                                                                               
                                                                               <div key = {index}>
                                                                               <table>
                                                                               <tbody>
                                                                               <tr  style={{
                                                                                                                                     height: "12px",
                                                                                                                                     backgroundColor: "#e8e8e1",
                                                                                                                                     padding: "8px",
                                                                                                                                     border: "1px solid green",
                                                                                                                                     gap: "2px",
                                                                                                                                   }}>
                                                                                                                                  
                                                                              Restaurant {message.name} serving {message.cuisine} cuisine at {message.location}
                                                                              </tr>
                                 
                                                                              </tbody>
                                                                             
                                                                              </table>
                                                                               </div>             
                                                                               ))} 
                                                                               </div>
                                                                               </div>
          
          <div>
   
          </div>
               </div>

      </div>
<div>
    </div>
    </div>
    
    <div className="d-flex flex-column" 
                                         style={{   height: "70px",
                                         flexGrow: 1,
                                         backgroundColor: "#f1f2e9",
                                         padding: "50px",
                                         border: "px solid green",
                                         display: "flex",
                                         flexDirection: "column",
                                         gap: "2px", }}>

                                
                                
                                
                                {loggedInUser &&(
                                <input
                                                          type="button"
                                                          className="btn btn-dark text-light"
                                                          value={"Pick Restaurant and End Session"}
                                                          onClick={handleRandomRestaurant}
                                                          style={{ marginLeft: "450px",marginRight: "400px" }}
                                                        />
                                )}
                                {!loggedInUser &&(
                                                                <span className ="text-uppercase" style={{ marginLeft: "600px",marginRight: "400px" }}><b> Restaurant Finalised is</b></span>
                                                                )}
                                                                <br></br>
                                 
                                {  randomRestaurant.map((message, index) => (
                                                                                                                                       
                                                     <div style={{   height: "70px",
                                                                                          flexGrow: 1,
                                                                                          backgroundColor: "#f1f2e9",
                                                                                          padding: "2px",
                                                                                          border: "px solid green",
                                                                                          display: "flex",
                                                                                          flexDirection: "column",
                                                                                          gap: "2px", }} key = {index}>
                                                                                          <span className="d-flex justify-content-center align-items-center text-primary  ">
                                                    Restaurant {message.name} serving {message.cuisine} cuisine at {message.location}
                                                   
                                                    <br></br>
                   
                                                Lets go and have fun.....
                                                     </span>
                                                   </div>             
                                                   ))} 
                         
    </div>
    </div>

  );
};
