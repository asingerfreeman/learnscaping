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
  <h2 class="title">Assigned Courses</h2>
    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Landscape Installation</strong>
                        <br>
                        Introduction to Landscape Installation
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-success">Complete</span>
                <span class="tag is-warning">Assigned</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="100" max="100">100%</progress>
    </div>

    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Landscape Maintenance</strong>
                        <br>
                        Introduction to Landscape Maintenance
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-light">In Progress</span>
                <span class="tag is-warning">Assigned</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="30" max="100">30%</progress>
    </div>
  </div>

<div class="box">
  <h2 class="title">Unassigned Courses</h2>
    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Equipment Maintenance</strong>
                        <br>
                        Introduction to Equipment Maintenance
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-success">Complete</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="100" max="100">100%</progress>
    </div>

    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Turf Maintenance</strong>
                        <br>
                        Introduction to Turf Maintenance
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-light">In Progress</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="10" max="100">30%</progress>
    </div>

    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Pesticides</strong>
                        <br>
                        Introduction to Pesticides
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-info">Not Started</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="0" max="100">30%</progress>
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
}

$(function () {
  loadIntoDOM();
});
