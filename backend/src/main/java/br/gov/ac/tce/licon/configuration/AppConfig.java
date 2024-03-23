package br.gov.ac.tce.licon.configuration;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.j256.simplemagic.ContentInfoUtil;

@Configuration
public class AppConfig {

    @Bean
    public ContentInfoUtil contentInfoUtil() {
        return new ContentInfoUtil();
    }

    @Bean
    public JtsModule jtsModule() {
        return new JtsModule();
    }

}
