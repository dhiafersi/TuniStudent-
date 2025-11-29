package com.tunistudent.config;

import com.tunistudent.model.Category;
import com.tunistudent.model.City;
import com.tunistudent.model.Deal;
import com.tunistudent.model.User;
import com.tunistudent.repository.CategoryRepository;
import com.tunistudent.repository.CityRepository;
import com.tunistudent.repository.DealRepository;
import com.tunistudent.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            CityRepository cityRepository,
            CategoryRepository categoryRepository,
            DealRepository dealRepository,
            UserRepository userRepository
    ) {
        return args -> {

            // 1) Cities
            if (cityRepository.count() == 0) {
                List<String> cities = Arrays.asList(
                        "Tunis", "Ariana", "Ben Arous", "Manouba",
                        "Nabeul", "Zaghouan", "Bizerte", "Béja",
                        "Jendouba", "Le Kef", "Siliana", "Sousse",
                        "Monastir", "Mahdia", "Sfax", "Kairouan",
                        "Kasserine", "Sidi Bouzid", "Gabès", "Medenine",
                        "Tataouine", "Gafsa", "Tozeur", "Kebili"
                );
                cities.forEach(name -> cityRepository.save(City.builder().name(name).build()));
            }

            // 2) Categories
            if (categoryRepository.count() == 0) {
                List<String> cats = Arrays.asList("Restaurant", "Gym", "Fashion", "Tech", "Study Tools");
                cats.forEach(n -> categoryRepository.save(Category.builder().name(n).build()));
            }

            // Note: Users are now managed by Keycloak and auto-created on first login via SecurityUserService

            // 4) Deals (sample data only if none exist)
            if (dealRepository.count() == 0) {
                City tunis = cityRepository.findByNameIgnoreCase("Tunis").orElseGet(() ->
                        cityRepository.save(City.builder().name("Tunis").build()));
                City sfax = cityRepository.findByNameIgnoreCase("Sfax").orElseGet(() ->
                        cityRepository.save(City.builder().name("Sfax").build()));

                Category rest = categoryRepository.findByNameIgnoreCase("Restaurant").orElseGet(() ->
                        categoryRepository.save(Category.builder().name("Restaurant").build()));
                Category gym = categoryRepository.findByNameIgnoreCase("Gym").orElseGet(() ->
                        categoryRepository.save(Category.builder().name("Gym").build()));
                Category tech = categoryRepository.findByNameIgnoreCase("Tech").orElseGet(() ->
                        categoryRepository.save(Category.builder().name("Tech").build()));

                dealRepository.save(Deal.builder()
                        .title("Student Meal -20%")
                        .description("Affordable meal with student discount. Show your student card!")
                        .imageUrl("https://picsum.photos/seed/meal/800/600")
                        .category(rest)
                        .price(new BigDecimal("15.000"))
                        .discount(new BigDecimal("20.00"))
                        .location("Centre Ville Tunis")
                        .city(tunis)
                        .expirationDate(LocalDate.now().plusMonths(1))
                        .build());

                dealRepository.save(Deal.builder()
                        .title("Gym Membership -30%")
                        .description("Monthly membership discount for students.")
                        .imageUrl("https://picsum.photos/seed/gym/800/600")
                        .category(gym)
                        .price(new BigDecimal("120.000"))
                        .discount(new BigDecimal("30.00"))
                        .location("Lac 1, Tunis")
                        .city(tunis)
                        .expirationDate(LocalDate.now().plusMonths(2))
                        .build());

                dealRepository.save(Deal.builder()
                        .title("Laptop -15% for Students")
                        .description("Get your new study laptop with a student discount!")
                        .imageUrl("https://picsum.photos/seed/laptop/800/600")
                        .category(tech)
                        .price(new BigDecimal("1800.00"))
                        .discount(new BigDecimal("15.00"))
                        .location("Sfax Centre")
                        .city(sfax)
                        .expirationDate(LocalDate.now().plusMonths(1))
                        .build());
            }
        };
    }
}
