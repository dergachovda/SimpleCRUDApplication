package com.project.test.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestApplication.class, args);
	}
//
//	@Bean
//	InitializingBean addData() {
//		return () -> {
//			userRepository.save(new User("John", "Johnson", new Date("12121985"), "Male"));
//			userRepository.save(new User("Rambo", "Carbon", new Date("01031986"), "Male"));
//			userRepository.save(new User("Milena", "Smite", new Date("11051990"), "Female"));
//		};
//	}
}
