export async function renderNavbar() {
    return `
      <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
              <a class="navbar-item" href="../instructorHome.instructorHome.html">
                  <img src="../media/learnscaping_logo.png" width="210">
              </a>
  
              <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
              </a>
          </div>
  
          <div id="navbarBasicExample" class="navbar-menu">
              <div class="navbar-start">
                  <a class="navbar-item" href="../instructorHome.instructorHome.html">
                      Home
                  </a>
          </div>
      </div>
      </nav> `;
}

export async function renderTitleForm() {
    return `
    <form id="replace" class="box">
        <h1 class="title">Add Title</h1>
        <div class="field">
            <div class="control">
                <input id="titleValue" class="input" type="text" placeholder="Title">
            </div>
            <p id="error"></p>
        </div>
        
        <button id="submitTitleButton" type="submit" class="button is-success">Submit Title</button>
    </form>

    <article id="message" class="message">
        <div class="message-body">
            Once the title is submitted, a new course will be created. You can either complete it in its entirety through this process or return to it in the "Unfinished Courses" section on the home page.
        </div>
    </article>
    `;
}

export async function handleSubmitTitleButtonPress(event) {
    let title = document.getElementById("titleValue").value;

    // check for empty title value
    if (title.length === 0) {
        event.preventDefault();
        $("#error").replaceWith(
            `<p id="error" class="help is-danger">* A title is required</p>`
        );
        return;
    }

    //************ */ TODO: ADD API CALL TO CREATE NEW Lesson OBJECT WITH TITLE PARAM ******************************
    let course = {
        isComplete: false,
        slides: [],
        tid: null,
        title: title,
    };

    $("#replace").replaceWith(`${await renderContentForm()}`);
    $("#message").remove();
}

export async function renderContentForm() {
    return `
    <form id="replace" class="box">
        <h1 class="title">New Page</h1>

        <div class="field">
            <label class="label">Header</label>
            <div class="control">
                <input id="header" class="input" type="text" placeholder="Enter a page header">
            </div>
            <p id="headerError"></p>
        </div>

        <div class="field">
            <label class="label">Text</label>
            <div class="control">
                <textarea id="text" class="textarea" placeholder="Enter lesson text here"></textarea>
            </div>
            
            <p id="textError"></p>
        </div>

        <div class="file is-boxed">
            <label class="file-label">
                <input id="fileUpload" class="file-input" type="file" name="media" accept="image/*">
                <span class="file-cta">
                    <span class="file-icon">
                        <i class="fa fa-upload"></i>
                    </span>
                    <span class="file-label">
                        Upload an image…
                    </span>
                </span>
            </label>
        </div>
        
        <div class="buttons is-right">
            <button id="saveButton" type="submit" class="button is-success">Save</button>
            <button id="cancelButton" class="button">Cancel</button>
        </div>
    </form>`;
}

export async function handleSaveButtonPress(event) {
    event.preventDefault();

    let header = document.getElementById("header").value;
    let text = document.getElementById("text").value;
    let media = $("#fileUpload")[0].files[0];

    if (header.length === 0) {
        $("#headerError").replaceWith(
            `<p id="headerError" class="help is-danger">* Please add a header</p>`
        );

        return;
    } else if (text.length === 0) {
        $("#textError").replaceWith(
            `<p id="textError" class="help is-danger">* Please add lesson text</p>`
        );

        return;
    }

    if (media != undefined) {
        // upload to firebase
    }

    // ***************** Update firestore *******************
    let slide = {
        header: header,
        text: text,
        media: null,
    };

    $("#replace").replaceWith(`${await renderConnectorForm()}`);
}

export async function handleCancelButtonPress() {
    $("#replace").replaceWith(`${await renderConnectorForm()}`);
}

export async function renderConnectorForm() {
    return `
    <div id="replace" class="box">
        <h1 class="title">What's next?</h1>
        <div class="buttons">
            <button id="addContentButton" class="button is-success">Add Content</button>
            <button id="toTestButton" class="button">Create Test</button>
        </div>
    </div>

    <article id="message" class="message">
        <div class="message-body">
            When all lesson pages have been added, complete the course by creating a test. (*All courses must have a test)
        </div>
    </article>
    `;
}

export async function handleAddContentButtonPress() {
    $("#replace").replaceWith(`${await renderContentForm()}`);
    $("#message").remove();
}

export async function renderBody() {
    return `
    <section class="section">
        <div class="container">
            <h1 class="title is-1">Create Course</h1>
            ${await renderTitleForm()}
        </div>
    </section>
    `;
}

export async function loadIntoDOM() {
    const $root = $("#root");

    // load page
    $root.append(await renderNavbar());
    $root.append(await renderBody());

    // button functionality
    $root.on("click", "#submitTitleButton", handleSubmitTitleButtonPress);
    $root.on("click", "#saveButton", handleSaveButtonPress);
    $root.on("click", "#cancelButton", handleCancelButtonPress);
    $root.on("click", "#addContentButton", handleAddContentButtonPress);
}

$(function () {
    loadIntoDOM();
});
