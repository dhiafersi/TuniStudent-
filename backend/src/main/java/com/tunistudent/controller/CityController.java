package com.tunistudent.controller;

import com.tunistudent.model.City;
import com.tunistudent.repository.CityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {
    private final CityRepository cityRepository;

    public CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public List<City> list() {
        return cityRepository.findAll();
    }
}


