package com.rankhwa.backend.controller;

import com.rankhwa.backend.model.Ping;
import com.rankhwa.backend.repository.PingRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/db-health/ping")
@AllArgsConstructor
public class PingController {
    private final PingRepository repo;

    @PostMapping
    public Ping createPing(@RequestBody Map<String, String> body) {
        Ping ping = new Ping();
        ping.setMessage("Ping message");
        return repo.save(ping);
    }

    @GetMapping
    public List<Ping> getAll() {
        return repo.findAll();
    }
}
