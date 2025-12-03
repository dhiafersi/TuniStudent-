package com.tunistudent.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AIService {

    private final Map<String, String[]> templates = new HashMap<>();
    private final Random random = new Random();

    public AIService() {
        templates.put("Food", new String[]{
            "Taste the magic of {title}! A delicious treat waiting for you.",
            "Hungry? Grab {title} now and satisfy your cravings!",
            "Best food in town: {title}. Don't miss out!",
            "Experience culinary delight with {title}. Yummy!"
        });
        templates.put("Fun", new String[]{
            "Get ready for fun with {title}! An unforgettable experience.",
            "Bored? {title} is the perfect way to spend your day.",
            "Adventure awaits! Try {title} today.",
            "Make memories with {title}. Pure joy!"
        });
        templates.put("Shopping", new String[]{
            "Shop 'til you drop with {title}! Amazing value.",
            "Upgrade your style with {title}. Limited time offer!",
            "Best deal in town: {title}. Grab it before it's gone.",
            "Treat yourself to {title}. You deserve it!"
        });
        // Default fallback
        templates.put("General", new String[]{
            "Check out {title}! An amazing offer just for you.",
            "Don't miss this exclusive deal: {title}.",
            "Discover {title} and save big today!",
            "The best choice for students: {title}."
        });
    }

    public String generateDescription(String title, String categoryName) {
        String[] options = templates.getOrDefault(categoryName, templates.get("General"));
        if (options == null) options = templates.get("General"); // Fallback if category not found
        
        String template = options[random.nextInt(options.length)];
        return template.replace("{title}", title);
    }

    public boolean isContentSafe(String text) {
        if (text == null || text.trim().isEmpty()) return true;
        String lowerText = text.toLowerCase();
        
        // English bad words
        String[] englishBadWords = {
            "fuck", "shit", "bitch", "asshole", "dick", "pussy", "bastard", "whore", "slut"
        };
        
        // Tunisian bad words (examples)
        String[] tunisianBadWords = {
            "bhim", "msatek", "mnayek", "zebi", "3asba", "9ahba", "nam", "sorm", "terma", "zabor"
        };

        for (String word : englishBadWords) {
            if (lowerText.contains(word)) return false;
        }
        
        for (String word : tunisianBadWords) {
            if (lowerText.contains(word)) return false;
        }
        
        return true;
    }
}
