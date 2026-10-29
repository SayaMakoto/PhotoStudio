package com.photostudio.service.impl;

import com.photostudio.dto.contacts.ContactRequest;
import com.photostudio.dto.contacts.ContactResponse;
import com.photostudio.model.contacts.Contact;
import com.photostudio.model.contacts.ContactStatus;
import com.photostudio.model.users.User;
import com.photostudio.repository.ContactRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository repository;
    private final UserRepository userRepository;

    public ContactServiceImpl(ContactRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private ContactResponse toResponse(Contact contact) {
        if (contact == null) return null;
        return new ContactResponse(
                contact.getId(),
                contact.getUserId(),
                contact.getFullname(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getSubject(),
                contact.getMessage(),
                contact.getStatus() != null ? contact.getStatus().name() : "pending",
                contact.getReplyMessage(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ContactResponse findById(Long id) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy liên hệ có id: " + id));
        return toResponse(contact);
    }

    @Override
    public ContactResponse create(ContactRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu liên hệ không được để trống");
        }
        request.validate();

        Contact contact = new Contact();
        contact.setFullname(request.getFullname().trim());
        contact.setEmail(request.getEmail().trim().toLowerCase());
        contact.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        contact.setSubject(request.getSubject() != null ? request.getSubject().trim() : "Tư vấn dịch vụ");
        contact.setMessage(request.getMessage().trim());
        contact.setStatus(ContactStatus.pending);

        if (request.getUserId() != null && request.getUserId() > 0) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            contact.setUser(user);
        }

        Contact saved = repository.save(contact);
        return toResponse(saved);
    }

    @Override
    public ContactResponse updateStatus(Long id, String status, String replyMessage) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy liên hệ có id: " + id));

        if (status != null && !status.isBlank()) {
            try {
                contact.setStatus(ContactStatus.valueOf(status.trim().toLowerCase()));
            } catch (IllegalArgumentException e) {
                // Giữ nguyên trạng thái nếu không khớp
            }
        }
        if (replyMessage != null) {
            contact.setReplyMessage(replyMessage.trim());
        }

        Contact updated = repository.save(contact);
        return toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy liên hệ có id: " + id);
        }
        repository.deleteById(id);
    }
}
