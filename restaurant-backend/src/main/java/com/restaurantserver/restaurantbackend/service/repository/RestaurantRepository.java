package com.restaurantserver.restaurantbackend.service.repository;

import com.restaurantserver.restaurantbackend.service.repository.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


/**
 * The `RestaurantRepository`  is responsible for fetching data from database.
 * It enables method name based queries to fetch required data.
 */

@Repository
public interface RestaurantRepository  extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
