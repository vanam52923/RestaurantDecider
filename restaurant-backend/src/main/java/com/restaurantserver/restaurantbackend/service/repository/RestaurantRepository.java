package com.restaurantserver.restaurantbackend.service.repository;



import com.restaurantserver.restaurantbackend.service.repository.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository  extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
