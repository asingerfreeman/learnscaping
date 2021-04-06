let pageNum = 1;

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
        <a class="button is-success">New Course&nbsp;&nbsp;<i class="fas fa-plus"></i></a>
    </div>          
        <div class="box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Module 1: </strong>
                            Landscape Installation
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
        </div>

        <div class="box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Module 2: </strong>
                            Landscape Maintenance
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
        </div>
        <div class="box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Module 3: </strong>
                            Equipment Maintenance
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
        </div>

        <div class="box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Module 4: </strong>
                            Turf Maintenance
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
        </div>

        <div class="box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Module 5: </strong>
                            Pesticides
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
        </div>
  </div>

<div class="box">
  <h2 class="title">Students</h2>
  <table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Module 1</th>
      <th>Module 2</th>
      <th>Module 3</th>
      <th>Module 4</th>
      <th>Module 5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td><a href='#'>John Doe</a></td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-light">In Progress</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-info">Not Started</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-info">Not Started</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-info">Not Started</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-info">Not Started</span>
        </td>
    </tr>
    <tr>
      <td><a href='#'>Juan Hernandez</a></td>
      <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-light">In Progress</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-info">Not Started</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-info">Not Started</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-info">Not Started</span>
        </td>
    </tr>
    <tr>
      <td><a href='#'>Kjaw Khaing</a></td>
      <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
    </tr>
    <tr>
      <td><a href='#'>Victoria Hay</a></td>
      <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-light">In Progress</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
        <td>
            <input type="checkbox">
            Assigned
            <span class="tag is-success">Complete</span>
        </td>
    </tr>
  </tbody>
</table>
</div>`;
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
}

$(function () {
  loadIntoDOM();
});
