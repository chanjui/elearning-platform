package com.elearning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
@SpringBootApplication(exclude ={SecurityAutoConfiguration.class})
public class ELearningBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(ELearningBackendApplication.class, args);
  }

}
