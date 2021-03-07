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
                    <a class="button is-success" href="loginPage/login.html">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light" href="loginPage/login.html">
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

function renderPage1() {
  return `<p><strong>Good soil prep is the key to creating and maintaining successful landscape beds on campus.</strong></p>
  <p>Three basic types of beds staff can expect to prepare</p>
  <ul>
    <li>Brand new beds</li>
    <li>Empty beds planted during previous planting periods and requiring another preparation process</li>
    <li>Beds with existing perennials, bulbs and/or shrubs</li>
  </ul>`;
}

function renderPage2() {
  return `<p><strong>Preparing a New Landscape Bed</strong></p>
  <p>Soil has to be prepared for planting unless the soil location is endowed with good soil and a ready site.</p>
  <p>Preparation involves laying out the site, removing anything that has to go, making the beds, and amending and grading the soil.</p>
  <p><strong>Rules of Thumb for Brand New Beds</strong></p>
  <ol>
    <li>Map out where the bed will be and what shape it will have. You can mark the bed with marking paint.</li>
    <li>Check for utility lines.</li>
    <li>Spray area with (pesticide) if needed and remove any vegetation.</li>
    <li>Put an edge on the bed by using a spade or bed edger.</li>
    <li>Work the soil when it is moist not but not wet.</li>
    <li>Turn the soil over to a depth of at least 12 inches.</li>
    <li>Add 2-3 inches of compost and turn it into the bed.</li>
    <li>Grade the bed so it does not hold water.</li>
    <li>Send water out of the bed and away from adjacent patios or building foundations.</li>
    <li>Cover the bed with a thick (3-4 inches) layer of mulch to help keep weeds from germinating and to preserve moisture.</li>
  </ol>
  <p>Established beds will often have open areas where plants have died or where annuals 
  are added each spring. Turn over the soil to incorporate the organic matter and then plant in these specific areas.</p>
  <p><strong>Rules of Thumb for existing beds that are empty and planted</strong></p>
  <ol>
    <li>Add 2-3 inches of compost and work it into the top layer of soil, if possible.</li>
    <li>Work the soil when it is moist, but not wet.</li>
    <li>Do not allow compost to come into contact with plant stems.</li>
    <li>Top dress with another layer of mulch to keep down weeds and preserve moisture.</li>
  </ol>
  `;
}

function renderPage3() {
  return `<p><strong>Do’s and Don’ts on Bed Preparation</strong></p>
  <ul>
    <li>Don’t start preparing beds without a clear and designated plan.</li>
    <li>Do map out where the bed will be and what shape it will have.</li>
    <li>Do check for utility lines.</li>
    <li>Do think <abbr title="curb appeal: the attractiveness of something when viewed from the street or sidewalk">curb appeal</abbr>.</li>
    <li>Don’t work the soil when it is wet.</li>
    <li>Do grade the bed so it does not hold water.</li>
    <li>Do add 3-4 inches of mulch to help keep out weeds and preserve moisture.</li>
  </ul>
  <p><strong>Equipment Used in Bed Prep</strong></p>
  <ul>
    <li>Skid Steer</li>
    <li>Dingo</li>
    <li>Wheel Barrow</li>
    <li>Shovels, Spades, and Rakes</li>
    <li>Bed Edger</li>
    <li>PPE (Safety Glasses, Ear Plugs, Gloves, and Steel Toe Shoes)</li>
  </ul>
  <p><strong>The Following Sites provide more information on how to prepare a bed</strong></p> 
  <ul>
    <li><a href="https://landscapemanagement.net">landscapemanagement.net</a></li>
    <li><a href="https://provenwinners.com">provenwinners.com</a></li>
    <li><a href="https://gardentutor.com">gardentutor.com</a></li>
  </ul>
  `;
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
