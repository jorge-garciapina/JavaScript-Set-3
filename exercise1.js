function viewAllNotes() {
  let notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";
  let noteInf = Object.entries(localStorage);

  for (elmnt of noteInf) {
    appendNoteToHtml(elmnt[0], elmnt[1]);
  }
}

window.addEventListener("load", () => {
  if (Object.keys(localStorage).length !== 0) {
    viewAllNotes();
  }
});

// ------------------------------------------
const inserTab = (() => {
  let tabElements = document.querySelectorAll(".tab-able");
  tabElements.forEach((element) => {
    element.addEventListener("keydown", function (event) {
      if (event.key === "Tab") {
        event.preventDefault();
        // Commands to retrieve the position
        // of the text selection
        const start = element.selectionStart;
        const end = element.selectionEnd;

        // Commands to separate the text before
        // and after the text selection
        const inputText = element.value;
        let textBefore = inputText.substring(0, start);
        let textAfter = inputText.substring(end, inputText.length);

        // Insertion of the tab character:
        element.value = textBefore + "\t" + textAfter;

        // Commands to make the text selection
        // to behave correctly:
        element.selectionStart = start + 1;
        element.selectionEnd = start + 1;
      }
    });
  });
})();

// ------------------------------------------

// tabElements() is a function is used to generate the
// note in the HTML. It creates a note with:
// 1- Title
// 2- Body
// 3- Buttons: delete, modify information
// It also gives functionallity to the buttons
function appendNoteToHtml(name, text) {
  //----------- START: NOTE STYLE----------

  let note = document.createElement("template");
  note.className = "note";

  //------------ END: NOTE STYLE-----------

  //---------- START: NOTE CONTENT ----------
  // TITLE:
  let noteTitle = document.createElement("h3");
  noteTitle.className = "new-note-title";
  noteTitle.textContent = name;

  // BODY
  let noteText = document.createElement("p");
  noteText.className = "new-note-text";
  noteText.textContent = text.substring(48);
  //----------- END: NOTE CONTENT -----------

  //----------- START: NOTE BUTTONS----------
  // BUTTON CONTAINER:
  let noteMenu = document.createElement("div");
  //--

  // DELETE BUTTON:
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  // Delete functionality:
  deleteButton.onclick = function () {
    //FEEDBACK:
    if (confirm("Are you sure you want to delete this note?")) {
      localStorage.removeItem(name);
      viewAllNotes();
    }
  };
  deleteButton.style = "margin-right: 5px";
  //--

  // MODIFY BUTTON:
  let modifyButton = document.createElement("button");
  modifyButton.textContent = "Modify";
  // Modify functionality
  modifyButton.onclick = function () {
    // FEEDBACK:
    //-- To make avoid deletion while note is
    // being modified.
    noteMenu.removeChild(deleteButton);
    //--
    let title = document.getElementById("modify-title");
    let textElement = document.getElementById("edit-note");
    title.textContent = name;
    textElement.value = "";
    textElement.value = text.substring(48);
    textElement.textContent = text.substring(48);
  };
  //--
  // INFORMATION BUTTON:
  let informationButton = document.createElement("button");
  informationButton.textContent = "Info";
  informationButton.style = "margin-left: 5px";
  // info functionality
  informationButton.onclick = function () {
    let rawInfo = localStorage.getItem(name);
    let creation = rawInfo.substring(0, 24);
    let lastModified = rawInfo.substring(24, 48);
    alert("Created: " + creation + "\nLast modification: " + lastModified);
  };
  //--S
  noteMenu.appendChild(deleteButton);
  noteMenu.appendChild(modifyButton);
  noteMenu.appendChild(informationButton);

  //------------ END: NOTE BUTTONS-----------

  // APPENDD ELEMENTS TO THE NOTE:
  note.appendChild(noteTitle);
  note.appendChild(noteText);
  note.appendChild(noteMenu);
  //--

  // APPEND NOTE TO THE CONTAINER IN DOM:
  let notesContainer = document.getElementById("notes-container");
  notesContainer.appendChild(note);
  //--
}
// ------------------------------------------
// createNewNote() is used to define the title and body
// of a note, and then append to the HTML
let i = 1;
function createNewNote() {
  let noteBody = document.getElementById("new-note");
  let noteName = document.getElementById("note-name");
  let date = new Date();

  date = String(date).substring(0, 24);
  if (noteName.value !== "" && noteBody.value !== "") {
    appendNoteToHtml(noteName.value, date + date + noteBody.value);
    localStorage.setItem(noteName.value, date + date + noteBody.value);
    noteBody.value = "";
    noteName.value = "";
  } else {
    alert("Missing information");
  }

  i++;
}
// ------------------------------------------

// saveChanges() is used to save the changes when user modify a note
function saveChanges() {
  if (Object.keys(localStorage).length > 0) {
    let title = document.getElementById("modify-title");
    let textElement = document.getElementById("edit-note");
    let content = localStorage.getItem(title.textContent);
    let creationDate = content.substring(0, 24);
    let modificationDate = new Date();
    modificationDate = String(modificationDate).substring(0, 24);

    localStorage.setItem(
      title.textContent,
      creationDate + modificationDate + textElement.value
    );
    title.textContent = "Note to modify";
    textElement.value = "";
  }
  viewAllNotes();
}
