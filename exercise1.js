// ------------------------------------------
// newNote() is a function is used to generate the
// note in the HTML. It creates a note with:
// 1- Title
// 2- Body
// 3- Buttons: delete, modify information
// It also gives functionallity to the buttons
function appendNoteToHtml(name, text) {
  //----------- START: NOTE STYLE----------

  let note = document.createElement("div");
  note.setAttribute(
    "style",
    "margin: 0 0 5px;" +
      "padding: 0;" +
      "background-color: #ecf87f;" +
      "width: 200px;" +
      "height: 200px;" +
      "display: flex;" +
      "flex-direction: column;" +
      "align-items: center;"
  );
  //------------ END: NOTE STYLE-----------

  //---------- START: NOTE CONTENT ----------
  // TITLE:
  let noteTitle = document.createElement("h3");
  noteTitle.setAttribute("style", "margin: 0;");
  noteTitle.innerHTML = name;

  // BODY
  let noteText = document.createElement("p");
  noteText.setAttribute(
    "style",
    "margin: 0 0 5px; height:140px; overflow: hidden;"
  );
  noteText.innerHTML = text.substring(48);
  //----------- END: NOTE CONTENT -----------

  //----------- START: NOTE BUTTONS----------
  // BUTTON CONTAINER:
  let noteMenu = document.createElement("div");
  //--

  // DELETE BUTTON:
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  // Delete functionality:
  deleteButton.onclick = function () {
    localStorage.removeItem(name);
    viewAllNotes();
  };
  deleteButton.style = "margin-right: 5px";
  //--

  // MODIFY BUTTON:
  let modifyButton = document.createElement("button");
  modifyButton.innerHTML = "Modify";
  // Modify functionality
  modifyButton.onclick = function () {
    let title = document.getElementById("modify-title");
    let texto = document.getElementById("edit-note");
    title.innerHTML = name;
    texto.innerHTML = text.substring(48);
  };
  //--
  // INFORMATION BUTTON:
  let informationButton = document.createElement("button");
  informationButton.innerHTML = "Info";
  informationButton.style = "margin-left: 5px";
  // info functionality
  informationButton.onclick = function () {
    let rawInfo = localStorage.getItem(name);
    let creation = rawInfo.substring(0, 24);
    let lastModified = rawInfo.substring(24, 48);
    alert("Created: " + creation + "\nLast modification: " + lastModified);
  };
  //--
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
// viewAllNotes() is used to view all the notes made by the user
function viewAllNotes() {
  if (Object.keys(localStorage).length === 0) {
    alert("No notes");
  }
  let notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";
  let noteInf = Object.entries(localStorage);

  for (elmnt of noteInf) {
    appendNoteToHtml(elmnt[0], elmnt[1]);
  }
}
// ------------------------------------------
// saveChanges() is used to save the changes when user modify a note
function saveChanges() {
  if (Object.keys(localStorage).length > 0) {
    let title = document.getElementById("modify-title");
    let texto = document.getElementById("edit-note");
    let content = localStorage.getItem(title.innerHTML);
    let creationDate = content.substring(0, 24);
    let modificationDate = new Date();
    modificationDate = String(modificationDate).substring(0, 24);

    localStorage.setItem(
      title.innerHTML,
      creationDate + modificationDate + texto.value
    );
    title.innerHTML = "Note to modify";
    texto.value = "";
    viewAllNotes();
  }
}
