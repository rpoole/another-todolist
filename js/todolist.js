'use strict';

var db = (function() {
  var listData = [];
  var list1 = {
    name: 'list1',
    active: true,
    items: ['a', 'b', 'c']
  };
  var list2 = {
    name: 'list2',
    active: false,
    items: ['e', 'f', 'g']
  };

  listData = [list1, list2];

  var obj = {};

  obj.getListData = function() {
    return listData;
  };

  obj.setListData = function(newList) {
    listData = newList;
    // save it to storage here
  };

  return obj;
})();

$(function() {
  var lists = db.getListData();

  function bindClicks() {
    $('#remove-list-button').click(function() {
      removeList($('#current-list-name').text());
    });

    $('#add-list-button').click(function() {
      addList($('#new-list-input').val());
    });

    $('#add-list-item-button').click(function() {
      addListItem($('#new-list-item-input').val());
    });

    $('.delete-item-button').on('click', function(e) {
      deleteListItem($(this).attr('listitem'));
    });
  }

  function deleteListItem(itemValue) {
    var list = _.find(lists, function(list) {
      return list.name === $('#current-list-name').text();
    });

    list.items = _.reject(list.items, function(item) {
      return item === itemValue;
    });

    $('#current-list li').each(function() {
      if ($(this).text().indexOf(itemValue) !== -1) {
        $(this).remove();
      }
    });
  }

  function addListItem(itemValue) {
    var list = _.find(lists, function(list) {
      return list.name === $('#current-list-name').text();
    });

    list.items.push(itemValue);
    layoutView();
  }

  function addList(newListName) {
    lists.push({
      name: newListName,
      active: true,
      items: []
    });
    setCurrentList(newListName);
  }

  function removeList(listName) {
    lists = _.reject(lists, function(list) {
      return list.name === listName;
    });

    setCurrentList(lists[0].name);
  }

  function layoutView() {
    $('#current-list li').remove();
    $('#other-lists li').remove();

    lists.forEach(function(list) {
      if (list.active) {
        $('#current-list-name').text(list.name);
        list.items.forEach(function(item) {
          addListELementWithDelete($('#current-list'), item, 'delete-item-button');
        });
      } else {
        var newLi = addListElement($('#other-lists'), list.name, { class: 'other-list'});
        newLi.click(function() {
          setCurrentList($(this).text());
        });
      }
    });
  }

  function setCurrentList(newCurrentName) {
    var oldCurrentName = $('#current-list-name').text();

    lists.forEach(function(list) {
      if (list.name === oldCurrentName) {
        list.active = false;
      }
      if (list.name === newCurrentName) {
        list.active = true;
      }
    });

    db.setListData(lists);
    layoutView();
  }

  function addListELementWithDelete(ul, inner, deleteClass) {
    var newListElement = '<li>' + inner + '  <a href="#" class="' + deleteClass + '" listitem="' + inner + '">x</a></li>';
    ul.append(newListElement);
  }

  function addListElement(ul, inner, attrs) {
    var newListElement = $('<li>');
    if (inner) {
      newListElement.append(inner);
    }

    if (attrs) {
      for (var attrName in attrs) {
        newListElement.attr(attrName, attrs[attrName]);
      }
    }

    ul.append(newListElement);
    return newListElement;
  }

  layoutView();
  bindClicks();
});
