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
    return `
    <section class="section">
        <div class="container">
            <h1 class="title">Create Test</h1>
            <form class="box">
                ${await renderQuestionForm()}
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

export async function renderQuestionForm() {
    return `
    <div class="box">
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
    </div>`;
}

export async function renderPage() {
    let html = await renderNavbar();

    html += await renderBody();

    return html;
}

export async function loadIntoDOM() {
    const $root = $("#root");

    renderPage();

    $root.append(await renderPage());

    //**************** TODO: Add button functionality ************************************************/
}

$(function () {
    loadIntoDOM();
});
