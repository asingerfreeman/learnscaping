export async function renderNavbar() {
    return `
      <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
              <a class="navbar-item" href="studentHome.html">
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
  
          <div class="navbar-end">
              <div class="navbar-item">
                  <div class="buttons">
                      <a class="button is-success" href="">
                          <strong>Sign Out</strong>
                      </a>
                  </div>
              </div>
          </div>
      </div>
      </nav> `;
}

export async function renderBody() {
    let id = ID();

    return `
    <section class="section">
        <div class="container">
            <h1 class="title is-1">New Test</h1>
            <form class="box">
                ${await renderQuestionForm(id)}
                <div id="nextQuestionArea">
                </div>

                <div class="buttons">
                    <button class="button is-success">Add Question</button>
                    <button class="button">Create Test</button>
                </div>
            </form>
        </div>
    </section>
    `;
}

export async function renderQuestionForm(id) {
    return `
    <div class="box" id="${id}">
        <h1 class="title">Question</h1>
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
            <button class="button is-danger">Delete</button>
        </div>
    </div>`;
}

//Generates a random question ID
var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
};

export async function renderPage() {
    let html = await renderNavbar();

    html += await renderBody();

    return html;
}

export async function loadIntoDOM() {
    const $root = $("#root");

    $root.append(await renderPage());

    //**************** TODO: Add button functionality ************************************************/
}

$(function () {
    loadIntoDOM();
});
