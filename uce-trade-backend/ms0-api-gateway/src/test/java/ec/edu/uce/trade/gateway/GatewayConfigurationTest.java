package ec.edu.uce.trade.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.web.cors.reactive.CorsWebFilter;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class GatewayConfigurationTest {

    @Autowired
    private ApplicationContext context;

    @MockBean
    private ReactiveRedisConnectionFactory reactiveRedisConnectionFactory;

    @MockBean
    private RedisConnectionFactory redisConnectionFactory;

    @MockBean
    private ReactiveStringRedisTemplate reactiveStringRedisTemplate;

    @Test
    void contextLoadsAndConfigurationIsValid() {
        assertThat(context).isNotNull();
    }

    @Test
    void corsConfigurationIsPresent() {
        CorsWebFilter corsFilter = context.getBean(CorsWebFilter.class);
        assertThat(corsFilter).isNotNull();
    }

    @Test
    void rateLimiterIsConfigured() {
        RedisRateLimiter rateLimiter = context.getBean(RedisRateLimiter.class);
        assertThat(rateLimiter).isNotNull();
    }
}
