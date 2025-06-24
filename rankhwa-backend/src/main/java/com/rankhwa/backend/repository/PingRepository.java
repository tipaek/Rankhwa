package com.rankhwa.backend.repository;

import com.rankhwa.backend.model.Ping;
import org.springframework.data.jpa.repository.JpaRepository;

// just a temp repository to interact with the db
public interface PingRepository extends JpaRepository<Ping, Long> {

}
