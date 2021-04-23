const $root = $("#root");

export async function renderNavbar() {
    let html = `
    <nav class="navbar is-transparent" role="navigation" aria-label="main navigation" style="linear-gradient(hsl(0, 0%, 100%), hsl(0, 0%, 96%))">
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
                <a class="navbar-item icon-text" href="about.html">
                    <span class="icon">
                        <i class="fab fa-pagelines"></i>
                    </span>
                    <span>About</span>
                </a>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-success" href="../loginPage/login.html">
                            <strong>Log In</strong>
                        </a>
                        <a class="button is-info" href="../signupPage/signup.html">
                            <strong>Sign Up</strong>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav> `;

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
            <div class="section">
            <article class="media">
            <figure class="media-left">
                <p class="image is-128x128">
                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png">
                </p>
            </figure>
            <div class="media-content">
                <h1 class="title is-4">Mark Moon</h1>
                <h2 class="subtitle is-6">Title</h2>
                <p>
                    Insert information about Mr. Moon here.
                </p>
            </div>
            <nav class="level media-right">
                <div class="level-center">
                    <a class="level-item" title="LinkedIn">
                        <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-linkedin fa-lg"></i></span>
                    </a>
                </div>
            </nav>
            </article>
            </div>
            <div class="section">
            <article class="media">
            <figure class="media-left">
                <p class="image is-128x128">
                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png">
                </p>
            </figure>
            <div class="media-content">
                <h1 class="title is-4">Michele Bowen</h1>
                <h2 class="subtitle is-6">Title</h2>
                <p>
                    Insert information about Ms. Bowen here.
                </p>
            </div>
            <nav class="level media-right">
                <div class="level-center">
                    <a class="level-item" title="LinkedIn">
                        <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-linkedin fa-lg"></i></span>
                    </a>
                </div>
            </nav>
            </article>
            </div>
        </div>
    </section>
    <section class="section is-medium" style="background:hsla(204, 86%, 90%, 1)">
        <div class="container">
            <h1 class="title is-2">
                The Dev Team
                &nbsp;
                <span class="icon">
                    <i class="fa fa-laptop-code"></i>
                </span>
            </h1>
            <div class="section">
            <article class="media">
            <figure class="media-left">
                <p class="image is-128x128">
                    <img class="is-rounded" src="../media/portraits/ari.JPG">
                </p>
            </figure>
            <div class="media-content">
                <h1 class="title is-4">Ari Singer-Freeman</h1>
                <h2 class="subtitle is-6">Computer Science B.A. / Business Administration B.S. </h2>
                <p>
                    Ari is a senior graduating in May 2021. After graduation, he will be joining Morgan Stanley's Mergers and Acquisitions group in New York City. He is currently more proficient with backend development/database management but is working to improve his front-end skills.
                </p>
            </div>
            <nav class="level media-right">
                <div class="level-center">
                    <a class="level-item" title="LinkedIn" href = "https://www.linkedin.com/in/arisinger-freeman/">
                        <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-linkedin fa-lg"></i></span>
                    </a>
                    <a class="level-item" title="Github" href = "https://github.com/asingerfreeman">
                        <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-github fa-lg"></i></span>
                    </a>
                </div>
            </nav>
            </article>
            </div>
            <div class="section">
            <article class="media">
            <figure class="media-left">
                <p class="image is-128x128">
                    <img class="is-rounded" src="../media/portraits/Bensquare.jpg">
                </p>
            </figure>
            <div class="media-content">
                <h1 class="title is-4">Ben Rosenberger</h1>
                <h2 class="subtitle is-6">Computer Science B.S. / Anthropology Minor</h2>
                <p>
                    After graduating in May of 2021, Ben will join the software industry where he plans to strengthen his skillset in hopes of one day being a full stack engineer.
                </p>
            </div>
            <nav class="level media-right">
                <div class="level-center">
                    <a class="level-item" title="LinkedIn" href="https://www.linkedin.com/in/ben-rosenberger/">
                        <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-linkedin fa-lg"></i></span>
                    </a>
                    <a class="level-item" title="Github" href="https://github.com/brose32">
                        <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-github fa-lg"></i></span>
                    </a>
                </div>
            </nav>
            </article>
            </div>
            <div class="section">
            <article class="media">
                <figure class="media-left">
                    <p class="image is-128x128">
                        <img class="is-rounded" src="../media/portraits/garrett.png">
                    </p>
                </figure>
                <div class="media-content">
                    <h1 class="title is-4">Garrett Olcott</h1>
                    <h2 class="subtitle is-6">Computer Science B.A. / Chinese Minor / Music Minor</h2>
                    <p>
                        Garrett is a senior graduating in May 2021. After graduation, he plans to work full time in the industry as a front-end web developer. His current skillset is mostly related to front-end web development but is working towards becoming proficient as a full stack developer.
                    </p>
                </div>
                <nav class="level media-right">
                    <div class="level-center">
                        <a class="level-item" title="LinkedIn" href="https://www.linkedin.com/in/garrett-olcott">
                            <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-linkedin fa-lg"></i></span>
                        </a>
                        <a class="level-item" title="Github" href="https://github.com/corgster">
                            <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-github fa-lg"></i></span>
                        </a>
                    </div>
                </nav>
            </article>
            </div>
            <div class="section">
            <article class="media">
                <figure class="media-left">
                    <p class="image is-128x128">
                        <img class="is-rounded" src="../media/portraits/aaron.png">
                    </p>
                </figure>
                <div class="media-content">
                        <h1 class="title is-4">Aaron Zhang</h1>
                        <h2 class="subtitle is-6">Computer Science B.A. / Music Minor</h2>
                        <p>
                            Aaron is a current senior at UNC. 
                            After graduation, he will be working as a software engineer with The Vanguard Group. 
                            He is currently focused on improving as a developer but is also interested in alternate tech careers such as the Product Manager role.
                        </p>
                </div>
                <nav class="level media-right">
                    <div class="level-center">
                        <a class="level-item" title="LinkedIn" href="https://www.linkedin.com/in/aaron-zhang-948b79123/">
                            <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-linkedin fa-lg"></i></span>
                        </a>
                        <a class="level-item" title="Github" href="https://github.com/aarozhang">
                            <span class="icon is-medium" style="color:hsl(0, 0%, 29%)"><i class="fab fa-github fa-lg"></i></span>
                        </a>
                    </div>
                </nav>
            </article>
            </div>
        </div>
    </section>  
    `);
}

export async function loadIntoDOM() {
    await renderBody();

    // navbar burger functionality
    $(".navbar-burger").click(function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
}

$(function () {
    loadIntoDOM();
});
