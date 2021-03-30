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
                <a class="navbar-item" href="studentHome.html">
                    Home
                </a>

                <a class="navbar-item" href="../lessonPage/lessonPage.html">
                    Example Lesson Page
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
            <h1 class="title is-1">Courses</h1>
            ${await renderCourses()}
      </div>
      </section>
      `;
}

export async function renderCourses() {
  return `
  <div class="box">
  <h2 class="title">Assigned Courses</h2>
    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Landscape Installation</strong>
                        <br>
                        Introduction to Landscape Installation
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-success">Complete</span>
                <span class="tag is-warning">Assigned</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="100" max="100">100%</progress>
    </div>

    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Landscape Maintenance</strong>
                        <br>
                        Introduction to Landscape Maintenance
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-light">In Progress</span>
                <span class="tag is-warning">Assigned</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="30" max="100">30%</progress>
    </div>
  </div>

<div class="box">
  <h2 class="title">Unassigned Courses</h2>
    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Equipment Maintenance</strong>
                        <br>
                        Introduction to Equipment Maintenance
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-success">Complete</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="100" max="100">100%</progress>
    </div>

    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Turf Maintenance</strong>
                        <br>
                        Introduction to Turf Maintenance
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-light">In Progress</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="10" max="100">30%</progress>
    </div>

    <div class="box">
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Pesticides</strong>
                        <br>
                        Introduction to Pesticides
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="tag is-info">Not Started</span>
            </div>
        </article>
        <progress class="progress is-success is-small" value="0" max="100">30%</progress>
    </div>
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

  renderPage();

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
