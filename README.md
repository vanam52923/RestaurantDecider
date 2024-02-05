# RestaurantVenue
 Restaurant Venvue decider application
 
# Application Project
  This application allows users to join a session to decide the restaurant for the outing. An additional feature is users can chat with each other in real time to decide the venue but submission will be admissible only from restaurant form not from the chat window.
  It has been built using the Spring Boot framework for the backend, SockJS for WebSocket communication, 
  , h2 database for data storage and Angular for the frontend. The project utilizes Maven as the build tool for the backend.

## Features
- __Session__creation__: Users can create a session and invite others via created link or can join an ongoing session via shared link.
- __Real-time Chat__: Once logged in, users are directed to the chat page where they can send messages in the chatroom.
- __Dispaying Chosen Restaurants__: All users can see the restaurants added by other users in the same session.
- __Master_Access__: Only master user(session creator) can end the session and random restuarant will be notified to all the users.
- __User Awareness__: Users are notified when new users join the chatroom, allowing them to be aware of other participants.
- __Logout__: Users can log out from the session, and can join back the session if the session is active.
- __Session Inactivity__: No one can join the session if master user ended the session.

## Tech Stack
The application incorporates the following technologies:

- __Spring Boot__: A Java-based framework used for building the backend server and handling business logic.
- __SockJS__: A WebSocket  library that enables two-way, real-time communication between the server and clients.
- __Angular__: A framework for building frontend.
## Setup Instructions
To run the application locally, follow these steps:

1. __Clone the repository__: ``` https://github.com/vanam52923/RestaurantDecider.git```
2. __Navigate to the project directory__: ```cd restaurant-backend```
3. __Set up the backend server__:
   - Install the dependencies: ```mvn clean install```
   - Start the Spring Boot server: ```mvn spring-boot:run```
4. __Set up the frontend__:
   - Install the dependencies: ```cd restaurant-ui``` && ```npm install```
   - Start the React server: ```ng serve```
5. __Open your application__ ```http://localhost:4200```

## Application flow

Detailed application flow can be found here : 


Feel free to enhance the application as per your requirement.

