const $root = $("#root");

export async function renderNavbar() {
    let html = `
  <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
          <a class="navbar-item" href="index.html">
              <img src="../media/learnscaping_logo.png" width="210">
          </a>

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarInfo">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
          </a>
      </div>
      <div id="navbarInfo" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item" href="studentHome/studentHome.html">
              Student Home
          </a>
          <a class="navbar-item" href="instructorHome/instructorHome.html">
              Instructor Home
          </a>
          <a class="navbar-item" href="">
            About
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

    return html;
}

export async function renderPage() {
    let html = `
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

    return html;
}

export async function loadIntoDOM() {
    $root.append(await renderPage());

    // navbar burger functionality
    $(".navbar-burger").click(function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
}

$(function () {
    loadIntoDOM();
});
