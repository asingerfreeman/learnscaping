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
            <a class="nav-item icon-text" href="../instructorHome/instructorHome.html">
                <span class="icon">
                    <i class="fas fa-home"></i>
                </span>
                <span>Home</span>
            </a>
            <a class="nav-item icon-text" href="../adminPage/adminPage.html">
                <span class="icon">
                    <i class="fas fa-users"></i>
                </span>
                &nbsp;
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
        <h2 class="title">Accounts</h2>
        <article id="message" class="message is-info">
            <div class="message-body">
                <strong>Use this page to override course completeness, assign instructor roles, and delete users.</strong><br>
                - Note: "Completed" checkboxes are disabled unless the course has been assigned to the account<br> 
            </div>
        </article>
        <div class="table-container">
            <table class="table is-fullwidth is-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th></th>
                        <th><abbr title="Check this box if the account is an instructor">Instructor</abbr></th>
                    </tr>
                </thead>
            <tbody>
            </tbody>
            </table>
        </div>
    </div>`;
}

function handleInstructorToggleClick() {
    var ref = db.collection("users").doc(event.target.id);
    if (!event.target.checked) {
        // then not instructor (why is this backwards?)
        return ref
            .update({
                isInstructor: false,
            })
            .then(() => {})
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    } else {
        // then instructor
        return ref
            .update({
                isInstructor: true,
            })
            .then(() => {})
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    }
}

async function handleCompleteToggleClick(event) {
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
        // then not completed
        let newCourseObj = {
            cid: course.cid,
            isStarted: course.isStarted,
            isComplete: false,
            testScore: course.testScore,
        };
        ref.update({
            courses: firebase.firestore.FieldValue.arrayRemove(course),
        });
        return ref
            .update({
                courses: firebase.firestore.FieldValue.arrayUnion(newCourseObj),
            })
            .then(() => {})
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    } else {
        // then completed
        let newCourseObj = {
            cid: course.cid,
            isStarted: course.isStarted,
            isComplete: true,
            testScore: course.testScore,
        };
        ref.update({
            courses: firebase.firestore.FieldValue.arrayRemove(course),
        });
        return ref
            .update({
                courses: firebase.firestore.FieldValue.arrayUnion(newCourseObj),
            })
            .then(() => {})
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    }
}

export async function handleDeleteUser(event) {
    let isDelete = confirm(
        `Are you sure you want to delete user account: "${event.currentTarget.getAttribute(
            "data-name"
        )}"?`
    );

    if (!isDelete) {
        return;
    }

    db.collection("users")
        .doc(event.currentTarget.getAttribute("data-uid"))
        .delete()
        .then(() => {
            alert("User removed. Refresh page to update account list.");
        })
        .catch((error) => {
            alert("Error removing user: ", error);
        });
}

export async function loadIntoDOM() {
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            await renderNavbar();
            $root.append(await renderBody());

            let users = [];
            let userIDs = [];
            let i = 0;
            const querySnapshot = await db
                .collection("users")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        users[i] = doc.data();
                        userIDs[i] = doc.id;
                        i++;
                    });
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

            for (let i = 0; i < users.length; i++) {
                $("table tbody").append(`
                <tr name="${i}">
                    <td>
                        <a href='#'>${users[i].first} ${users[i].last}</a>
                    </td>
                    <td>
                        <a id="deleteUser" class="button is-small is-danger is-outlined" title="Delete User" data-uid="${userIDs[i]}" data-name="${users[i].first} ${users[i].last}">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                        </a>
                    </td>
                    <td><input type="checkbox" name="${users[i].first}${users[i].last}isInstr" class="isInstr" id="${userIDs[i]}"> Instructor</td>
                </tr>`);
                if (users[i].isInstructor == true) {
                    $(`input[name=${users[i].first}${users[i].last}isInstr]`).attr("checked", true);
                }
                for (let j = 0; j < courses.length; j++) {
                    $(`table tbody tr[name="${i}"]`).append(`
                    <td>
                        <input type="checkbox" name="${courseIDs[j]}" class="complete" id="${userIDs[i]}" disabled>
                            Completed
                        <div class="statusAppend" name="${courseIDs[j]}" id="${userIDs[i]}"></div>
                    </td>`);
                }
            }

            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < users[i].courses.length; j++) {
                    $(`input[name=${users[i].courses[j].cid}][id=${userIDs[i]}]`).attr(
                        "checked",
                        false
                    );
                    $(`input[name=${users[i].courses[j].cid}][id=${userIDs[i]}]`).attr(
                        "disabled",
                        false
                    );
                    if (users[i].courses[j].isComplete) {
                        $(`input[name=${users[i].courses[j].cid}][id=${userIDs[i]}]`).attr(
                            "checked",
                            true
                        );
                        $(`input[name=${users[i].courses[j].cid}][id=${userIDs[i]}]`).attr(
                            "disabled",
                            false
                        );
                    }
                }
            }

            $(".isInstr").on("change", () => {
                handleInstructorToggleClick();
            });

            $(".complete").on("change", () => {
                handleCompleteToggleClick(event);
            });

            $root.on("click", "#deleteUser", handleDeleteUser);
        } else {
            // No user is signed in. Redirect to login.
            window.location.href = "../loginPage/login.html";
        }
    });
}

$(function () {
    loadIntoDOM();
});
