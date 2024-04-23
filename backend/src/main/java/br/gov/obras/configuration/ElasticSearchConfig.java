package br.gov.obras.configuration;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages
        = "io.pratik.elasticsearch.repositories")
@ComponentScan(basePackages = {"io.pratik.elasticsearch"})
public class ElasticSearchConfig extends
        AbstractElasticsearchConfiguration {

    @Value("${spring.elasticsearch.host}")
    protected String springElasticsearchHost;

    @Value("${spring.elasticsearch.user}")
    protected String springElasticsearchUser;

    @Value("${spring.elasticsearch.password}")
    protected String springElasticsearchPassword;

    @Override
    @Bean
    public RestHighLevelClient elasticsearchClient() {
        ClientConfiguration clientConfiguration = ClientConfiguration.builder()
                .connectedTo(springElasticsearchHost)
                .withBasicAuth(springElasticsearchUser, springElasticsearchPassword)
                .build();

        return RestClients.create(clientConfiguration).rest();
    }
}

