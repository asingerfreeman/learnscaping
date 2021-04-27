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
            <a class="nav-item icon-text nav-item" href="../index.html" active-color="orange">
                    <span class="icon">
                        <i class="fas fa-home"></i>
                    </span>
                    <span><strong>Home</strong></span>
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
    <section class="hero is-medium has-background">
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
    <section class="section is-medium">
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
            <figure class="media-left px-4">
                        <i class="fas fa-moon fa-5x"></i>
            </figure>
            <div class="media-content">
                <h1 class="title is-4">Mark Moon</h1>
                <h2 class="subtitle is-6">Building Environmental Services Manager for the UNC Grounds Department <br> 
                    Learnscaping Project Director/Visionary
                </h2>
                <p>
                    Since 1996, Mr. Moon has been a proud member of the UNC Grounds team, first starting as a Grounds Worker before working his way up to become a Supervisor in 2003.
                    Mr. Moon is primarily responsible for 16 major areas including The School of Business, the Dean Smith Center, and the Chancellor’s Residence.
                    Additionally, Mr. Moon manages three crews that perform all landscaping maintence requirements for these areas. As a part of leading these teams, he conducts Safety Training, Grounds Training,
                    and the ordering of Grounds Supplies. Mr. Moon also proudly serves as the Chair for the Facilities Safety Committee and works closesly with the Facilities Safety Manager.
                    Developing a training program for Grounds has been one of Mr. Moon's long-time goals, and he is very excited to see Learnscaping come to fruition.
                    Throughout Learnscaping's development, Mr. Moon served as the project visionary and director, ensuring the design and concept stayed true to its cause.
                </p>
            </div>
            </article>
            </div>
            <div class="section">
            <article class="media">
            <figure class="media-left px-4">
                        <i class="fas fa-apple-alt fa-5x"></i>
            </figure>
            <div class="media-content">
                <h1 class="title is-4">Michele Andrea Bowen</h1>
                <h2 class="subtitle is-6">Training Specialist for UNC Facilities Services <br>
                    Learnscaping Project Manager
                </h2>
                <p>
                    As the Training Specialist for Facilities Services since 2016, Ms. Bowen has been a part of numerous projects surrounding Safety Training/Coordination, Program development,
                    Teaching Writing, Staff Development, and Content Development. Before that, Ms. Bowen proved her dedication to education through various experiences such as being 
                    both a full-time author and part-time instructor for Critical Thinking, Sociology, and Writing. Additionally, Ms. Bowen had an extensive career as a teacher in Durham Public Schools where
                    she taught Honors American History I & II, and an Electives Law Course. Her education stems from various degrees earned at Washington University in St. Louis and our very own
                    UNC Chapel Hill. Since returning to UNC, Ms. Bowen has enjoyed her time immensely and is looking forward to seeing Learnscaping further her mission of providing greater education.
                    Throughout development, Ms. Bowen has served as the project manager, overseeing project requirements, deadlines, and communication between project leadership and the development team. 
                    With her help, the team was able to reach its goal of providing a thorough and friendly training platform.
                </p>
            </div>
            </article>
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
                    <figure class="media-left pl-2 pr-5">
                        <i class="fas fa-cat fa-5x"></i>
                    </figure>
                <div class="media-content">
                <h1 class="title is-4">Ari Singer-Freeman</h1>
                <h2 class="subtitle is-6">Computer Science B.A. / Business Administration B.S. </h2>
                <p>
                    Ari is a senior graduating in May 2021. After graduation, he will be joining Morgan Stanley's Mergers and Acquisitions group in New York City. 
                    He is currently more proficient with backend development/database management but is working to improve his front-end skills.
                    Throughout Learnscaping's development, Ari served as the back-end lead, providing crucial infrastructure while also making major contributions to the 
                    Edit Course feature and managing documentation.
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
                    <figure class="media-left pr-3">
                        <i class="fas fa-dragon fa-5x"></i>
                    </figure>
            <div class="media-content">
                <h1 class="title is-4">Ben Rosenberger</h1>
                <h2 class="subtitle is-6">Computer Science B.S. / Anthropology Minor</h2>
                <p>
                    After graduating in May of 2021, Ben will join the software industry where he plans to strengthen his skillset in hopes of one day being a full stack engineer.
                    While working on Learnscaping, Ben lead development of Selenium tests, managed Firebase tools, and served as our lead developer for the rich text editor feature.
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
                    <figure class="media-left pr-3">
                        <i class="fas fa-gamepad fa-5x"></i>
                    </figure>
                <div class="media-content">
                    <h1 class="title is-4">Garrett Olcott</h1>
                    <h2 class="subtitle is-6">Computer Science B.A. / Chinese Minor / Music Minor</h2>
                    <p>
                        Garrett is a senior graduating in May 2021. After graduation, he plans to work full time in the industry as a front-end web developer. 
                        His current skillset is mostly related to front-end web development but is working towards becoming proficient as a full stack developer.
                        Throughout the course of Learnscaping's development, Garrett worked to build and design numerous front-end features for the student and instructor views.
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
                <figure class="media-left pl-3 pr-5">
                    <i class="fas fa-camera-retro fa-5x"></i>
                </figure>
                <div class="media-content">
                        <h1 class="title is-4">Aaron Zhang</h1>
                        <h2 class="subtitle is-6">Computer Science B.A. / Music Minor</h2>
                        <p>
                            Aaron is a current senior at UNC. After graduation, he will be working as a software engineer with The Vanguard Group. 
                            He is currently focused on improving as a developer but is also interested in alternate tech careers such as the Product Manager role.
                            Aaron served as a main front-end developer building and designing key features for both the student and instructor views.
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
