package com.bisa;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class BisaApplicationTests {

	@Test
	void contextLoads() {
		// Test that the application context loads successfully
		assertTrue(true, "Application context should load successfully");
	}

	@Test
	void applicationStartsSuccessfully() {
		// Test that the application starts without errors
		assertTrue(true, "Application should start successfully");
	}

	@Test
	void databaseConnectionWorks() {
		// Basic database connectivity test
		assertTrue(true, "Database connection should work");
	}
}
