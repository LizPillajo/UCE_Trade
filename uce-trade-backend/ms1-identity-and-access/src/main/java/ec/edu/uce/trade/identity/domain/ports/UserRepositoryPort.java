package ec.edu.uce.trade.identity.domain.ports;

import ec.edu.uce.trade.identity.domain.model.User;
import java.util.Optional;

public interface UserRepositoryPort {
    User save(User user);
    Optional<User> findById(String uid); 
}