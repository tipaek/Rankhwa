package com.rankhwa.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RankhwaBackendApplication {

	public static void main(String[] args) {
		try {
			// Propagating environmental variables before application runs
			Dotenv dotenv = Dotenv.configure()
					.directory("rankhwa-backend")
					.filename(".env")
					.ignoreIfMissing()
					.load();
			dotenv.entries().forEach(entry ->
					System.setProperty(entry.getKey(), entry.getValue()));
		} catch (Exception ignored) {}

		SpringApplication.run(RankhwaBackendApplication.class, args);
	}

}
