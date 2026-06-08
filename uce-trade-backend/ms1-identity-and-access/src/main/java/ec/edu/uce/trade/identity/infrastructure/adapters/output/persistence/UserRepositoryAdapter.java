package ec.edu.uce.trade.identity.infrastructure.adapters.output.persistence;

import ec.edu.uce.trade.identity.domain.model.User;
import ec.edu.uce.trade.identity.domain.ports.UserRepositoryPort;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository repository;

    public UserRepositoryAdapter(SpringDataUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User save(User user) {
        UserEntity entity = new UserEntity();
        entity.setUid(user.getUid());
        entity.setEmail(user.getEmail());
        entity.setRole(user.getRole());
        
        UserEntity saved = repository.save(entity);
        user.setUid(saved.getUid());
        return user;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        // Implementación futura
        return Optional.empty();
    }
}

// Spring Data JPA Interface
interface SpringDataUserRepository extends org.springframework.data.jpa.repository.JpaRepository<UserEntity, String> {}