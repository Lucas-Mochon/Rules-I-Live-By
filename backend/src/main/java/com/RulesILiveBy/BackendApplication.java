package com.RulesILiveBy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;
import io.mongock.runner.springboot.EnableMongock;

@SpringBootApplication
@EnableMongock
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		System.setProperty("SPRING_DATA_MONGODB_URI", dotenv.get("SPRING_DATA_MONGODB_URI"));
		System.setProperty("SPRING_DATA_MONGODB_DATABASE", dotenv.get("SPRING_DATA_MONGODB_DATABASE"));

		SpringApplication.run(BackendApplication.class, args);
	}
}
