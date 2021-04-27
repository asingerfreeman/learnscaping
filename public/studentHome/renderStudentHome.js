const $root = $("#root");
const db = firebase.firestore();

export async function renderNavbar() {
    $root.append(`
    <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="../studentHome/studentHome.html">
                <img src="../media/learnscaping_logo.png" width="210">
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarInfo">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="navbarInfo" class="navbar-menu">
        <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a id="signOut" class="button is-success" href="">
                            <strong>Sign Out</strong>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav> `);

    // navbar burger functionality
    $(".navbar-burger").click(function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    $root.on("click", "#signOut", () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
                alert("Sign out error.");
            });
    });

    return;
}

export async function renderBody(courses, first) {
    let title, status, subtitle;
    let html = "";

    // render courses
    if (courses.length === 0) {
        // if no courses assigned
        html += `
            <h2 class="subtitle">
                <i class="fa fa-leaf" style="color:hsl(204, 86%, 53%)"></i> Looks like you have no courses assigned! <i class="fa fa-leaf" style="color:hsl(204, 86%, 53%)"></i>
            </h2>
        `;
    } else {
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
                    alert("Error getting document:", error);
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
            subtitle = await renderScore(course.testScore);

            // render Course html and append
            html += await renderCourse(course.cid, title, status, subtitle);
        }
    }

    return `
    <section class="section">
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-11-tablet is-10-desktop is-10-widescreen">
                    <div class="block">
                        <h1 class="title is-inline is-1">
                            Welcome, ${first}!
                        </h1>
                    </div>
                    <div id="courses" class="block">
                        ${html}
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
}

export async function renderCourse(cid, title, status, subtitle) {
    return `
    <a class="box" href="../lessonPage/lessonPage.html?${cid}">
        <article class="media">
            <div class="media-content">
                <h1 class="title"><i class="fas fa-book-open fa-s"></i>&nbsp; ${title}</h1>
                ${subtitle}
            </div>
            <div class="media-right">
                ${status}
            </div>
        </article>
    </a>
    `;
}

export async function renderStatus(color, message) {
    let html = "";
    if (message === "Not Started") {
        html += `
        <span class="tag is-medium ${color}"
            <span class="icon-text">
                <span class="icon">
                    <i class="fa fa-exclamation-circle"></i>
                </span>
                <span>${message}</span>
            </span>
        <span>
        `;
        return html;
    } else if (message === "In Progress") {
        html += `
        <span class="tag is-medium ${color}"
            <span class="icon-text">
                <span class="icon">
                    <i class="fa fa-spinner"></i>
                </span>
                <span>${message}</span>
            </span>
        <span>
        `;
        return html;
    } else {
        html += `
        <span class="tag is-medium ${color}"
            <span class="icon-text">
                <span class="icon">
                    <i class="fa fa-check"></i>
                </span>
                <span>${message}</span>
            </span>
        <span>
        `;
    }
    return html;
}

export async function renderScore(testScore) {
    return `<h2 class="subtitle">Score: ${testScore}</h2>`;
}

export async function loadIntoDOM() {
    // Check user auth
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.

            // get user obj
            const userRef = db.collection("users").doc(user.uid);
            await userRef
                .get()
                .then(async (doc) => {
                    if (doc.exists) {
                        let courses = doc.data().courses;
                        let first = doc.data().first;
                        let isInstructor = doc.data().isInstructor;

                        // prevents an instructor from accessing student home
                        if (isInstructor) {
                            window.location.href = "../instructorHome/instructorHome.html";
                        }

                        // sort courses by cid
                        courses.sort(function (a, b) {
                            if (a.cid < b.cid) {
                                return -1;
                            }
                            if (a.cid > b.cid) {
                                return 1;
                            }
                            return 0;
                        });

                        // render page
                        await renderNavbar();
                        $root.append(await renderBody(courses, first));
                    } else {
                        // doc.data() will be undefined in this case
                        alert(`User doc does not exist`);
                    }
                })
                .catch((error) => {
                    alert(`Get user: ${error}`);
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
