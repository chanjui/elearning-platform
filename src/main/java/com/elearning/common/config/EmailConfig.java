package com.elearning.common.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

  // Gmail
  @Bean
  public JavaMailSender gmailMailSender(
    @Value("${spring.mail.host}") String host,
    @Value("${spring.mail.port}") int port,
    @Value("${spring.mail.username}") String username,
    @Value("${spring.mail.password}") String password,
    @Value("${spring.mail.properties.mail.smtp.auth}") boolean auth,
    @Value("${spring.mail.properties.mail.smtp.starttls.enable}") boolean starttls,
    @Value("${spring.mail.properties.mail.smtp.connectiontimeout}") int connectionTimeout) {

    JavaMailSenderImpl sender = new JavaMailSenderImpl();
    sender.setHost(host);
    sender.setPort(port);
    sender.setUsername(username);
    sender.setPassword(password);

    Properties props = new Properties();
    props.put("mail.smtp.auth", auth);
    props.put("mail.smtp.starttls.enable", starttls);
    props.put("mail.smtp.connectiontimeout", connectionTimeout);
    sender.setJavaMailProperties(props);

    return sender;
  }

  // Naver
  @Bean
  @Qualifier("naverMailSender")
  @ConfigurationProperties(prefix = "naver-mail")
  public JavaMailSenderImpl naverMailSender() {
    return new JavaMailSenderImpl();
  }

}
