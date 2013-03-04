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
  layoutView();
});

function removeList(listName) {
  var lists = db.getListData();
  lists.forEach(function(list, index) {
    if (list.name === listName) {
      lists.splice(index, 1);
      db.setListData(lists);
    }
  });

  setCurrentList(lists[0].name);
}

function layoutView() {
  var lists = db.getListData();

  $('#current-list li').remove();
  $('#other-lists li').remove();

  lists.forEach(function(list) {
    if (list.active) {
      $('#current-list-name').text(list.name);
      list.items.forEach(function(item) {
        addListElement($('#current-list'), item);
      });
    } else {
      var newLi = addListElement($('#other-lists'), list.name, { class: 'other-list'});
      newLi.click(function() {
        setCurrentList($(this).text());
      });
    }
  });

  $('#remove-list-button').click(function() {
    removeList($('#current-list-name').text());
  });
}

function setCurrentList(newCurrent) {
  var lists = db.getListData();
  var oldCurrent = $('#current-list-name').text();

  lists.forEach(function(list) {
    if (list.name === oldCurrent) {
      list.active = false;
    }
    if (list.name === newCurrent) {
      list.active = true;
    }
  });

  db.setListData(lists);
  layoutView();
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

