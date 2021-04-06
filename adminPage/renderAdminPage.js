let pageNum = 1;
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
                  <a class="navbar-item" href="../studentHome/studentHome.html">
                      Home
                  </a>
  
                  <a class="navbar-item" href="../lessonPage/lessonPage.html">
                      Example Lesson Page
                  </a>
                  <a class="navbar-item" href="../adminpage/adminPage.html">
                      Admin View Page
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
      <th>Module 1</th>
      <th>Module 2</th>
      <th>Module 3</th>
      <th>Module 4</th>
      <th>Module 5</th>
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
  
  function recalculateButtons() {
    console.log("now on page " + pageNum);
    if (pageNum == 1) {
      $(".pagination-previous").attr("disabled", true);
    } else if (pageNum == 3) {
      $(".pagination-next").attr("disabled", true);
    } else {
      $(".pagination-previous").attr("disabled", false);
      $(".pagination-next").attr("disabled", false);
    }
    switch (pageNum) {
      case 1:
        $(".content").empty();
        $(".content").append(renderPage1());
        break;
      case 2:
        $(".content").empty();
        $(".content").append(renderPage2());
        break;
      case 3:
        $(".content").empty();
        $(".content").append(renderPage3());
        break;
    }
  }

  function handleInstructorToggleClick() {
    var ref = db.collection("users").doc(event.target.id)
    if(!event.target.checked) {
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
  
  export async function loadIntoDOM() {
    const $root = $("#root");
  
    $root.append(await renderPage());
  
    $(".pagination-previous").on("click", () => {
      if (pageNum <= 1) {
        return;
      }
      // increment by 100/size of section deck
      document.getElementById("sProgress").value -= 33;
      pageNum--;
      recalculateButtons();
    });
    $(".pagination-next").on("click", () => {
      if (pageNum >= 3) {
        return;
      }
      // increment by 100/size of section deck
      document.getElementById("sProgress").value += 33;
      pageNum++;
      recalculateButtons();
    });
    
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
    console.log(users)
    for(let i = 0; i < users.length; i++) {
      $("table tbody").append(`<tr>
          <td><a href='#'>${users[i].first} ${users[i].last}</a></td>
          <td><input type="checkbox" name="${users[i].first}${users[i].last}isInstr" class="isInstr" id="${userIDs[i]}"> Instructor</td>
          <td>
              <input type="checkbox">
              Completed
          </td>
          <td>
              <input type="checkbox">
              Completed
          </td>
          <td>
              <input type="checkbox">
              Completed
          </td>
          <td>
              <input type="checkbox">
              Completed
          </td>
          <td>
              <input type="checkbox">
              Completed
          </td>
          </tr>`)
          if (users[i].isInstructor == true) {
            $(`input[name=${users[i].first}${users[i].last}isInstr]`).attr('checked', true)
          }
    }
    $('.isInstr').on("change", () => {
      handleInstructorToggleClick()
    });
  }

  $(function () {
    loadIntoDOM();
  });
  