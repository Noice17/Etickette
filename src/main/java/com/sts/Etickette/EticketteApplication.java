package com.sts.Etickette;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EticketteApplication {

	public static void main(String[] args) {
		SpringApplication.run(EticketteApplication.class, args);
	}

}
