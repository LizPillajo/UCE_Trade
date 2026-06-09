package ec.edu.uce.trade.identity.application.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import ec.edu.uce.trade.identity.domain.model.User;
import ec.edu.uce.trade.identity.domain.ports.UserRepositoryPort;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private FirebaseAuth firebaseAuth;

    @Mock
    private FirebaseToken firebaseToken;

    @InjectMocks
    private AuthService authService;

    private MockedStatic<FirebaseAuth> mockedFirebaseAuth;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Habilitar el mock estático para Firebase
        mockedFirebaseAuth = mockStatic(FirebaseAuth.class);
    }

    @AfterEach
    void tearDown() {
        // Cerrar el mock estático para evitar contaminación entre hilos de ejecución
        mockedFirebaseAuth.close();
    }

    @Test
    void shouldReturnExistingUserWhenAuthenticateFires() throws Exception {
        // Arrange
        String token = "valid-token";
        String uid = "user-123";
        
        mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(firebaseAuth);
        when(firebaseAuth.verifyIdToken(token)).thenReturn(firebaseToken);
        when(firebaseToken.getUid()).thenReturn(uid);

        User existingUser = new User();
        existingUser.setUid(uid);
        existingUser.setEmail("student@uce.edu.ec");
        existingUser.setRole("UCE_STUDENT");

        when(userRepository.findById(uid)).thenReturn(Optional.of(existingUser));

        // Act
        User result = authService.authenticate(token);

        // Assert
        assertNotNull(result);
        assertEquals(uid, result.getUid());
        assertEquals("UCE_STUDENT", result.getRole());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldCreateNewStudentUserWhenUserDoesNotExist() throws Exception {
        // Arrange
        String token = "new-token";
        String uid = "user-789";
        String email = "liz@uce.edu.ec"; // Dominio institucional institucional
        
        mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(firebaseAuth);
        when(firebaseAuth.verifyIdToken(token)).thenReturn(firebaseToken);
        when(firebaseToken.getUid()).thenReturn(uid);
        when(firebaseToken.getEmail()).thenReturn(email);

        when(userRepository.findById(uid)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = authService.authenticate(token);

        // Assert
        assertNotNull(result);
        assertEquals(uid, result.getUid());
        assertEquals(email, result.getEmail());
        assertEquals("UCE_STUDENT", result.getRole()); // Mapeado por terminar en @uce.edu.ec
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldUpdateProfileSuccessfullyWhenUserExists() {
        // Arrange
        String uid = "user-123";
        User existingUser = new User();
        existingUser.setUid(uid);
        existingUser.setFullName("Old Name");
        existingUser.setFaculty("Old Faculty");

        User updatedData = new User();
        updatedData.setFullName("Liz Pillajo");
        updatedData.setFaculty("Engineering and Applied Sciences");

        when(userRepository.findById(uid)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = authService.updateProfile(uid, updatedData);

        // Assert
        assertNotNull(result);
        assertEquals("Liz Pillajo", result.getFullName());
        assertEquals("Engineering and Applied Sciences", result.getFaculty());
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void shouldThrowExceptionWhenUpdateProfileUserNotFound() {
        // Arrange
        String uid = "invalid-uid";
        User updatedData = new User();

        when(userRepository.findById(uid)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.updateProfile(uid, updatedData));
        verify(userRepository, never()).save(any(User.class));
    }
}