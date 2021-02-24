let pageNum = 1;

export async function renderNavbar() {
  return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="index.html">
                <img src="/media/learnscaping_logo.png" width="210">
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item" href="../index.html">
                    Home
                </a>

                <a class="navbar-item" href="coursesPage/courses.html">
                  Courses
                </a>

                <a class="navbar-item" href="toolBoxPage/toolBox.html">
                    Tool Box
                </a>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-success">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
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
      <div class="columns">
        <div class="column">
            ${await renderCourses()}
        </div>
      </div>
    </div>
    </section>
    `;
}

export async function renderCourses() {
  return `<div class="block">
  <h1 class="title">Block 1 - Bed Preperation</h1>
  <nav class="pagination" role="navigation" aria-label="pagination">
  <a class="pagination-previous" title="This is the first page" disabled="disabled">Previous</a>
  <a class="pagination-next">Next page</a>
  <ul class="pagination-list">
    <li class>
      <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a>
    </li>
    <li>
      <a class="pagination-link" aria-label="Goto page 2">2</a>
    </li>
    <li>
      <a class="pagination-link" aria-label="Goto page 3">3</a>
    </li>
  </ul>
</nav>
<progress class="progress is-success" id="sProgress" value="30" max="100">30%</progress>
<div class="content">
<p><strong>Good soil prep is the key to creating and maintaining successful landscape beds on campus.</strong></p>
<p>Three basic types of beds staff can expect to prepare</p>
<ul>
  <li>Brand new beds</li>
  <li>Empty beds planted during previous planting periods and requiring another preparation process</li>
  <li>Beds with existing perennials, bulbs and/or shrubs</li>
</ul>
</div>
  </div> `;
}

export async function renderPage() {
  let html = await renderNavbar();

  html += await renderBody();

  return html;
}

function recalculateButtons() {
  console.log("now on page " + pageNum)
  if(pageNum == 1) {
    $(".pagination-previous").attr("disabled", true)
  } else if (pageNum == 3) {
    $(".pagination-next").attr("disabled", true)
  } else {
    $(".pagination-previous").attr("disabled", false)
    $(".pagination-next").attr("disabled", false)
  }
  switch(pageNum) {
    case(1) :
      $(".content").empty()
      $(".content").append("<p>page 1</p>")
      break;
    case(2) :
      $(".content").empty()
      $(".content").append("<p>page 2</p>")
      break;
    case(3) :
      $(".content").empty()
      $(".content").append("<p>page 3</p>")
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
    document.getElementById("sProgress").value-= 33
    pageNum--;
    recalculateButtons();
  })
  $(".pagination-next").on("click", () => {
    if (pageNum >= 3) {
      return;
    }
    // increment by 100/size of section deck
    document.getElementById("sProgress").value+= 33;
    pageNum++;
    recalculateButtons();
  })
}

$(function () {
  loadIntoDOM();
});
