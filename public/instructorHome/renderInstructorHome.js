const $root = $("#root");
let db = firebase.firestore();

export async function renderNavbar() {
    $root.append(`
    <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="../instructorHome/instructorHome.html">
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
                <a class="nav-item icon-text" href="../instructorHome/instructorHome.html" active-color="orange">
                    <span class="icon">
                        <i class="fas fa-home"></i>
                    </span>
                    <span>Home</span>
                </a>
                <a class="nav-item icon-text" href="../adminPage/adminPage.html">
                    <span class="icon">
                        <i class="fas fa-users"></i>
                    </span>
                    <span>User Control Panel</span>
                </a>
            </div>

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

export async function renderBody(first) {
    return `
    <section class="section">
        <div class="container">
            <h1 class="title is-1">Welcome, ${first}!</h1>
            ${await renderCourses()}
        </div>
    </section>
    <section class="section">
        <div class="container">
            ${await renderStudents()}
        </div>
    </section>
    `;
}

export async function renderCourses() {
    return `
    <div class="box">
        <div style="display: flex; justify-content: space-between">
            <h2 class="title">Courses <i class="fas fa-book fa-s"></i></h2>
            <a class="button is-success" href="../createCoursePage/createCourse.html">New Course&nbsp;&nbsp;<i class="fas fa-plus"></i></a>
        </div>
        <div id="courseRoot"></div>
    </div>
    `;
}

export async function renderStudents() {
    return `
    <div class="box">
        <h2 class="title">Students <i class="fas fa-user-friends"></i></i></h2>
        <div class="table-container">
            <table class="table is-fullwidth is-hoverable is-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    `;
}

async function handleAssignToggleClick(event) {
    var ref = db.collection("users").doc(event.target.id);
    let courseID = event.target.name;
    let course;
    const query = await ref
        .get()
        .then((doc) => {
            let courses = doc.data().courses;
            course = courses.find((c) => c.cid === courseID);
        })
        .catch((error) => {
            alert("Error getting document:", error);
        });
    if (!event.target.checked) {
        // then not assigned (why is this backwards?)
        return ref
            .update({
                courses: firebase.firestore.FieldValue.arrayRemove(course),
            })
            .then(() => {})
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    } else {
        // then assigned
        let courseObj = {
            cid: event.target.name,
            isStarted: false,
            isComplete: false,
            testScore: 0,
        };
        return ref
            .update({
                courses: firebase.firestore.FieldValue.arrayUnion(courseObj),
            })
            .then(() => {})
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    }
}

export async function checkCourseValidity(course, cid) {
    // if no slides, delete course
    if (course.slides.length < 1) {
        db.collection("courses")
            .doc(cid)
            .delete()
            .then(() => {
                alert(`Removed the course "${course.title}" due to invalid course structure.`);
                location.reload();
            })
            .catch((error) => {
                alert(`Error removing an invalid course. ${error}}`);
                location.reload();
            });
        return;
    }

    return;
}

export async function deleteCourseButtonPress(event) {
    let isDelete = confirm(
        `Are you sure you want to delete "${event.currentTarget.getAttribute("data-title")}"?`
    );

    if (!isDelete) {
        return;
    }

    let cid = event.currentTarget.getAttribute("data-cid");
    let tid = event.currentTarget.getAttribute("data-tid");

    // modal to prevent user interference
    $root.append(`
    <div id="pleaseWait" class="modal is-active is-clipped">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <div class="block">
                    <p><strong>Deleting course...</strong></p>
                </div>
                <div class="block">
                    <p>
                        Please wait. Course deletion is taking longer than expected.
                    </p>
                </div>
            </div>
        </div>
    </div>`);

    // get users
    await db
        .collection("users")
        .get()
        .then(async (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                let courses = doc.data().courses;

                // remove course if assigned
                for (let i = 0; i < courses.length; i++) {
                    if (courses[i].cid === cid) {
                        db.collection("users")
                            .doc(doc.id)
                            .update({
                                courses: firebase.firestore.FieldValue.arrayRemove(courses[i]),
                            });
                    }
                }
            });
        });

    // remove corresponding test
    if (tid != "null") {
        await db
            .collection("tests")
            .doc(tid)
            .delete()
            .then(() => {})
            .catch((error) => {
                alert("Error removing test document: ", error);
            });
    }

    // remove course
    await db
        .collection("courses")
        .doc(cid)
        .delete()
        .then(() => {
            $("#pleaseWait").remove();
            location.reload();
        })
        .catch((error) => {
            alert("Error removing course document: ", error);
        });
    $("#pleaseWait").remove();
}

export async function loadIntoDOM() {
    // check user auth state
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            const userRef = db.collection("users").doc(user.uid);
            await userRef
                .get()
                .then(async (doc) => {
                    if (doc.exists) {
                        let first = doc.data().first;
                        let isInstructor = doc.data().isInstructor;

                        // prevents an student from accessing instructor home
                        if (!isInstructor) {
                            window.location.href = "../studentHome/studentHome.html";
                        }

                        // render page
                        await renderNavbar();
                        $root.append(await renderBody(first));
                    } else {
                        // doc.data() will be undefined in this case
                        alert(`User doc does not exist`);
                    }
                })
                .catch((error) => {
                    alert(`Get user: ${error}`);
                });

            let students = [];
            let studentIDs = [];
            let i = 0;
            const querySnapshot = await db
                .collection("users")
                .where("isInstructor", "==", false)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        students[i] = doc.data();
                        studentIDs[i] = doc.id;
                        i++;
                    });
                })
                .catch((error) => {
                    alert("Error getting documents: ", error);
                });

            let courses = [];
            let courseIDs = [];
            i = 0;

            const querySnapshot2 = await db
                .collection("courses")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        courses[i] = doc.data();
                        courseIDs[i] = doc.id;
                        i++;
                    });
                })
                .catch((error) => {
                    alert("Error getting documents: ", error);
                });

            for (let i = 0; i < courses.length; i++) {
                $("table thead tr").append(
                    `<th><abbr title="Module ${i + 1}: ${courses[i].title}">Module ${
                        i + 1
                    }</abbr></th>`
                );
            }

            for (let i = 0; i < students.length; i++) {
                $("table tbody").append(`<tr name="${i}">
                <td>
                    <p>${students[i].first} ${students[i].last}</p>
                </td>
                </tr>`);
                for (let j = 0; j < courses.length; j++) {
                    $(`table tbody tr[name="${i}"]`).append(`
                    <td>
                        <input type="checkbox" name="${courseIDs[j]}" class="assign" id="${studentIDs[i]}">
                            Assigned
                        <div class="statusAppend" name="${courseIDs[j]}" id="${studentIDs[i]}"></div>
                    </td>`);
                }
            }

            for (let i = 0; i < students.length; i++) {
                for (let j = 0; j < students[i].courses.length; j++) {
                    $(`input[name=${students[i].courses[j].cid}][id=${studentIDs[i]}]`).attr(
                        "checked",
                        true
                    );
                    if (students[i].courses[j].isStarted && !students[i].courses[j].isComplete) {
                        $(`div[name=${students[i].courses[j].cid}][id=${studentIDs[i]}]`).append(
                            '<span class="tag is-warning">In Progress</span>'
                        );
                    }
                    if (students[i].courses[j].isComplete) {
                        $(`div[name=${students[i].courses[j].cid}][id=${studentIDs[i]}]`).append(
                            '<span class="tag is-success">Complete</span>'
                        );
                    }
                    if (!students[i].courses[j].isStarted && !students[i].courses[j].isComplete) {
                        $(`div[name=${students[i].courses[j].cid}][id=${studentIDs[i]}]`).append(
                            '<span class="tag is-info">Not Started</span>'
                        );
                    }
                }
            }

            for (let i = 0; i < courses.length; i++) {
                // check course list
                await checkCourseValidity(courses[i], courseIDs[i]);

                $("#courseRoot").append(`
                <div id="courseBox" class="box">
                    <article class="media">
                        <div class="media-content">
                             <div class="content">
                                <p>
                                    <strong>Module ${i + 1}: </strong>
                                    ${courses[i].title}
                                </p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: flex-end">
                            <span style="display: inline-flex; flex-grow: 1; align-items: center;">
                                <a class="button is-small is-info" href ="../../editCoursePage/editCourse.html?${
                                    courseIDs[i]
                                }">Edit</a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a id="deleteCourse" class="button is-small is-danger is-outlined" data-title="${
                                    courses[i].title
                                }" data-tid="${courses[i].tid}" data-cid="${
                    courseIDs[i]
                }">Delete&nbsp;<i class="fas fa-trash"></i></a>
                        </div>
                    </article>
                </div>`);
            }
            $(".assign").on("change", () => {
                handleAssignToggleClick(event);
            });
            $root.on("click", "#deleteCourse", deleteCourseButtonPress);
        } else {
            // No user is signed in. Redirect to login.
            window.location.href = "../loginPage/login.html";
        }
    });
}

$(function () {
    loadIntoDOM();
});
