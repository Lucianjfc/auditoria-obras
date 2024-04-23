package br.gov.obras.configuration;

import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpIOException;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitConfig {

    @Value("${spring.rabbitmq.queue.name}")
    private String queueName;

    @Value("${spring.rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${spring.rabbitmq.routeKey}")
    private String routeKey;

    @Value("${spring.profiles.active}")
    private String profile;

    private final org.slf4j.Logger logger = LoggerFactory.getLogger(RabbitConfig.class);

    @Bean
    public DirectExchange topicExchange() {
        return new DirectExchange(exchangeName);
    }

    @Bean
    public DirectExchange topicExchangeDLX() {
        return new DirectExchange(exchangeName + ".dlx");
    }

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    private void initializeRabbit(RabbitAdmin rabbitAdmin) {
        try {
            if (!"dev".equals(profile)) {
                rabbitAdmin.initialize();
                logger.info("Serviço do RabbitMQ iniciado.");
            }
        } catch (AmqpIOException e) {
            logger.error("Erro ao inicializar o serviço do RabbitMQ.");
        }
    }

    @Bean
    public ApplicationListener<ApplicationReadyEvent> applicationReadyEventApplicationListener(
            RabbitAdmin rabbitAdmin) {
        return event -> this.initializeRabbit(rabbitAdmin);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        return rabbitTemplate;
    }

    @Bean
    public Queue queue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", exchangeName + ".dlx");
        args.put("x-dead-letter-routing-key", routeKey + ".drk");
        return new Queue(queueName, true, false, false, args);
    }

    @Bean
    public Queue queueDLQ() {
        return new Queue(queueName + ".dlq", true);
    }

    @Bean
    Binding binding() {
        Queue queue = this.queue();
        DirectExchange exchange = this.topicExchange();
        return BindingBuilder.bind(queue).to(exchange).with(routeKey);
    }

    @Bean
    Binding bindingDLQ() {
        Queue queue = this.queueDLQ();
        DirectExchange exchange = this.topicExchangeDLX();
        return BindingBuilder.bind(queue).to(exchange).with(routeKey + ".drk");
    }

    @Bean
    public DirectExchange editalExchange() {
        return new DirectExchange("mq.exchange.edital");
    }

    @Bean
    Binding bindingEdital() {
        Queue queue = this.queueEdital();
        DirectExchange exchange = new DirectExchange("mq.exchange.edital");
        return BindingBuilder.bind(queue).to(exchange).with("edital");
    }

    @Bean
    public Queue queueEdital() {
        return new Queue("extracao-sentencas-edital", true);
    }
}
