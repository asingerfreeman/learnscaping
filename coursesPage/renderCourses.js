export async function renderNavbar() {
  return `
      <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
              <a class="navbar-item" href="../index.html">
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
                  <a class="navbar-item" href="../index.html">
                      Home
                  </a>
  
                  <a class="navbar-item" href="courses.html">
                    Courses
                  </a>
  
                  <a class="navbar-item" href="../toolBoxPage/toolBox.html">
                      Tool Box
                  </a>
          </div>
  
          <div class="navbar-end">
              <div class="navbar-item">
                  <div class="buttons">
                      <a class="button is-success">
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
}

export async function renderBody() {
  return `
      <section class="section">
      <div class="container">
            <h1 class="title">Courses</h1>
            ${await renderCourses()}
      </div>
      </section>
      `;
}

export async function renderCourses() {
  return `
    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Example Course 1</strong>
                        <br>
                        Intro to plant identification.
                    </p>
                </div>
            </div>
            <div class="media-right">
                <p>Completed</p>
            </div>
        </article>
    </div>

    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Example Course 2</strong>
                        <br>
                        Advanced Tree Care.
                    </p>
                </div>
            </div>
            <div class="media-right">
                <p>Not Started</p>
            </div>
        </article>
    </div>
  `;
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
