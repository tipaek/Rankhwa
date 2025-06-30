package com.rankhwa.backend.service;

import com.rankhwa.backend.repository.ListItemRepository;
import com.rankhwa.backend.repository.ListRepository;
import com.rankhwa.backend.dto.ListDetail;
import com.rankhwa.backend.dto.ListSummary;
import com.rankhwa.backend.model.ListEntity;
import com.rankhwa.backend.model.ListItem;
import com.rankhwa.backend.model.ListItemPK;
import com.rankhwa.backend.model.User;
import com.rankhwa.backend.repository.ManhwaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListService {
    private final ListRepository listRepository;
    private final ListItemRepository listItemRepository;
    private final ManhwaRepository manhwaRepository;

    private ListEntity requireOwner(User user, Long listId) {
        ListEntity l = listRepository.findById(listId).orElseThrow();
        if (!l.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return l;
    }

    public ListEntity getOwned(User user, Long listId) {
        ListEntity l = listRepository.findById(listId).orElseThrow();
        if(!l.getUser().getId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return l;
    }

    // CRUD Operations
    public List<ListSummary> all (User user) {
        return listRepository.findByUserId(user.getId()).stream()
                .map(l -> new ListSummary(
                        l.getId(), l.getName(), l.isDefault(),
                        listItemRepository.countByListId(l.getId()), l.getCreatedAt()))
                .toList();
    }

    public ListDetail addList(User user, String name) {
        if (listRepository.existsByUserIdAndName(user.getId(), name))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "List name already exists");

        ListEntity l = new ListEntity();
        l.setUser(user); l.setName(name);
        listRepository.save(l);
        return new ListDetail(l.getId(), l.getName(), false, List.of());
    }

    public void rename(User user, Long listId, String newName) {
        ListEntity l = requireOwner(user, listId);
        if(l.isDefault()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Default lists cannot be renamed");
        l.setName(newName);
        listRepository.save(l);
    }

    public void delete(User user, Long listId) {
        ListEntity l = requireOwner(user, listId);
        if(l.isDefault()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Default lists cannot be deleted");
        listRepository.delete(l);
    }

    public void addItem(User user, Long listId, Long manhwaId) {
        ListEntity l = requireOwner(user, listId);
        ListItemPK pk = new ListItemPK(listId, manhwaId);
        if (listItemRepository.existsById(pk)) return;

        ListItem li = new ListItem();
        li.setId(pk);
        li.setList(l);
        li.setManhwa(manhwaRepository.getReferenceById(manhwaId));
        listItemRepository.save(li);
    }

    public void removeItem(User user, Long listId, Long manhwaId) {
        requireOwner(user, listId);
        listItemRepository.deleteById(new ListItemPK(listId, manhwaId));
    }


    @Transactional
    public void createDefaultListsFor(User user) {
        String[] names = {"Reading","Completed","Plan to Read","Favorites"};
        for (String n : names) {
            ListEntity l = new ListEntity();
            l.setUser(user); l.setName(n); l.setDefault(true);
            listRepository.save(l);
        }
    }
}
