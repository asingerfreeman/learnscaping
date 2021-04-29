/**
 * Authors: Aaron Zhang, Garrett Olcott
 * Summary: Landing page for Learnscaping. Displays links to About, Login, and signup.
 */

const $root = $("#root");

export async function renderNavbar() {
    let html = `
  <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
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
        <a class="navbar-item icon-text nav-item" href="../index.html">
        <span class="icon">
            <i class="fas fa-home"></i>
        </span>
        <span>&nbspHome</span>
    </a>
    <a class="navbar-item icon-text nav-item" href="/aboutPage/about.html">
        <span class="icon">
            <i class="fab fa-pagelines"></i>
        </span>
        <span>About</span>
    </a>
        </div>

      <div class="navbar-end">
        <div class="navbar-item">
            <div class="buttons">
              <a class="button is-success" href="loginPage/login.html">
                <strong>Log In</strong>
              </a>
              <a class="button is-info" href="signupPage/signup.html">
                  <strong>Sign Up</strong>
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
