package com.rankhwa.backend.controller;

import com.rankhwa.backend.dto.AddItemRequest;
import com.rankhwa.backend.dto.CreateListRequest;
import com.rankhwa.backend.dto.ListDetail;
import com.rankhwa.backend.dto.ListSummary;
import com.rankhwa.backend.model.ListEntity;
import com.rankhwa.backend.model.User;
import com.rankhwa.backend.service.ListService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lists")
@RequiredArgsConstructor
public class ListController {
    private final ListService listService;

    @GetMapping
    public List<ListSummary> myLists(@AuthenticationPrincipal User user) {
        return listService.all(user);
    }

    @GetMapping("/{listId}")
    public ListDetail detail(@AuthenticationPrincipal User u,
                             @PathVariable Long listId) {
        ListEntity l = listService.getOwned(u, listId);
        List<Long> ids = l.getItems().stream()
                .map(li -> li.getManhwa().getId())
                .toList();
        return new ListDetail(l.getId(), l.getName(), l.isDefault(), ids);
    }

    @PostMapping
    public ListDetail create(@AuthenticationPrincipal User user,
                             @RequestBody CreateListRequest req) {
        return listService.addList(user, req.name());
    }

    @PatchMapping("/{listId}")
    public void rename(@AuthenticationPrincipal User user,
                       @PathVariable Long listId,
                       @RequestBody Map<String, String> body) {
        listService.rename(user, listId, body.get("name"));
    }

    @DeleteMapping("/{listId}")
    public void delete(@AuthenticationPrincipal User user,
                       @PathVariable Long listId) {
        listService.delete(user, listId);
    }

    @PostMapping("/{listId}/items")
    public void add(@AuthenticationPrincipal User user,
                    @PathVariable Long listId,
                    @RequestBody AddItemRequest req) {
        listService.addItem(user, listId, req.manhwaId());
    }

    @DeleteMapping("/{listId}/items/{manhwaId}")
    public void remove(@AuthenticationPrincipal User user,
                       @PathVariable Long listId,
                       @PathVariable Long manhwaId) {
        listService.removeItem(user, listId, manhwaId);
    }
}
