export async function renderBody() {
  return ` 
    <section class="hero is-light is-fullheight">
      <div class="hero-body">
          <div class="container">
              <div class="columns is-centered">
                  <div class="column is-5-tablet is-4-desktop is-4-widescreen">
                      
                      <div class="has-text-centered">
                          <img class="login-logo" src="../media/learnscaping_logo.png">
                      </div>
  
                      <form action="" class="box">
                        <h1 class="title">Sign Up</h1>
                          <div class="field">
                              <label for="" class="label">Username</label>
                              <div class="control has-icons-left">
                                  <input type="username" placeholder="e.g. bobsmith" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-user"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <label for="" class="label">Password</label>
                              <div class="control has-icons-left">
                                  <input type="password" placeholder="*******" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-lock"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <label for="" class="label">Re-enter Password</label>
                              <div class="control has-icons-left">
                                  <input type="reenter password" placeholder="*******" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-lock"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <button class="button is-info" id="signupButton">
                                  Sign Up
                              </button>
                              <div>
                                  <a href="../loginPage/login.html"> Already have an account? Log in here!</a>
                              </div>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </section>
      `;
}

export async function handleSignupButtonPress(event) {}

export async function loadIntoDOM() {
  const $root = $("#root");

  renderBody();

  $root.append(await renderBody());

  $root.on("click", "#signupButton", handleSignupButtonPress);
}

$(function () {
  loadIntoDOM();
});
