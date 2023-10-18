package com.restaurantserver.restaurantbackend.service.controller;

import com.restaurantserver.restaurantbackend.service.model.Message;
import com.restaurantserver.restaurantbackend.service.model.RestaurantDTO;
import com.restaurantserver.restaurantbackend.service.service.RestaurantService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@RestController
public class RestaurantController {

    private SimpMessagingTemplate simpMessagingTemplate;

    private final RestaurantService restaurantService;

    private static Set<String> sessionIdsList = new HashSet<>();

    public RestaurantController(RestaurantService restaurantService, SimpMessagingTemplate simpMessagingTemplate) {
        this.restaurantService = restaurantService;
    }

    @MessageMapping("/message/{sessionId}")
    @SendTo("/chatroom/public/{sessionId}")
    public Message receiveMessageInRoom(@DestinationVariable String sessionId, @RequestBody Message message) throws Exception {
        cacheNewSession(sessionId, message.getLoggedIn());
        if(!validateSessionId(sessionId)){ // throw exception if not valid
            Message errorDTO = new Message();
            errorDTO.setSessionId("400");
            errorDTO.setMessage("Session invalid or Expired");
            return errorDTO;
        }
        return message;
    }

    @MessageMapping("/restaurant/add/{sessionId}")
    @SendTo("/restaurant/add/public/{sessionId}")
    public RestaurantDTO addRestaurant(@DestinationVariable String sessionId, @RequestBody RestaurantDTO restaurant) throws Exception {
        cacheNewSession(sessionId, restaurant.getLoggedIn());
        RestaurantDTO rest = null;
       if(Objects.nonNull(sessionId) && validateSessionId(sessionId)){ 
           restaurant.setSessionId(sessionId);
           rest = restaurantService.saveNewRestaurant(restaurant);
       }
       else {
           return getErrorDTO();
       }
        System.out.println(restaurant);
        return rest;
    }
    
  @CrossOrigin("*")  
  @GetMapping("/getAll/{sessionId}")
    public List<RestaurantDTO> getAllSessionRestaurants(@PathVariable String sessionId) throws Exception {
      return restaurantService.getAllSessionRestaurants(sessionId);
    }

    @MessageMapping("/restaurant/pick/{sessionId}")
    @SendTo("/restaurant/pick/public/{sessionId}")
    public RestaurantDTO getRandomRestaurant(@DestinationVariable String sessionId, @RequestBody RestaurantDTO restaurant) throws Exception {
        if(Objects.nonNull(sessionId) && validateSessionId(sessionId)){
            sessionIdsList.remove(sessionId);
            sessionIdsList.add(sessionId+"_EXPIRED");
            return restaurantService.getRandomRestaurant(sessionId);
        }
        else {
            return getErrorDTO();
        }
       
    }
    
    private void cacheNewSession(String sessionId, String loggedIn){
        if("loggedIn".equalsIgnoreCase(loggedIn)) {
            sessionIdsList.addAll(restaurantService.getAllSessions());
            if(!sessionIdsList.contains(sessionId) && !sessionIdsList.contains(sessionId+"_EXPIRED")){
                sessionIdsList.add(sessionId);
            }
        }
    }
    
    private boolean validateSessionId(String sessionId) {
       return sessionIdsList.contains(sessionId);
    }
    
    private RestaurantDTO getErrorDTO(){

            RestaurantDTO errorDTO = new RestaurantDTO();
            errorDTO.setSessionId("400");
            errorDTO.setName("Session invalid or Expired");
            return errorDTO;
    }

}