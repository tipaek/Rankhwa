package com.rankhwa.backend.repository;

import com.rankhwa.backend.model.ListItem;
import com.rankhwa.backend.model.ListItemPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListItemRepository extends JpaRepository<ListItem, ListItemPK> {
    int countByListId(Long listId);
}
