export async function renderNavbar() {
  let html = `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item">
                <img src="/media/learnscaping_logo.png" width="210">
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item">
                    Home
                </a>

                <a class="navbar-item">
                    Tool Box
                </a>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                    More
                </a>

                <div class="navbar-dropdown">
                    <a class="navbar-item">
                        Courses
                    </a>
                    <a class="navbar-item">
                        Instructor
                    </a>
                    <a class="navbar-item">
                        Help
                    </a>
                </div>
            </div>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    </div>
    </nav> `;

  return html;
}

export async function renderBody() {
  let html = `
    <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
            ${await renderCourses()}
        </div>
      </div>
    </div>
    </section>
    `;

  return html;
}

export async function renderCourses() {
  let html = `
        <h1 class="title">Courses (example section for trainee)</h1>
    `;

  return html;
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
}

$(function () {
  loadIntoDOM();
});
