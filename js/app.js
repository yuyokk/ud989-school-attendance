var view = {
  init: function() {
    this.studentsTableHeaderElem = document.getElementById('table-students-header');
    this.studentsTableElem = document.getElementById('table-students');

    this.render();
  },

  render: function() {
    var students, student, i, l;

    this.renderHeaderRow();

    students = controller.getStudents();
    for (i = 0, l = students.length; i < l; i++) {
      student = students[i];
      this.renderStudentRow(student);
    }
  },

  renderHeaderRow: function() {
    var tr, th;
    tr = document.createElement('tr');

    // student name col
    th = document.createElement('th');
    th.className = 'name-col';
    th.textContent = 'Student Name';
    tr.appendChild(th);

    for (i = 1, l = controller.getDaysCount() + 1; i < l; i++) {
      th = document.createElement('th');
      th.textContent = i + '';
      tr.appendChild(th);
    }

    // days missed col
    th = document.createElement('th');
    th.className = 'missed-col';
    th.textContent = 'Days Missed';
    tr.appendChild(th);

    this.studentsTableHeaderElem.appendChild(tr);
  },

  renderStudentRow: function(student) {
    if (!student) { return; }

    var tr, td, checkbox, daysMissed;
    // student row
    tr = document.createElement('tr');

    // name col
    td = document.createElement('td');
    td.textContent = student.name;
    tr.appendChild(td);

    // iterate all days and create a td tag with a checkbox inside
    student.daysMissed.forEach(function(dayMissed, index, days) {
      td = document.createElement('td');
      td.className = 'attend-col';
      tr.appendChild(td);

      checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.checked = dayMissed ? true : false;
      td.appendChild(checkbox);

      // handle click on checkbox
      checkbox.addEventListener('click', (function(dayMissedCopy, indexCopy, daysCopy, trCopy) {
        return function() {
          daysCopy[indexCopy] = !daysCopy[indexCopy];

          // update count row on click
          for (i = 0, l = trCopy.childNodes.length; i < l; i++) {
              if (trCopy.childNodes[i].className === 'missed-col') {
                trCopy.childNodes[i].textContent = controller.getMissedDaysCount(daysCopy);
                break;
              }
          }

          // save students within localStorage
          controller.saveStudentsToStorage();
        };
      })(dayMissed, index, days, tr));
    });

    // missed days count col
    td = document.createElement('td');
    td.className = 'missed-col';
    td.textContent = controller.getMissedDaysCount(student.daysMissed);
    tr.appendChild(td);

    this.studentsTableElem.appendChild(tr);
  }
};

var model = {
  daysCount: 7,
  students: [
    { name: 'Slappy the Frog', daysMissed: null },
    { name: 'Lilly the Lizard', daysMissed: null },
    { name: 'Paulrus the Walrus', daysMissed: null },
    { name: 'Gregory the Goat', daysMissed: null },
    { name: 'GrAdam the Anacondat', daysMissed: null }
  ]
};

var controller = (function() {
  var STORE_NAME = 'attendance';

  function init() {
    initModel();

    view.init();
  }

  function initModel() {
    var attendance = getStudentsFromStorage();

    if (!attendance) {
      generatingNewStudentsList();
    } else {
      model.students = attendance;
    }
  }

  function getStudents() {
    return model.students;
  }

  function saveStudentsToStorage() {
    var students = controller.getStudents();
    localStorage.setItem(STORE_NAME, JSON.stringify(students));
  }

  function getStudentsFromStorage() {
    var data = localStorage.getItem(STORE_NAME);

    return data ? JSON.parse(data) : null;
  }

  function generatingNewStudentsList() {
    model.students.forEach(function(student) {
      var i;
      var daysCount = getDaysCount();

      // initialize an empty object
      student.daysMissed = [];

      for (i = 0; i < daysCount; i++) {
        student.daysMissed.push(Math.random() < 0.5);
      }
    });

    // store data within localStorage
    saveStudentsToStorage();
  }

  function getMissedDaysCount(daysMissed) {
    if (!daysMissed) { return 0; }

    var key;
    var count = 0;

    for (key in daysMissed) {
      if (daysMissed.hasOwnProperty(key) && daysMissed[key]) {
        count++;
      }
    }

    return count;
  }

  function getDaysCount() {
    return model.daysCount || 7;
  }

  // public methods
  return {
    init: init,
    getDaysCount: getDaysCount,
    getStudents: getStudents,
    getMissedDaysCount: getMissedDaysCount,
    saveStudentsToStorage: saveStudentsToStorage
  };
})();

// app entry point

controller.init();
