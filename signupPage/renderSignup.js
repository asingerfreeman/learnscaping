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
                        <h1 class="title is-spaced">Sign Up</h1>

                        <div id="message" class="subtitle" style="color: red">Please do not use your official UNC login or any login related to highly sensitive data.</div>

                          <div class="field">
                              <label for="" class="label">Username</label>
                              <div class="control has-icons-left">
                                  <input id="username" type="username" placeholder="e.g. bobsmith" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-user"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <label for="" class="label">Password</label>
                              <div class="control has-icons-left">
                                  <input id="password" type="password" placeholder="*******" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-lock"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <label for="" class="label">Re-enter Password</label>
                              <div class="control has-icons-left">
                                  <input id="reenterPassword" type="password" placeholder="*******" class="input" required>
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

export async function handleSignupButtonPress(event) {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let reenterPassword = document.getElementById("reenterPassword").value;

    //check if password and reenterPassword match
    if (password !== reenterPassword) {
        event.preventDefault();
        $("#message").replaceWith(
            `<div id="message" class="subtitle" style="color: red">Reenter password does not match.</div>`
        );

        return;
    }

    try {
        const result = await axios({
            method: "post",
            url: "http://localhost:8080/createlogin",
            data: {
                username: username,
                password: password,
            },
        });

        console.log(result);
    } catch (error) {
        event.preventDefault();

        //DEBUG CODE
        console.log(error);
        //for dev purposes. DELETE BEFORE DEPLOY **************
        $("#errorMessage").replaceWith(
            `<div id="message" class="subtitle" style="color: red">An Error was thrown.</div>`
        );
    }
}

export async function loadIntoDOM() {
    const $root = $("#root");

    renderBody();

    $root.append(await renderBody());

    $root.on("click", "#signupButton", handleSignupButtonPress);
}

$(function () {
    loadIntoDOM();
});
