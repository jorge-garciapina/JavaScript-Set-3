//----------- START: CREATION OF THE DIVS-----------
// -newDiv- creates a new div and append it to the HTML.
function newDiv() {
  // Step 1: creation of the div
  let newDivInDom = document.createElement("div");
  // Step 2: default style for the created divs.
  newDivInDom.setAttribute(
    "style",
    "width: 300px;" +
      "height: 300px;" +
      "border: solid;" +
      "border-color: rgb(255, 0, 40);" +
      "background-color:rgb(255,0,0);" +
      "position: absolute;" +
      "top: 300px;" +
      "left: 0px;"
  );

  // Step 3: append the divs to the container (in HTML).
  let parent = document.getElementById("container");
  parent.appendChild(newDivInDom);

  // Step 4: Once the div in the HTML, we provided it with
  // the drag and Drop functionallity.
  dragAndDrop(newDivInDom);
}
// ----------- END: CREATION OF THE DIVS-----------

//----------- START: DRAG AND DROP -----------
function dragAndDrop(element) {
  //----------- START: PROPERTIES -----------
  // In this object the code saves all the properties that
  // will be modified.
  // For everyone of these entries there is a slider.
  // After some try and error I decided to put the -properties-
  // object inside the dragAndDrop function; by doing so, the
  // code creates a closure, this is very helpful
  // because every new div is independent from one another.
  let properties = {
    height: 300,
    width: 300,
    radius: 0,
    thickness: 1,
    background: 0,
    border: 40,
    globalTop: 300,
    globalLeft: 0,
  };

  // -hasenter- and -counter- are two variables that will be used
  // to indicate when the div is inside the "modification area"
  let hasEnter = false;
  // -counter- allow the div to move inside the modification area
  // without creating a new set of slider for every pixel of movement
  let counter = 0;
  //-----------  END: PROPERTIES -----------

  //----------- START: MOUSE EVENTS -----------
  // Depending on what the user does with the mouse, here, the code calls
  // the function dragMovement defined below.
  // The code is interested in 2 events: -mousedown- and -mousemove-
  // neverthless -mousemove- is activated only after -mousedown-
  element.addEventListener("mousedown", (data) => {
    element.addEventListener("mousemove", dragMovement);
  });
  element.addEventListener("mouseup", (data) => {
    element.removeEventListener("mousemove", dragMovement);
  });
  //----------- END: MOUSE EVENTS -----------

  //----------- START: MOVEMENT CONTROL -----------
  // -dragMovement- is called when the event -mousedown- is activated.
  // This function is called when a change in position occur. So, it is
  // called everytime the mouse move 1 unit of distance (in my case, pixels)
  // It called by an event listener.
  // -data- is the value provided by the event listener applied to: -mousemove-
  // This function has 2 main functions:
  // 1) It moves the div according to the movement applied from the user.
  // 2) Evaluates if the div is inside the modification area, if so, it
  // creates the sliders that will control the div's properties.
  function dragMovement(data) {
    // Variable definitions
    // -controlsContainer- is the div in HTML that will be the parent
    // container for the sliders.
    let controlsContainer = document.getElementById("controls");

    // -styles-, -top- and -left- are values extracted from the div
    // created by the function -newDiv- defined above.
    let styles = getComputedStyle(element);
    let top = parseInt(styles.top);
    let left = parseInt(styles.left);

    // -data.movementX- and -data.movementY- evaluates the movement
    // of the mouse. By adding those values to the properties
    // of the div, the div moves relative to the mouse.
    properties["globalTop"] = top + data.movementY;
    properties["globalLeft"] = left + data.movementX;

    //----------- START: MOVEMENT STATES -----------
    // There are three different states:
    // STATE 1: The element is outside the modification region
    // and has never entered to that region
    if (properties["globalLeft"] <= 1100 && hasEnter === false) {
      // Outsite the modification region, the div must have the same
      // dafault style as was defined in -newDiv-
      element.setAttribute(
        "style",
        "width: 300px;" +
          "height: 300px;" +
          "border: solid;" +
          "border-color: rgb(255, 0, 40);" +
          "background-color:rgb(255,0,0);" +
          "position: absolute;" +
          "top:" +
          String(properties["globalTop"]) +
          "px;" +
          "left:" +
          String(properties["globalLeft"]) +
          "px;"
      );
    }
    // STATE 2: The element is inside the modification region
    // properties["globalLeft"] > 1100 => for the horizontal position
    else if (properties["globalLeft"] > 1100) {
      hasEnter = true;
      // Inside the modification region, the style of the div
      // is no longer fixed, because the properties are now controlled
      // by the slider. -stylesFunction- initiates the communication between
      // the properties of the div and the values of the sliders.
      stylesFunction(element);

      //----------- START: CREATION OF THE SLIDERS -----------
      // Sliders are created when div is inside the modification region.
      // properties["globalTop"] > 250  => for the vertical position
      if (properties["globalTop"] > 250) {
        // without -counter === 1- a new set of sliders would be created
        // every pixel of movement, this guarantees, only 1 set os sliders
        // is created.
        if (counter === 1) {
          // This is to control de sliders "oninput"
          appendSlider(
            element,
            controlsContainer,
            "width",
            0,
            550,
            properties["width"]
          );
          appendSlider(
            element,
            controlsContainer,
            "height",
            0,
            550,
            properties["height"]
          );
          appendSlider(
            element,
            controlsContainer,
            "radius",
            0,
            300,
            properties["radius"]
          );
          appendSlider(
            element,
            controlsContainer,
            "background",
            0,
            255,
            properties["background"]
          );
          appendSlider(
            element,
            controlsContainer,
            "thickness",
            1,
            100,
            properties["thickness"]
          );
          appendSlider(
            element,
            controlsContainer,
            "border",
            0,
            255,
            properties["border"]
          );
        }
        // Every pixel of movement the code increases the value of the counter
        // this guarantees only one set of sliders is created.
        counter++;
      }
      //----------- END: CREATION OF THE SLIDERS -----------
    }
    // STATE 3: The element is outside the modification region,
    // but has been there in the past
    else if (
      properties["globalLeft"] <= 1100 ||
      properties["globalTop"] <= 250
    ) {
      //If we pull the div out of the modification area
      // counter restarts
      counter = 0;

      stylesFunction(element);
      // Everytime the element leaves the modification region, the sliders
      // are deleted from the DOM.
      while (controlsContainer.firstChild) {
        controlsContainer.removeChild(controlsContainer.firstChild);
      }
    }
    //-----------  END: MOVEMENT STATES -----------
  }
  //-----------  END: MOVEMENT CONTROL -----------

  //-stylesFunction- initiates the communication between
  // the properties of the div and the values of the sliders.
  function stylesFunction(domElement) {
    domElement.setAttribute(
      "style",
      "position: absolute;" +
        "top:" +
        String(properties["globalTop"]) +
        "px;" +
        "left:" +
        String(properties["globalLeft"]) +
        "px;" +
        "background-color: red;" +
        "border-radius:" +
        String(properties["radius"]) +
        "px;" +
        "width:" +
        String(properties["width"]) +
        "px;" +
        "height:" +
        String(properties["height"]) +
        "px;" +
        "background-color:rgb(255, 0, " +
        String(properties["background"]) +
        ");" +
        "border: solid;" +
        "border-width:" +
        String(properties["thickness"]) +
        "px;" +
        "border-color:rgb(0, " +
        String(properties["border"]) +
        ",0);"
    );
  }

  // -appendSlider- creates a new slider, with the min, max and initial values
  // provided by the user.
  function appendSlider(divName, parent, propertyName, min, max, initial) {
    // The code create the slider with the values provided by the
    // user
    let sliderLabel = document.createElement("label");
    sliderLabel.innerHTML = propertyName;
    let slider = document.createElement("input");
    slider.type = "range";
    slider.name = propertyName;
    slider.id = propertyName;
    slider.min = min;
    slider.max = max;
    slider.value = initial;

    // The code appends the slider to the DOM
    parent.appendChild(sliderLabel);
    parent.appendChild(slider);

    // Now the code extracts the information from the slider
    // in order to control the element:
    let propertyControl = document.getElementById(propertyName);
    propertyControl.oninput = () => {
      properties[propertyName] = propertyControl.value;
      stylesFunction(divName);
    };
  }
}

// ----------- END: DRAG AND DROP-----------
