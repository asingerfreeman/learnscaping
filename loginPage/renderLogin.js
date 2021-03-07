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
                            <label for="" class="checkbox">
                            <input type="checkbox">
                                Remember me
                            </label>
                        </div>
                        <div class="field">
                            <button class="button is-info">
                                Login
                            </button>
                            <div>
                                <a href="signup.html"> Don't have an account? Sign up here!</a>
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

export async function loadIntoDOM() {
  const $root = $("#root");

  renderBody();

  $root.append(await renderBody());
}

$(function () {
  loadIntoDOM();
});
