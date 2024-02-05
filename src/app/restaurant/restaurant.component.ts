import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import {HttpClient} from '@angular/common/http';



@Component({
  selector: 'cf-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  private stompClient!: Stomp.Client;
  addedRestaurantSubject : BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  username!: string;
  receiver!: string;
  message!: string;
  restname!: string;
  restloc!: string;
  cuisine!: string;
  publicChats: any[] = [];
  sessionId!: string;
  currSession!: string;
  addedRestaurant: any[] = [];
  randomRestaurant: any[] = [];
  loggedInUser!: string;
  loggedInUserName!: string;

  constructor(private route: ActivatedRoute, private router: Router, private http:HttpClient) {
 this.onRestaurantAdd =this.onRestaurantAdd.bind(this);
 this.onRandomRestaurant =this.onRandomRestaurant.bind(this);
 this.onMessageReceived = this.onMessageReceived.bind(this);
  }

  ngOnInit() {
   
    this.route.params.subscribe(params => {
      this.currSession = params['sessionId'];
    });

    this.route.queryParams.subscribe(queryParams => {
      this.loggedInUser = queryParams['searchCriteria'];
      this.loggedInUserName = queryParams['userName'];
    });

    if(!this.loggedInUser){
 
     const enteredName = window.prompt("Welcome! Please enter your name.");
     if(enteredName){
      this.loggedInUserName = enteredName;
     }

    }
    else {
      window.history.replaceState({},document.title,window.location.pathname );
    }
  

    this.connect();
    this.fetchSessionRestaurants();
  }

  ngOnDestroy() {
    this.disconnect();
  }

   onConnect() {
    console.log('Connected');
    this.userJoin();
  }

  onError(err: any) {
    console.log('err=>', err);
  }

  handleLogout() {
    this.userLeft();
    this.router.navigate(['/login']);
  }

  handleCopyLink() {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(
      function () {
        alert('URL copied to clipboard');
      },
      function (err) {
        console.error('Could not copy URL: ', err);
      }
    );
  }

  userJoin() {
    const chatMessage = {
      senderName: this.loggedInUserName,
      status: 'JOIN',
      message: `${this.loggedInUserName} joined`,
      sessionId: this.currSession,
      loggedIn: this.loggedInUser
    };
    this.stompClient.subscribe(`/restaurant/add/public/${this.currSession}`, this.onRestaurantAdd);
    this.stompClient.subscribe(`/restaurant/pick/public/${this.currSession}`, this.onRandomRestaurant);
    this.stompClient.subscribe(`/chatroom/public/${this.currSession}`, this.onMessageReceived);
    this.stompClient.send(`/app/message/${this.currSession}`, {}, JSON.stringify(chatMessage));
  }

  userLeft() {
    const chatMessage = {
      senderName: this.loggedInUserName,
      status: 'LEAVE',
      message: `${this.loggedInUserName} left`
    };

    this.stompClient.send(`/app/message/${this.currSession}`, {}, JSON.stringify(chatMessage));
  }



  connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({},  () => {
      console.log('Connected!');
     this.onConnect(); 
    });

  }


  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect;
    }
  }


  fetchSessionRestaurants() {
    const url = `http://localhost:8080/getAll/${this.currSession}`;
  
    this.http.get(url).subscribe(
      (response: any) => {
        if (response.length > 0) {
          this.addedRestaurant = [...this.addedRestaurant, ...response];
          this.addedRestaurantSubject.next([...this.addedRestaurant]);
        } else {
          console.error('Empty response or unexpected format:', response);
        }
      },
      (error: any) => {
        console.error('HTTP Error:', error);
      }
    );
  }

  sendMessage() {
    if (this.message.trim().length > 0) {
      this.stompClient.send(`/app/message/${this.currSession}`, {}, JSON.stringify({
        senderName: this.loggedInUserName,
        status: 'MESSAGE',
        message: this.message,
        sessionId: this.currSession,
        loggedIn: this.loggedInUser
      }));
      this.message = '';
    }
  }

  handleSubmitRestaurant() {
    if(this.restname && this.restname.trim().length>0){
      this.stompClient.send(`/app/restaurant/add/${this.currSession}`, {}, JSON.stringify({
        name: this.restname,
        location: this.restloc,
        cuisine: this.cuisine,
        sessionId: this.currSession,
        loggedIn : this.loggedInUser
      }));
      this.restname = '';
      this.restloc = '';
      this.cuisine = '';
    }
    else {
      alert("Please enter restaurant name");
    }
 
  }






  handleRandomRestaurant() {
    this.stompClient.send(`/app/restaurant/pick/${this.currSession}`, {}, JSON.stringify({
      sessionId: this.currSession
    }));
  }

  onMessageReceived(payload: { body: string; }) {
    const payloadData = JSON.parse(payload.body);
    console.log(payloadData);
    if (payloadData.sessionId === '400') {
      alert(`${payloadData.message}. Create a new session or join another session. Logging out.`);
      this.handleLogout();
    }

    switch (payloadData.status) {
      case 'JOIN':

        this.publicChats = [...this.publicChats, payloadData];
        break;
      case 'LEAVE':

        this.publicChats = [...this.publicChats, payloadData];
        break;
      case 'MESSAGE':

        this.publicChats = [...this.publicChats, payloadData];
        break;
    }
  }

  onRestaurantAdd(payload: { body: string; }) {
    const payloadData = JSON.parse(payload.body);
    if (payloadData.sessionId === '400') {
      alert(`${payloadData.name}. Create a new session or join another session. Logging out.`);
      this.handleLogout();
    } else {
      this.addedRestaurant=[...this.addedRestaurant, payloadData];
      this.addedRestaurantSubject.next([...this.addedRestaurant]);
    }
  }

  onRandomRestaurant(payload: { body: string; }) {
    const payloadData = JSON.parse(payload.body);
    if (payloadData.sessionId === '400') {
      alert(`${payloadData.name}. Create a new session or join another session. Logging out.`);
      this.handleLogout();
    } else {
      this.randomRestaurant=[...this.randomRestaurant, payloadData];
    }
  }

}

