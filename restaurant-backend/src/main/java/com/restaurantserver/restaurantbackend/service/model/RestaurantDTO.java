package com.restaurantserver.restaurantbackend.service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class RestaurantDTO {
    private String name;

    private String location;

    private String cuisine;
    
    private String sessionId;
    
    private String loggedIn;

}