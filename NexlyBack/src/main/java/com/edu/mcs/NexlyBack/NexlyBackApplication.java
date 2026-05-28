package com.edu.mcs.NexlyBack;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class NexlyBackApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(e -> {
			if (System.getenv(e.getKey()) == null) {
				System.setProperty(e.getKey(), e.getValue());
			}
		});
		SpringApplication.run(NexlyBackApplication.class, args);
	}

}
