const $root = $("#root");

export async function renderNavbar() {
    let html = `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="../index.html">
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
                <a class="navbar-item" href="about.html">
                    About
                </a>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-success" href="../loginPage/login.html">
                            <strong>Log In</strong>
                        </a>
                        <a class="button is-light" href="../signupPage/signup.html">
                            <strong>Sign Up</strong>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav> `;

    // navbar burger functionality
    $(".navbar-burger").click(function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    return html;
}

export async function renderBody() {
    $root.append(`
    <section class="hero is-medium has-background" style="background:hsl(0, 0%, 96%)">
        <div class="hero-head">
            ${await renderNavbar()}
        </div>
        <div class="hero-body">
            <div class="container has-text-centered">
                <img src="../media/learnscaping_logo.png" width="1000">
                <p class="subtitle">
                    UNC Grounds Training Platform
                </p>
            </div>
        </div>
    </section>
    <section class="section is-medium" style="background:hsla(204, 86%, 90%, 1)">
        <div class="container">
            <h1 class="title is-2">
                Our Concept
                &nbsp;
                <span class="icon">
                    <i class="fa fa-tree"></i>
                </span>
            </h1>
            <h2 class="subtitle">
                A project that seeks to enhance the training of UNC Grounds employees
            </h2>
            <div clasas="block">
                <p>
                    With 760 acres of managed land, maintaining UNC Chapel Hill's campus in all four seasons is no easy task. 
                    To present a uniform and professional image to the world, UNC's landscaping professionals must be coordinated and efficient. 
                    Therefore, all members of UNC Grounds Services must receive uniform, high quality, and thorough training. 
                    Our mission is to bring a comprehensive and easy-to-use online training portal to serve the diverse team behind our beautiful campus.
                </p>
            </div>
        </div>
    </section>
    <section class="section is-medium" style="background:hsl(0, 0%, 96%)">
        <div class="container">
            <h1 class="title is-2">
                Project Leaders
                &nbsp;
                <span class="icon">
                    <i class="fa fa-book"></i>
                </span>
            </h1>
            <div class="block">
                <h1 class="title is-5">Mark Moon</h1>
                <p>Insert information about Mr. Mark Moon here.</p>
            </div>
            <div class="block">
                <h1 class="title is-5">Michelle Bowen</h1>
                <p>Insert information about Ms. Bowen here.</p>
            </div>
        </div>
    </section>
    <section class="section is-medium" style="background:hsla(204, 86%, 90%, 1)">
        <div class="container">
            <h1 class="title is-2">
                The Dev Team
                &nbsp;
                <span class="icon">
                    <i class="fa fa-laptop"></i>
                </span>
            </h1>
            <div class="block">
                <h1 class="title is-5">Ari Singer-Freeman</h1>
                <p>Insert information about Ari here.</p>
            </div>
            <div class="block">
                <h1 class="title is-5">Ben Rosenberger</h1>
                <p>Insert information about Ben here.</p>
            </div>
            <div class="block">
                <h1 class="title is-5">Garrett Olcott</h1>
                <p>Insert information about Garrett here.</p>
            </div>
            <div class="block">
                <h1 class="title is-5">Aaron Zhang</h1>
                <p>Insert information about Aaron here.</p>
            </div>
        </div>
    </section>  
    `);
}

export async function loadIntoDOM() {
    await renderBody();
}

$(function () {
    loadIntoDOM();
});
