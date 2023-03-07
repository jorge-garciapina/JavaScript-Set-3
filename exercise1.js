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
  //----------- START: NOTE STYLE----------

  let note = document.createElement("template");
  note.className = "note";

  //------------ END: NOTE STYLE-----------

  //---------- START: NOTE CONTENT ----------
  // TITLE:
  let noteTitle = document.createElement("h3");
  noteTitle.className = "new-note-title";
  noteTitle.textContent = noteName;

  // BODY
  let noteText = document.createElement("p");
  noteText.className = "new-note-text";
  noteText.textContent = noteBody;
  //----------- END: NOTE CONTENT -----------

  //----------- START: NOTE BUTTONS----------
  // BUTTON CONTAINER:
  let notesButtonsContainer = document.createElement("div");
  notesButtonsContainer.className = "buttonsContainer";
  //--

  // DELETE BUTTON:
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "noteButton";
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
  let modifyButton = document.createElement("button");
  modifyButton.className = "noteButton";
  modifyButton.textContent = "Modify";
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
  let informationButton = document.createElement("button");
  informationButton.className = "noteButton";
  informationButton.textContent = "Info";
  informationButton.className = "informationButton";
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
  //--S
  notesButtonsContainer.appendChild(deleteButton);
  notesButtonsContainer.appendChild(modifyButton);
  notesButtonsContainer.appendChild(informationButton);

  //------------ END: NOTE BUTTONS-----------

  // APPENDD ELEMENTS TO THE NOTE:
  note.appendChild(noteTitle);
  note.appendChild(noteText);
  note.appendChild(notesButtonsContainer);
  //--

  // APPEND NOTE TO THE CONTAINER IN DOM:
  let notesContainer = document.getElementById("notes-container");
  notesContainer.appendChild(note);
  //--
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
