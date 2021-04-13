let db = firebase.firestore();
export async function renderNavbar() {
    return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="../index.html">
                <img src="../media/learnscaping_logo.png" width="210">
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item" href="../adminpage/adminPage.html">
                    User Control Panel
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

export async function renderBody() {
    return `
      <section class="section">
      <div class="container">
            ${await renderCourses()}
      </div>
      </section>
      `;
}

export async function renderCourses() {
    return `
  <div class="box">
    <div style="display: flex; justify-content: space-between">
        <h2 class="title">Courses</span></h2>
        <a class="button is-success" href="../createCoursePage/createCourse.html">New Course&nbsp;&nbsp;<i class="fas fa-plus"></i></a>
    </div>
    <div id="courseRoot"></div>
  </div>

<div class="box">
  <h2 class="title">Students</h2>
  <table class="table">
  <thead>
    <tr>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
</div>`;
}

export async function renderPage() {
    let html = await renderNavbar();

    html += await renderBody();

    return html;
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
            console.log("Error getting document:", error);
        });
    if (!event.target.checked) {
        // then not assigned (why is this backwards?)
        return ref
            .update({
                courses: firebase.firestore.FieldValue.arrayRemove(course),
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
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
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}

export async function loadIntoDOM() {
    const $root = $("#root");

    $root.append(await renderPage());

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
            console.log("Error getting documents: ", error);
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
            console.log("Error getting documents: ", error);
        });

    for (let i = 0; i < courses.length; i++) {
        $("table thead tr").append(
            `<th><abbr title="Module ${i + 1}: ${courses[i].title}">Module ${i + 1}</abbr></th>`
        );
    }

    for (let i = 0; i < students.length; i++) {
        $("table tbody").append(`<tr name="${i}">
            <td>
                <a href='#'>${students[i].first} ${students[i].last}</a>
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
                    '<span class="tag is-light">In Progress</span>'
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
        $("#courseRoot").append(`<div class="box">
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
                <a class="button is-small is-info">Delete&nbsp;<i class="fas fa-trash"></i></a>
                &nbsp;&nbsp;
                <a class="button is-small">Edit</a>
            </div>
        </article>
    </div>`);
    }
    $(".assign").on("change", () => {
        handleAssignToggleClick(event);
    });
}

$(function () {
    loadIntoDOM();
});
