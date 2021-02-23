export async function renderNavbar() {
  let html = `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="index.html">
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
                <a class="navbar-item" href="index.html">
                    Home
                </a>

                <a class="navbar-item">
                  Courses
                </a>

                <a class="navbar-item">
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
  return `<div class="block">
  <h1 class="title">Block 1 - Bed Preperation</h1>
  <nav class="pagination" role="navigation" aria-label="pagination">
  <a class="pagination-previous" title="This is the first page" disabled="">Previous</a>
  <a class="pagination-next">Next page</a>
  <ul class="pagination-list">
    <li class="yee">
      <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a>
    </li>
    <li>
      <a class="pagination-link" aria-label="Goto page 2">2</a>
    </li>
    <li>
      <a class="pagination-link" aria-label="Goto page 3">3</a>
    </li>
  </ul>
</nav>
<progress class="progress is-success" value="30" max="100">30%</progress>
<div class="content">
<p><strong>Good soil prep is the key to creating and maintaining successful landscape beds on campus.</strong></p>
<p>Three basic types of beds staff can expect to prepare</p>
<ul>
  <li>Brand new beds</li>
  <li>Empty beds planted during previous planting periods and requiring another preparation process</li>
  <li>Beds with existing perennials, bulbs and/or shrubs</li>
</ul>
</div>
  </div> `;
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
