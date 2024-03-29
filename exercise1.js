function viewAllNotes() {
  let notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";

  let notesArray = parsedNotesInLocalStorage();
  if (notesArray.length > 0) {
    for (let note of notesArray) {
      let noteInformation = JSON.parse(note);
      appendNoteToHtml(noteInformation.noteName, noteInformation.noteBody);
    }
  }
}

window.addEventListener("load", () => {
  let notesCreated = parsedNotesInLocalStorage();
  if (notesCreated) {
    viewAllNotes();
  } else {
    localStorage.setItem("Notes array", "[]");
  }
});

// ------------------------------------------
const tabEventManager = (() => {
  let tabElements = document.querySelectorAll(".tab-able");
  tabElements.forEach((element) => {
    element.addEventListener("keydown", function (event) {
      if (event.key === "Tab") {
        event.preventDefault();
        // Commands to retrieve the position
        // of the noteBody selection
        const start = element.selectionStart;
        const end = element.selectionEnd;

        // Commands to separate the noteBody before
        // and after the noteBody selection
        const inputText = element.value;
        let textBefore = inputText.substring(0, start);
        let textAfter = inputText.substring(end, inputText.length);

        // Insertion of the tab character:
        element.value = textBefore + "\t" + textAfter;

        // Commands to make the noteBody selection
        // to behave correctly:
        element.selectionStart = start + 1;
        element.selectionEnd = start + 1;
      }
    });
  });
})();

// ------------------------------------------

function appendNoteToHtml(noteName, noteBody) {
  //--------------------------------------
  //----------------INICIO----------------
  // Get the template and clone its content
  const template = document.getElementById("note-template");
  const note = template.content.cloneNode(true);

  // Set note title and body
  const noteTitle = note.querySelector(".new-note-title");
  noteTitle.textContent = noteName;
  const noteText = note.querySelector(".new-note-text");
  noteText.textContent = noteBody;

  //-----------------FIN------------------
  //--------------------------------------

  // DELETE BUTTON:
  const deleteButton = note.querySelector(".noteButton:nth-child(1)");
  // Delete functionality:
  deleteButton.onclick = function () {
    //FEEDBACK:
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteFromLocalStorage(noteName);
      viewAllNotes();
    }
  };
  //--

  // MODIFY BUTTON:
  const modifyButton = note.querySelector(".noteButton:nth-child(2)");
  // Modify functionality
  modifyButton.onclick = function () {
    let buttonCreate = document.getElementById("button-create");
    buttonCreate.onclick = function () {
      alert("Finish modifying note");
    };

    let buttons = Array.from(document.getElementsByClassName("noteButton"));
    buttons.forEach((element) => {
      element.style.visibility = "hidden";
    });

    //--
    let title = document.getElementById("modify-title");
    let textElement = document.getElementById("edit-note");
    title.textContent = noteName;
    textElement.value = noteBody;
  };
  //--
  // INFORMATION BUTTON:
  const informationButton = note.querySelector(".noteButton:nth-child(3)");
  // info functionality
  informationButton.onclick = function () {
    for (let note of parsedNotesInLocalStorage()) {
      if (note.includes(noteName)) {
        note = JSON.parse(note);
        alert(
          "Created: " +
            note.creationDate +
            "\nLast modification: " +
            note.modificationDate
        );
      }
    }
  };

  //--------------------------------------
  //----------------INICIO----------------
  // Append note to the container in DOM
  const notesContainer = document.getElementById("notes-container");
  notesContainer.appendChild(note);
  //-----------------FIN------------------
  //--------------------------------------
}
// ------------------------------------------
// createNewNote() is used to define the title and body
// of a note, and then append to the HTML
function createNewNote() {
  let noteBody = document.getElementById("new-note");
  let noteName = document.getElementById("note-name");
  let isTheNameEmpty = (() => noteName.value === "")();

  if (isTheNameEmpty) {
    alert("Choose a title");
  } else if (isTheNameTaken(noteName.value)) {
    alert("Name already taken. Chose another name");
  } else {
    let date = new Date();
    date = String(date).substring(0, 24);

    let noteInformation = {
      noteName: noteName.value,
      creationDate: date,
      modificationDate: date,
      noteBody: noteBody.value,
    };
    let noteInJsonFormat = JSON.stringify(noteInformation);

    appendNoteToHtml(noteInformation.noteName, noteInformation.noteBody);

    let notesStoredInLocalStorage = parsedNotesInLocalStorage();
    notesStoredInLocalStorage.push(noteInJsonFormat);
    updateLocalStorage(notesStoredInLocalStorage);

    noteBody.value = "";
    noteName.value = "";
  }
}

// ------------------------------------------
function isTheNameTaken(noteName) {
  if (noteName === "") {
    return 0;
  }
  let notesStoredInLocalStorage = parsedNotesInLocalStorage();

  for (let note of notesStoredInLocalStorage) {
    if (note.includes(noteName)) {
      return true;
    }
  }
  return false;
}

// ------------------------------------------
function deleteNoteFromLocalStorage(noteName) {
  let notesStoredInLocalStorage = parsedNotesInLocalStorage();

  for (let note of notesStoredInLocalStorage) {
    if (note.includes(noteName)) {
      let indexOfNoteToDelete = notesStoredInLocalStorage.indexOf(note);
      notesStoredInLocalStorage.splice(indexOfNoteToDelete, 1);
      updateLocalStorage(notesStoredInLocalStorage);
    }
  }
}

// ------------------------------------------
function updateLocalStorage(notesArray) {
  notesArray = JSON.stringify(notesArray);
  localStorage.setItem("Notes array", notesArray);
}
// ------------------------------------------
function parsedNotesInLocalStorage() {
  return JSON.parse(localStorage.getItem("Notes array"));
}
// ------------------------------------------

function saveChanges() {
  let buttonCreate = document.getElementById("button-create");
  buttonCreate.onclick = function () {
    createNewNote();
  };
  let notesStoredInLocalStorage = parsedNotesInLocalStorage();
  if (notesStoredInLocalStorage.length > 0) {
    let title = document.getElementById("modify-title");
    let textElement = document.getElementById("edit-note");
    let newNotesArray = [];

    for (let note of notesStoredInLocalStorage) {
      if (note.includes(title.textContent)) {
        note = JSON.parse(note);
        note.noteBody = textElement.value;
        let date = new Date();
        note.modificationDate = String(date).substring(0, 24);
        note = JSON.stringify(note);
        newNotesArray.push(note);
      } else {
        newNotesArray.push(note);
      }
    }

    updateLocalStorage(newNotesArray);
    viewAllNotes();

    title.textContent = "Note to modify";
    textElement.value = "";
  }
}
