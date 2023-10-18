package com.restaurantserver.restaurantbackend.service;


import com.restaurantserver.restaurantbackend.service.model.RestaurantDTO;
import com.restaurantserver.restaurantbackend.service.repository.RestaurantRepository;
import com.restaurantserver.restaurantbackend.service.repository.model.Restaurant;
import com.restaurantserver.restaurantbackend.service.service.RestaurantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.when;

@SpringBootTest
public class RestaurantServiceTest {

    @Mock
    private RestaurantRepository restaurantRepository;

    @InjectMocks
    private RestaurantService restaurantService;

    @BeforeEach
    void setUp() {

    }

    @Test
    public void testSaveNewRestaurant() {

        RestaurantDTO restaurantDTO = new RestaurantDTO();
        restaurantDTO.setName("Test Restaurant");
        Restaurant restaurant = new Restaurant();
        restaurant.setName("Test Restaurant");
        when(restaurantRepository.save(any())).thenReturn(restaurant);

        RestaurantDTO savedRestaurant = restaurantService.saveNewRestaurant(restaurantDTO);
        assertEquals("Test Restaurant", savedRestaurant.getName());
    }

    @Test
    public void testGetAllSessionRestaurants() {

        String sessionId = "sampleSessionId";
        List<Restaurant> sampleRestaurants = new ArrayList<>();
        when(restaurantRepository.findBySessionId(sessionId)).thenReturn(sampleRestaurants);

        List<RestaurantDTO> restaurants = restaurantService.getAllSessionRestaurants(sessionId);
        assertEquals(0, restaurants.size()); 
    }



    @Test
    public void testGetRandomRestaurant() {
        String sessionId = "sampleSessionId";

        List<RestaurantDTO> sampleRestaurants = new ArrayList<>();
        when(restaurantRepository.findBySessionId(sessionId)).thenReturn(new ArrayList<>());
        RestaurantDTO randomRestaurant = restaurantService.getRandomRestaurant(sessionId);
        assertEquals(null, randomRestaurant);
    }
}

