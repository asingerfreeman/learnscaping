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
    
                    <a class="navbar-item" href="../coursesPage/courses.html">
                      Courses
                    </a>
    
                    <a class="navbar-item" href="toolBox.html">
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
  let bed = "Bed";
  let trees = "Trees";
  let shrubs = "Shrubs";
  let plantID = "Plant ID";
  return `
        <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-one-quarter">
                ${await renderTool(bed)}
            </div>
            <div class="column is-one-quarter">
                ${await renderTool(trees)}
            </div>
            <div class="column is-one-quarter">
                ${await renderTool(shrubs)}
            </div>
            <div class="column is-one-quarter">
                ${await renderTool(plantID)}
            </div>
          </div>
        </div>
        </section>
        `;
}

export async function renderTool(title) {
  return `
  <div class="card">
  <div class="card-image">
    <figure class="image is-4by3">
      <img src="https://images.fineartamerica.com/images-medium-large-5/unc-old-well-in-spring-bloom-jeff-pittman.jpg" alt="Old Well placeholder image">
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <a class="title is-4">${title}</a>
      </div>
    </div>
  </div>
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
