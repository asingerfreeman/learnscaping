/**
 * Author: Aaron Zhang
 * Summary: Password reset page.
 */

export async function renderPage() {
    return `
    <section class="hero is-fullheight">
    <div class="hero-body">
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-5-tablet is-6-desktop is-5-widescreen">
                    
                    <div class="has-text-centered">
                        <img class="login-logo" src="../../media/learnscaping_logo.png">
                    </div>

                    <form action="" class="box">
                        <h1 class="title is-spaced">Reset Password</h1>

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
                            <button type="submit" class="button is-info" id="submitEmail">
                                Submit
                            </button>
                        </div>
                        <div class="field">
                            <div>
                                <a href="../login.html">Back to login</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>`;
}

export async function handleSubmitButtonPress(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;

    var auth = firebase.auth();

    auth.sendPasswordResetEmail(email)
        .then(function () {
            // Email sent.
            alert(`Email sent to ${email}`);
        })
        .catch(function (error) {
            // An error happened.
            alert(error);
        });
}

export async function loadIntoDOM() {
    const $root = $("#root");
    $root.append(await renderPage());

    $root.on("click", "#submitEmail", handleSubmitButtonPress);
}

$(function () {
    loadIntoDOM();
});
