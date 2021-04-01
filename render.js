let pageNum = 1;

export async function renderNavbar() {
  return `
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

                <a class="navbar-item" href="studentHome/studentHome.html">
                    Student Home
                </a>

                <a class="navbar-item" href="instructorHome/instructorHome.html">
                    Instructor Home
                </a>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-success" href="loginPage/login.html">
                        <strong>Log In</strong>
                    </a>
                    <a class="button is-light" href="signupPage/signup.html">
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    </div>
    </nav> `;
}

export async function renderPage() {
  return `
      <section class="hero is-fullheight">
        <div class="hero-head">
          ${await renderNavbar()}
        </div>
        <div class="hero-body">
          <div class="container has-text-centered">
            <p class="title is-1">
              Welcome to
            </p>
            <div class="has-text-centered">
              <img class="login-logo" src="media/learnscaping_logo.png">
            </div>
            <p class="subtitle">
              <strong>Official Training Site of UNC Grounds</strong>
            </p>
          </div>
        </div>
      </section>
  `;
}

export async function loadIntoDOM() {
  const $root = $("#root");

  renderPage();

  $root.append(await renderPage());
}

$(function () {
  loadIntoDOM();
});
