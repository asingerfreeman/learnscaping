export async function renderBody() {
    return ` 
  <section class="hero is-light is-fullheight">
    <div class="hero-body">
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-5-tablet is-4-desktop is-3-widescreen">
                    
                    <div class="has-text-centered">
                        <img class="login-logo" src="../media/learnscaping_logo.png">
                    </div>

                    <form action="" class="box">
                        <h1 class="title is-spaced">Log In</h1>

                        <div id = "errorMessage">
                        </div>

                        <div class="field">
                            <label for="" class="label">Email</label>
                            <div class="control has-icons-left">
                                <input id="email" type="email" placeholder="e.g. bobsmith@live.unc.edu" class="input" required>
                                <span class="icon is-small is-left">
                                    <i class="fa fa-envelope"></i>
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
                            <button type="submit" class="button is-info" id="loginButton">
                                Log In
                            </button>
                            <div>
                                <a href="../signupPage/signup.html"> Don't have an account? Sign up here!</a>
                            </div>
                            <div>
                                <a href=""> Forgot your password?</a>
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

export async function handleLoginButtonPress(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;

            // ************* TODO: ADD REDIRECT TO CORRESPONDING HOMEPAGE *******************
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            // error handling
            if (errorCode === "auth/user-not-found") {
                $("#errorMessage").replaceWith(
                    `<div id="errorMessage" class="subtitle" style="color: red">User not found.</div>`
                );
            } else if (errorCode === "auth/invalid-email") {
                $("#errorMessage").replaceWith(
                    `<div id="errorMessage" class="subtitle" style="color: red">Invalid email.</div>`
                );
            } else if (errorCode === "auth/wrong-password") {
                $("#errorMessage").replaceWith(
                    `<div id="errorMessage" class="subtitle" style="color: red">Password is incorrect.</div>`
                );
            }
        });
}

export async function loadIntoDOM() {
    const $root = $("#root");

    renderBody();

    $root.append(await renderBody());

    $root.on("click", "#loginButton", handleLoginButtonPress);
}

$(function () {
    loadIntoDOM();
});
