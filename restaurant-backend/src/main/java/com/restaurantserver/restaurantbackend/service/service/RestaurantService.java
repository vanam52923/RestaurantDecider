package com.restaurantserver.restaurantbackend.service.service;

import com.restaurantserver.restaurantbackend.service.controller.RestaurantController;
import com.restaurantserver.restaurantbackend.service.model.RestaurantDTO;
import com.restaurantserver.restaurantbackend.service.repository.RestaurantRepository;
import com.restaurantserver.restaurantbackend.service.repository.model.Restaurant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private Logger logger = LoggerFactory.getLogger(RestaurantService.class);
    private RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public RestaurantDTO saveNewRestaurant(RestaurantDTO restaurantDTO) {
        Restaurant restaurant = null;
        if (Objects.nonNull(restaurantDTO)) {
            restaurant = restaurantRepository.save(mapDTOToEntity(restaurantDTO));
        }
        logger.info("New restaurant choice added");
        return mapEntityToDTO(restaurant);
    }

    public List<RestaurantDTO> getAllSessionRestaurants(String sessionId) {
        List<Restaurant> restaurants = restaurantRepository.findBySessionId(sessionId);
        logger.info("Restaurants in session {}", restaurants);
        return restaurants.stream().map(restaurant -> mapEntityToDTO(restaurant)).collect(Collectors.toList());
    }

    @Transactional
    public RestaurantDTO getRandomRestaurant(String sessionId) {
        logger.info("Pick restaurant in session {}", sessionId);
        List<RestaurantDTO> allRestaurants = getAllSessionRestaurants(sessionId);
        restaurantRepository.deleteBySessionId(sessionId);
        Random rndm = new Random();
        if (CollectionUtils.isEmpty(allRestaurants)) {
            return null;
        } else return allRestaurants.get(rndm.nextInt(allRestaurants.size()));

    }

    public Set getAllSessions() {
        List<Restaurant> restaurant = restaurantRepository.findAll();
        logger.info("Pick all restaurants");
        return restaurant.stream().map(restauran -> restauran.getSessionId()).collect(Collectors.toSet());
    }


    private Restaurant mapDTOToEntity(RestaurantDTO restaurantDTO) {
        Restaurant restaurant = new Restaurant();
        restaurant.setCuisine(restaurantDTO.getCuisine());
        restaurant.setLocation(restaurantDTO.getLocation());
        restaurant.setName(restaurantDTO.getName());
        restaurant.setLoggedIn(restaurantDTO.getLoggedIn());
        restaurant.setSessionId(restaurantDTO.getSessionId());
        return restaurant;
    }

    private RestaurantDTO mapEntityToDTO(Restaurant restaurant) {
        RestaurantDTO restaurantDTO = null;
        if (Objects.nonNull(restaurant)) {
            restaurantDTO = new RestaurantDTO();
            restaurantDTO.setCuisine(restaurant.getCuisine());
            restaurantDTO.setLocation(restaurant.getLocation());
            restaurantDTO.setName(restaurant.getName());
            restaurantDTO.setLoggedIn(restaurant.getLoggedIn());
            restaurantDTO.setSessionId(restaurant.getSessionId());
        }
        return restaurantDTO;
    }
}
