export async function renderNavbar() {
    return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="../studentHome/studentHome.html">
                <img src="../media/learnscaping_logo.png" width="210">
            </a>

        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item" href="studentHome.html">
                    Home
                </a>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-success" href="">
                        <strong>Sign Out</strong>
                    </a>
                </div>
            </div>
        </div>
    </div>
    </nav> `;
}

export async function renderBody(db, courses) {
    let title, status, testScore;
    let html = "";

    // render courses
    for (let i = 0; i < courses.length; i++) {
        let course = courses[i];
        let courseRef = db.collection("courses").doc(course.cid);

        // get title
        await courseRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    title = doc.data().title;
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });

        // render status
        if (course.isComplete) {
            status = await renderStatus("is-success", "Complete");
        } else if (!course.isStarted) {
            status = await renderStatus("is-info", "Not Started");
        } else {
            status = await renderStatus("is-warning", "In Progress");
        }

        // render testScore
        testScore = await renderScore(course.testScore);

        // render Course html and append
        html += await renderCourse(course.cid, title, status, testScore);
    }

    return `
    <section class="section">
        <div class="container">
            <h1 class="title is-1">Courses</h1>
            <div id="courses" class="box">
                ${html}
            </div>
        </div>
    </section>
    `;
}

export async function renderCourse(cid, title, status, testScore) {
    return `
    <a class="box" href="../lessonPage/lessonPage.html?${cid}">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <h1 class="title">${title}</h1>
                    ${testScore}
                </div>
            </div>
            <div class="media-right">
                ${status}
            </div>
        </article>
    </a>
    `;
}

export async function renderStatus(color, message) {
    return `<span class="tag ${color}">${message}</span>`;
}

// ***************** IMPLEMENT PROGRESS BAR IF TIME. NEED LESSON VIEWER UP FIRST **************************
// export async function renderProgressBar() {
//     return `<progress class="progress is-success is-small" value="70" max="100">100%</progress>`;
// }

export async function renderScore(testScore) {
    return `<p>Score: ${testScore}</p>`;
}

export async function loadIntoDOM() {
    // Check user auth
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.

            // grab user firestore reference
            const db = firebase.firestore();
            const userRef = db.collection("users").doc(user.uid);
            const $root = $("#root");

            // render page
            await userRef
                .get()
                .then(async (doc) => {
                    if (doc.exists) {
                        let courses = doc.data().courses;

                        $root.append(await renderNavbar());
                        $root.append(await renderBody(db, courses));
                    } else {
                        // doc.data() will be undefined in this case
                        $root.append(
                            `<p class="help is-danger">Error getting document: uid unrecognized. Please reload and try again. If issue persists, contact an admin for help.</p>`
                        );
                    }
                })
                .catch((error) => {
                    $root.append(
                        `<p class="help is-danger">Error getting document: ${error}. Please reload and try again. If issue persists, contact an admin for help.</p>`
                    );
                });
        } else {
            // No user is signed in. Redirect to login.
            window.location.href = "../loginPage/login.html";
        }
    });
}

$(function () {
    loadIntoDOM();
});
