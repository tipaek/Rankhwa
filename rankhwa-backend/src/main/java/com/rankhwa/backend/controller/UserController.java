package com.rankhwa.backend.controller;

import com.rankhwa.backend.dto.UserSelfResponse;
import com.rankhwa.backend.dto.UserSummary;
import com.rankhwa.backend.model.User;
import com.rankhwa.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    /* --- Current User --- */
    @GetMapping("/me")
    public UserSelfResponse me(@AuthenticationPrincipal User user) {
        return new UserSelfResponse(
                user.getId(), user.getEmail(), user.getDisplayName(), user.getCreatedAt()
        );
    }

    @PatchMapping("/me")
    public UserSelfResponse updateMe(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body
            ) {
        if (body.containsKey("displayName"))
            user.setDisplayName(body.get("displayName"));

        // handle password update flow here later
        userRepository.save(user);

        return new UserSelfResponse(
                user.getId(), user.getEmail(), user.getDisplayName(), user.getCreatedAt()
        );
    }

    /* --- Public Profile --- */
    @GetMapping("/{id}")
    public UserSummary publicProfile(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow(); // todo custom 404
        return new UserSummary(u.getId(), u.getDisplayName(), u.getCreatedAt());
    }
}
