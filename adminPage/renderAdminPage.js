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
                  <a class="navbar-item" href="../instructorHome/instructorHome.html">
                      Instructor Home
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
  <h2 class="title">Accounts</h2>
  <table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th><abbr title="Check this box if the account is an instructor">Instructor</abbr></th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
</div>`
}

export async function renderPage() {
  let html = await renderNavbar();

  html += await renderBody();

  return html;
}

function handleInstructorToggleClick() {
  var ref = db.collection("users").doc(event.target.id)
  if (!event.target.checked) {
    // then not instructor (why is this backwards?)
    return ref.update({
      isInstructor: false
    })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  } else {
    // then instructor
    return ref.update({
      isInstructor: true
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

async function handleCompleteToggleClick(event) {
  var ref = db.collection("users").doc(event.target.id)
  let courseID = event.target.name;
  let course;
  const query = await ref.get().then((doc) => {
      let courses = doc.data().courses
      course = courses.find(c => c.cid === courseID)
  }).catch((error) => {
      console.log("Error getting document:", error)
  })
  if (!event.target.checked) {
      // then not completed
      let courseObj = {
        cid: course.cid,
        isStarted: course.isStarted,
        isComplete: false,
        testScore: course.testScore
      }
      return ref.update({
          // courses: firebase.firestore.FieldValue.arrayUnion(courseObj)
      })
          .then(() => {
              console.log("Document successfully updated!");
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
  } else {
      // then completed
      let courseObj = {
        cid: course.cid,
        isStarted: course.isStarted,
        isComplete: true,
        testScore: course.testScore
      }
      return ref.update({
          // courses: firebase.firestore.FieldValue.arrayUnion(courseObj)
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

  let users = [];
  let userIDs = []
  let i = 0;
  const querySnapshot = await db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      users[i] = doc.data()
      userIDs[i] = doc.id
      i++;
    })
  })

  let courses = []
  let courseIDs = []
  i = 0
  const querySnapshot2 = await db.collection("courses")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        courses[i] = doc.data()
        courseIDs[i] = doc.id
        i++;
      });
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });

  for (let i = 0; i < courses.length; i++) {
    $("table thead tr").append(`<th><abbr title="Module ${i + 1}: ${courses[i].title}">Module ${i + 1}</abbr></th>`)
  }

  for (let i = 0; i < users.length; i++) {
    $("table tbody").append(`<tr name="${i}">
          <td>
              <a href='#'>${users[i].first} ${users[i].last}</a>
          </td>
          <td><input type="checkbox" name="${users[i].first}${users[i].last}isInstr" class="isInstr" id="${userIDs[i]}"> Instructor</td>
      </tr>`)
    if (users[i].isInstructor == true) {
      $(`input[name=${users[i].first}${users[i].last}isInstr]`).attr('checked', true)
    }
    for (let j = 0; j < courses.length; j++) {
      $(`table tbody tr[name="${i}"]`).append(`
              <td>
                  <input type="checkbox" name="${courseIDs[j]}" class="complete" id="${userIDs[i]}">
                  Completed
                  <div class="statusAppend" name="${courseIDs[j]}" id="${userIDs[i]}"></div>
              </td>`)

    }
  }

  $('.isInstr').on("change", () => {
    handleInstructorToggleClick()
  });

  $('.complete').on("change", () => {
    // handleCompleteToggleClick(event)
});
}

$(function () {
  loadIntoDOM();
});
