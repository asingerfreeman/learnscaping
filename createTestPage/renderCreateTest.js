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
                <input class="input" type="text" placeholder="Title">
            </div>
        </div>

        <button id="submitTitleButton" type="submit" class="button is-success">Submit Title</button>
    </form>
    `;
}

export async function renderAddQuestionForm() {
    return `
    <form id="replace" class="box">
        <h1 class="title">Add Question/Finish</h1>
        <div class="buttons">
            <button id="addQuestionButton" class="button is-success">Add Question</button>
            <button id="finishButton" class="button">Finish</button>
        </div>
    </form>
    `;
}

export async function renderQuestionForm() {
    return `
    <form id="replace" class="box">
        <h1 class="title">Add Question</h1>
        <div class="field">
            <label class="label">Question</label>
            <div class="control">
                <textarea class="textarea" placeholder="Question"></textarea>
            </div>
        </div>

        <div class="field">
            <label class="label">Answer A</label>
            <div class="control">
                <textarea class="textarea" placeholder="Answer" rows="1"></textarea>
            </div>

            <label class="checkbox">
            <input type="checkbox">
                Correct Answer
            </label>
        </div>
        <div class="field">
            <label class="label">Answer B</label>
            <div class="control">
                <textarea class="textarea" placeholder="Answer" rows="1"></textarea>
            </div>

            <label class="checkbox">
            <input type="checkbox">
                Correct Answer
            </label>
        </div>
        <div class="field">
            <label class="label">Answer C</label>
            <div class="control">
                <textarea class="textarea" placeholder="Answer" rows="1"></textarea>
            </div>

            <label class="checkbox">
            <input type="checkbox">
                Correct Answer
            </label>
        </div>
        <div class="field">
            <label class="label">Answer D</label>
            <div class="control">
                <textarea class="textarea" placeholder="Answer" rows="1"></textarea>
            </div>

            <label class="checkbox">
            <input type="checkbox">
                Correct Answer
            </label>
        </div>
        
        <div class="buttons is-right">
            <button id="submitQuestionButton" type="submit" class="button is-success">Submit Question</button>
            <button id="cancelButton" class="button">Cancel</button>
        </div>
    </form>`;
}

export async function renderBody() {
    return `
    <section class="section">
        <div class="container">
            <h1 class="title is-1">Create Test</h1>
            ${await renderTitleForm()}
        </div>
    </section>
    `;
}

export async function renderFinish() {
    return `
    <form id="replace" class="box">
        <h1 class="title">Test Created!</h1>
        <p>
            Please view and edit your new test from the home page.
        <p>
    </form>
    `;
}

export async function renderPage() {
    let html = await renderNavbar();

    html += await renderBody();

    return html;
}

export async function handleSubmitTitleButtonPress() {
    //*************** TODO: ADD CHECK FOR NO EMPTY TITLE ****************** */

    //************ */ TODO: ADD API CALL TO CREATE NEW TEST OBJECT WITH TITLE PARAM ******************************

    $("#replace").replaceWith(`${await renderQuestionForm()}`);
}

export async function handleSubmitQuestionButtonPress() {
    // ************ TODO: ADD CHECK FOR NO EMPTY ENTIRES AND CHECK FOR ONE CORRECT ANSWER *************************

    //************ */ TODO: ADD API CALL  ***************************************

    $("#replace").replaceWith(`${await renderAddQuestionForm()}`);
}

export async function handleCancelButtonPress() {
    $("#replace").replaceWith(`${await renderAddQuestionForm()}`);
}

export async function handleAddQuestionButtonPress() {
    $("#replace").replaceWith(`${await renderQuestionForm()}`);
}

export async function handleFinishButtonPress() {
    $("#replace").replaceWith(`${await renderFinish()}`);
}

//Generates a random question ID
var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
};

export async function loadIntoDOM() {
    const $root = $("#root");

    $root.append(await renderPage());

    //**************** TODO: Add button functionality ************************************************/
    $root.on("click", "#submitTitleButton", handleSubmitTitleButtonPress);
    $root.on("click", "#submitQuestionButton", handleSubmitQuestionButtonPress);
    $root.on("click", "#cancelButton", handleCancelButtonPress);
    $root.on("click", "#addQuestionButton", handleAddQuestionButtonPress);
    $root.on("click", "#finishButton", handleFinishButtonPress);
}

$(function () {
    loadIntoDOM();
});
