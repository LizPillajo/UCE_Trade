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
        entity.setFullName(user.getFullName());
        entity.setFaculty(user.getFaculty());
        entity.setRole(user.getRole());
        entity.setCreatedAt(user.getCreatedAt());
        
        UserEntity saved = repository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<User> findById(String uid) {
        return repository.findById(uid).map(this::mapToDomain);
    }

    private User mapToDomain(UserEntity entity) {
        User user = new User();
        user.setUid(entity.getUid());
        user.setEmail(entity.getEmail());
        user.setFullName(entity.getFullName());
        user.setFaculty(entity.getFaculty());
        user.setRole(entity.getRole());
        user.setCreatedAt(entity.getCreatedAt());
        return user;
    }
}

// Spring Data JPA Interface
interface SpringDataUserRepository extends org.springframework.data.jpa.repository.JpaRepository<UserEntity, String> {}