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
                        <h1 class="title is-spaced">Log In</h1>

                        <div id = "errorMessage">
                        </div>

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
                            <label for="" class="checkbox">
                            <input id="rememberMe" type="checkbox">
                                Remember me
                            </label>
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
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let isRemember = document.getElementById("rememberMe").value;

    try {
        const result = await axios({
            method: "post",
            url: "http://localhost:8080/login",
            data: {
                username: username,
                password: password,
                isRemember: isRemember,
            },
        });

        console.log(result);

        if (result.status == 400) {
            //if username and password are null
            event.preventDefault();
            $("#errorMessage").replaceWith(
                `<div class="subtitle" style="color: red">Please enter a username and password.</div>`
            );
        } else if (result.status == 401) {
            event.preventDefault();
            //if username doesn't exist
            $("#errorMessage").replaceWith(
                `<div class="subtitle" style="color: red">Username incorrect. Please try again.</div>`
            );
        } else if (result.status == 402) {
            event.preventDefault();
            //if password is incorrect
            $("#errorMessage").replaceWith(
                `<div class="subtitle" style="color: red">Password incorrect. Please try again.</div>`
            );
        } else {
            //if username and password are correct
            //TODO ************************

            //if role is student
            window.location.href = "../studentHome.html";

            //if role is instructor
            //window.location.href = "../instructorHome.html;"
        }
    } catch (error) {
        event.preventDefault();

        //DEBUG CODE
        console.log(error);
        //for dev purposes. DELETE BEFORE DEPLOY **************
        $("#errorMessage").replaceWith(
            `<div class="subtitle" style="color: red">An Error was thrown.</div>`
        );
    }
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
