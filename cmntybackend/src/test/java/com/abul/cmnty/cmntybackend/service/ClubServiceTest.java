package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.ClubRequest;
import com.abul.cmnty.cmntybackend.dto.ClubResponse;
import com.abul.cmnty.cmntybackend.entity.Club;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.ResourceNotFoundException;
import com.abul.cmnty.cmntybackend.repository.ClubRepository;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClubServiceTest {

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClubService clubService;

    @Test
    void createClub_Success() {
        // Arrange
        Long hostId = 1L;
        ClubRequest request = ClubRequest.builder()
                .name("Tech Club")
                .city("New York")
                .description("A test club")
                .category("Tech")
                .build();
        User mockUser = new User();
        mockUser.setId(hostId);
        mockUser.setName("John Doe");

        Club savedClub = new Club();
        savedClub.setId(10L);
        savedClub.setName("Tech Club");
        savedClub.setCity("New York");
        savedClub.setHost(mockUser);

        when(userRepository.findById(hostId)).thenReturn(Optional.of(mockUser));
        when(clubRepository.save(any(Club.class))).thenReturn(savedClub);

        // Act
        ClubResponse response = clubService.createClub(request, hostId);

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Tech Club", response.getName());
        assertEquals("John Doe", response.getHostName());
        verify(userRepository, times(1)).findById(hostId);
        verify(clubRepository, times(1)).save(any(Club.class));
    }

    @Test
    void createClub_UserNotFound_ThrowsException() {
        // Arrange
        Long hostId = 1L;
        ClubRequest request = ClubRequest.builder()
                .name("Tech Club")
                .city("New York")
                .description("A test club")
                .category("Tech")
                .build();

        when(userRepository.findById(hostId)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            clubService.createClub(request, hostId);
        });

        assertTrue(exception.getMessage().contains("Host user not found"));
        verify(clubRepository, never()).save(any(Club.class));
    }

    @Test
    void getClubsByCity_ReturnsList() {
        // Arrange
        String city = "New York";
        User host = new User();
        host.setName("John");
        
        Club club1 = new Club();
        club1.setId(1L);
        club1.setName("Club A");
        club1.setCity(city);
        club1.setHost(host);

        when(clubRepository.findByCity(city)).thenReturn(List.of(club1));

        // Act
        List<ClubResponse> responses = clubService.getClubsByCity(city);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Club A", responses.get(0).getName());
        verify(clubRepository, times(1)).findByCity(city);
    }
}
