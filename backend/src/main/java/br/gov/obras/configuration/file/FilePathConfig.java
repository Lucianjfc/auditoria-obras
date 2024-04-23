package br.gov.obras.configuration.file;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@EnableConfigurationProperties(FilePathProperties.class)
@Profile("prod || homolog")
public class FilePathConfig {

    @Bean
    public static FilePathValidator configurationPropertiesValidator() {
        return new FilePathValidator();
    }

}
