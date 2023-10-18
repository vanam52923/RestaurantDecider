package com.restaurantserver.restaurantbackend.service.controller;

import com.restaurantserver.restaurantbackend.service.model.Message;
import com.restaurantserver.restaurantbackend.service.model.RestaurantDTO;
import com.restaurantserver.restaurantbackend.service.service.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * The `RestaurantController` class is responsible for handling various REST and WebSocket requests related to restaurant management and chat functionalities.
 * It exposes REST endpoints for retrieving and adding restaurants, as well as WebSocket endpoints for chat functionality within different restaurant sessions.
 *
 * @RestController Indicates that this class is a controller for handling incoming HTTP requests.
 */
@RestController
public class RestaurantController {

    /**
     * The `RestaurantService` instance responsible for providing business logic and data access related to restaurants.
     */
    
    private Logger logger= LoggerFactory.getLogger(RestaurantController.class);
    
    private final RestaurantService restaurantService;

    private static Set<String> sessionIdsList = new HashSet<>();

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    
    /**
     * Handles WebSocket messages sent to the `/message/{sessionId}` endpoint, which are then broadcasted to the associated chat room.
     *
     * @param sessionId The unique session ID associated with the chat room.
     * @param message   The incoming message to be processed.
     * @return The message response or an error message if the session is invalid.
     */
    @MessageMapping("/message/{sessionId}")
    @SendTo("/chatroom/public/{sessionId}")
    public Message receiveMessageInRoom(@DestinationVariable String sessionId, @RequestBody Message message) {
        cacheNewSession(sessionId, message.getLoggedIn());
        if (!validateSessionId(sessionId)) { // throw exception if not valid
            Message errorDTO = new Message();
            errorDTO.setSessionId("400");
            errorDTO.setMessage("Session invalid or Expired");
            return errorDTO;
        }
        logger.info("Broadcast message in room with session {}", sessionId );
        return message;
    }


    /**
     * Handles WebSocket messages sent to the `/restaurant/add/{sessionId}` endpoint, allowing the addition of restaurants to a session.
     *
     * @param sessionId  The unique session ID associated with the restaurant session.
     * @param restaurant The restaurant information to be added.
     * @return The added restaurant information or an error message if the session is invalid.
     */
    @MessageMapping("/restaurant/add/{sessionId}")
    @SendTo("/restaurant/add/public/{sessionId}")
    public RestaurantDTO addRestaurant(@DestinationVariable String sessionId, @RequestBody RestaurantDTO restaurant) {
        cacheNewSession(sessionId, restaurant.getLoggedIn());
        RestaurantDTO rest;
        if (Objects.nonNull(sessionId) && validateSessionId(sessionId)) {
            logger.info("Create new restauarant for session {}", sessionId );
            restaurant.setSessionId(sessionId);
            rest = restaurantService.saveNewRestaurant(restaurant);
        } else {
            return getErrorDTO();
        }
        return rest;
    }

    
    /**
            * Handles HTTP GET requests for retrieving all restaurants associated with a session.
     *
             * @param sessionId The unique session ID for which restaurants should be retrieved.
     * @return A list of restaurant information for the specified session.
     */
    @CrossOrigin("*")
    @GetMapping("/getAll/{sessionId}")
    public List<RestaurantDTO> getAllSessionRestaurants(@PathVariable String sessionId) {
        logger.info("fetch all restaurants for session {}", sessionId );
        return restaurantService.getAllSessionRestaurants(sessionId);
    }


    /**
     * Handles WebSocket messages sent to the `/restaurant/pick/{sessionId}` endpoint, allowing the selection of a random restaurant for a session.
     *
     * @param sessionId The unique session ID for which a restaurant should be selected.
     * @param restaurant The selected restaurant information.
     * @return The selected restaurant information or an error message if the session is invalid.
     * @throws Exception If an exception occurs during restaurant selection.
     */
    @MessageMapping("/restaurant/pick/{sessionId}")
    @SendTo("/restaurant/pick/public/{sessionId}")
    public RestaurantDTO getRandomRestaurant(@DestinationVariable String sessionId, @RequestBody RestaurantDTO restaurant) throws Exception {
        if (Objects.nonNull(sessionId) && validateSessionId(sessionId)) {
            logger.info("Get random restaurant for session {}", sessionId );
            sessionIdsList.remove(sessionId);
            sessionIdsList.add(sessionId + "_EXPIRED");
            return restaurantService.getRandomRestaurant(sessionId);
        } else {
            return getErrorDTO();
        }

    }



    /**
     * Caches the unique sessions 
     *
     * @param sessionId The unique session ID for which a session should be cached.
     * @param loggedIn To know whether user is owner of session or joinee in session.
     */
    private void cacheNewSession(String sessionId, String loggedIn) {
        if ("loggedIn".equalsIgnoreCase(loggedIn)) {
            logger.info("Cache session {}", sessionId);
            sessionIdsList.addAll(restaurantService.getAllSessions());
            if (!sessionIdsList.contains(sessionId) && !sessionIdsList.contains(sessionId + "_EXPIRED")) {
                logger.info("Expired session {}", sessionId);
                sessionIdsList.add(sessionId);
            }
        }
    }


    /**
     * used to validate the sessionn 
     * @param sessionId The unique session ID .
     */

    private boolean validateSessionId(String sessionId) {
        return sessionIdsList.contains(sessionId);
    }

    private RestaurantDTO getErrorDTO() {

        RestaurantDTO errorDTO = new RestaurantDTO();
        errorDTO.setSessionId("400");
        errorDTO.setName("Session invalid or Expired");
        return errorDTO;
    }

}