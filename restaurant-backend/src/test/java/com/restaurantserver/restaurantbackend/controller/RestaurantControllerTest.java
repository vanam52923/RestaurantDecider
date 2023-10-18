package com.restaurantserver.restaurantbackend.controller;

import com.restaurantserver.restaurantbackend.service.controller.RestaurantController;
import com.restaurantserver.restaurantbackend.service.model.Message;
import com.restaurantserver.restaurantbackend.service.model.RestaurantDTO;
import com.restaurantserver.restaurantbackend.service.service.RestaurantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;

public class RestaurantControllerTest {

    @Mock
    private SimpMessagingTemplate simpMessagingTemplate;

    @Mock
    private RestaurantService restaurantService;

    @InjectMocks
    private RestaurantController restaurantController;

    @BeforeEach
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testReceiveMessageInRoom() throws Exception {
        String sessionId = "testSession";
        Message message = new Message();
        message.setSessionId(sessionId);
        message.setLoggedIn("loggedIn");

        Mockito.when(restaurantService.getAllSessions()).thenReturn(new HashSet());

        Message response = restaurantController.receiveMessageInRoom(sessionId, message);


        assertEquals(message, response);
    }

    @Test
    public void testAddRestaurant() throws Exception {

        String sessionId = "400";
        RestaurantDTO restaurantDTO = new RestaurantDTO();
        restaurantDTO.setName("Session invalid or Expired");
        restaurantDTO.setSessionId(sessionId);
        Mockito.when(restaurantService.saveNewRestaurant(any(RestaurantDTO.class))).thenReturn(restaurantDTO);
        Mockito.when(restaurantService.getAllSessions()).thenReturn(new HashSet());

        RestaurantDTO response = restaurantController.addRestaurant(sessionId, restaurantDTO);

        assertEquals(restaurantDTO.getName(), response.getName());
    }

    @Test
    public void testGetAllSessionRestaurants() throws Exception {

        String sessionId = "testSession";
        List<RestaurantDTO> restaurants = new ArrayList<>();
        restaurants.add(new RestaurantDTO());
        restaurants.add(new RestaurantDTO());

        Mockito.when(restaurantService.getAllSessionRestaurants(sessionId)).thenReturn(restaurants);

        List<RestaurantDTO> response = restaurantController.getAllSessionRestaurants(sessionId);

        assertEquals(restaurants, response);
    }

    @Test
    public void testGetRandomRestaurant() throws Exception {

        String sessionId = "testSession";
        RestaurantDTO restaurantDTO = new RestaurantDTO();
        restaurantDTO.setName("Test Restaurant");

        Mockito.when(restaurantService.getRandomRestaurant(sessionId)).thenReturn(restaurantDTO);

        RestaurantDTO response = restaurantController.getRandomRestaurant(sessionId, restaurantDTO);

        assertEquals(restaurantDTO, response);
    }
}