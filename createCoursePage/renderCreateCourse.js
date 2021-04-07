export async function renderNavbar() {
    return `
      <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
              <a class="navbar-item" href="../instructorHome.instructorHome.html">
                  <img src="../media/learnscaping_logo.png" width="210">
              </a>
          </div>
  
          <div id="navbarBasicExample" class="navbar-menu">
              <div class="navbar-start">
                  <a class="navbar-item" href="../instructorHome.instructorHome.html">
                      Home
                  </a>
          </div>
      </div>
      </nav> `;
}

export async function renderTitleForm() {
    return `
    <form id="replace" class="box">
        <h1 class="title">Add Title</h1>
        <div class="field">
            <div class="control">
                <input id="titleValue" class="input" type="text" placeholder="Title">
            </div>
            <p id="error"></p>
        </div>
        
        <button id="submitTitleButton" type="submit" class="button is-success">Submit Title</button>
    </form>

    <article id="message" class="message is-info">
        <div class="message-header">
            <p>Info</p>
        </div>
        <div class="message-body">
            Welcome to the Create Course feature! Before you start, please read the following to learn about how Courses work.<br><br>
            - When creating a course, it is best to complete it fully if possible.<br> 
            - A course is considered to include both lesson pages and a test.<br>
            - <strong>Do not</strong> click away from the create course page until you are done.<br>
            - If you must step away before completing the course, make sure to create at least <strong>one lesson page</strong> AND <strong>one test question</strong>
            so that our system saves your course.<br>
            - If succesfully saved, you can finish your course through the "Edit Course" feature.<br>
            - Please ensure that when adding lesson slides/questions you do so in the final order you intend. Reorganizing is difficult in the editor.
        </div>
    </article>
    `;
}

export async function handleSubmitTitleButtonPress(event) {
    event.preventDefault();

    let title = document.getElementById("titleValue").value;

    // check for empty title value
    if (title.length === 0) {
        event.preventDefault();
        $("#error").replaceWith(
            `<p id="error" class="help is-danger">* A title is required</p>`
        );
        return;
    }

    // CREATE NEW Lesson OBJECT
    let course = {
        slides: [],
        tid: null,
        title: title,
    };

    let db = firebase.firestore();
    let cid = ID();

    // Add a new document with a generated id.
    db.collection("courses").doc(cid).set(course);

    $("#replace").replaceWith(`${await renderContentForm(cid)}`);
    $("#message").remove();
}

export async function renderContentForm(cid) {
    return `
    <form id="replace" class="box">
        <h1 class="title">New Page</h1>

        <div class="field">
            <label class="label">Header</label>
            <div class="control">
                <input id="header" class="input" type="text" placeholder="Enter a page header">
            </div>
            <p id="headerError"></p>
        </div>

        <div class="field">
            <label class="label">Text</label>
            <div class="control">
                <textarea id="text" class="textarea" placeholder="Enter lesson text here" style="white-space: pre-wrap"></textarea>
            </div>
            
            <p id="textError"></p>
        </div>

        <div class="file is-boxed">
            <label class="file-label">
                <input id="fileUpload" class="file-input" type="file" name="media" accept="image/*">
                <span class="file-cta">
                    <span class="file-icon">
                        <i class="fa fa-upload"></i>
                    </span>
                    <span class="file-label">
                        Upload an image…
                    </span>
                </span>
            </label>
        </div>
        
        <div class="buttons is-right">
            <button id="savePageButton" type="submit" class="button is-success" data-cid="${cid}">Save</button>
            <button id="cancelPageButton" class="button" data-cid="${cid}">Cancel</button>
        </div>
    </form>`;
}

export async function handleSavePageButtonPress(event) {
    event.preventDefault();

    let cid = event.target.getAttribute("data-cid");

    let header = document.getElementById("header").value;
    let text = document.getElementById("text").value;
    let media = $("#fileUpload")[0].files[0];

    // check for empty inputs
    if (header.length === 0) {
        $("#headerError").replaceWith(
            `<p id="headerError" class="help is-danger">* Please add a header</p>`
        );

        return;
    } else if (text.length === 0) {
        $("#textError").replaceWith(
            `<p id="textError" class="help is-danger">* Please add lesson text</p>`
        );

        return;
    }

    let slide;

    // upload media to firebase
    if (media != undefined) {
        const storageRef = firebase.storage().ref();
        let mediaRef = storageRef.child(`${media.name}`);

        mediaRef.put(media);

        slide = {
            sid: ID(),
            header: header,
            text: text,
            media: media.name,
        };
    } else {
        slide = {
            sid: ID(),
            header: header,
            text: text,
            media: null,
        };
    }

    // Update firestore
    let db = firebase.firestore();
    let courseRef = db.collection("courses").doc(cid);

    courseRef.update({
        slides: firebase.firestore.FieldValue.arrayUnion(slide),
    });

    $("#replace").replaceWith(`${await renderConnectorForm(cid)}`);
}

export async function handleCancelPageButtonPress(event) {
    let cid = event.target.getAttribute("data-cid");

    $("#replace").replaceWith(`${await renderConnectorForm(cid)}`);
}

export async function renderConnectorForm(cid) {
    return `
    <div id="replace" class="box">
        <h1 class="title">What's next?</h1>
        <div class="buttons">
            <button id="addContentButton" class="button is-success" data-cid="${cid}">Add Content</button>
            <button id="toTestButton" class="button" data-cid="${cid}">Create Test</button>
        </div>
    </div>

    <article id="message" class="message">
        <div class="message-body">
            When all lesson pages have been added, complete the course by creating a test. (*All courses must have a test)
        </div>
    </article>
    `;
}

export async function handleAddContentButtonPress(event) {
    let cid = event.target.getAttribute("data-cid");

    $("#replace").replaceWith(`${await renderContentForm(cid)}`);
    $("#message").remove();
}

export async function handleToTestButtonPress(event) {
    let cid = event.target.getAttribute("data-cid");

    $("#message").remove();
    $("#createCourseBody").replaceWith(`${await renderCreateTestBody(cid)}`);
}

export async function renderGradeForm(cid) {
    return `
    <form id="replace" class="box">
        <h1 class="title">Set Passing Grade</h1>
        <div class="field">
            <div class="control">
                <input id="grade" class="input" type="text" placeholder="ex. 70">
            </div>
            <p id="error"></p>
        </div>
        
        <button id="submitGradeButton" type="submit" class="button is-success" data-cid="${cid}">Submit Grade</button>
    </form>

    <article id="message" class="message">
        <div class="message-body">
            Welcome to the Create Test feature! Start by designating the required passing grade. 
            Your progress will be saved as you go. Feel free to finish in one sitting or return to it later by accessing it through the "Unfinished Courses" section on the home page.
        </div>
    </article>
    `;
}

export async function handleSubmitGradeButtonPress(event) {
    event.preventDefault();

    let cid = event.target.getAttribute("data-cid");
    let grade = document.getElementById("grade").value;

    // check for valid input
    if (grade.length === 0) {
        $("#error").replaceWith(
            `<p id="error" class="help is-danger">* A minimum passing grade is required</p>`
        );
        return;
    } else if (isNaN(grade)) {
        $("#error").replaceWith(
            `<p id="error" class="help is-danger">* Please enter a number</p>`
        );
        return;
    }

    // Update firebase: create new test obj and link to course
    let tid = ID();
    let test = {
        cid: cid,
        passingGrade: grade,
        questions: [],
    };

    let db = firebase.firestore();
    // Add a new test document to tests with a generated id.
    db.collection("tests").doc(tid).set(test);

    // add tid to corresponding course
    db.collection("courses").doc(cid).update({
        tid: tid,
    });

    $("#message").remove();
    $("#replace").replaceWith(`${await renderQuestionForm(tid)}`);
}

export async function renderQuestionForm(tid) {
    return `
    <form id="replace" class="box">
        <h1 class="title">Add Question</h1>

        <div class="field">
            <label class="label">Question</label>
            <div class="control">
                <textarea id="questionValue" class="textarea" placeholder="Question" style="white-space: pre-wrap"></textarea>
            </div>
        </div>

        <div class="field">
            <label class="label">Answer A</label>
            <div class="control">
                <textarea id="aValue" class="textarea" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
            </div>

            <label class="checkbox">
            <input id="aCheck" type="checkbox">
                Correct Answer
            </label>
        </div>
        <div class="field">
            <label class="label">Answer B</label>
            <div class="control">
                <textarea id="bValue" class="textarea" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
            </div>

            <label class="checkbox">
            <input id="bCheck" type="checkbox">
                Correct Answer
            </label>
        </div>
        <div class="field">
            <label class="label">Answer C</label>
            <div class="control">
                <textarea id="cValue" class="textarea" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
            </div>

            <label class="checkbox">
            <input id="cCheck" type="checkbox">
                Correct Answer
            </label>
        </div>
        <div class="field">
            <label class="label">Answer D</label>
            <div class="control">
                <textarea id="dValue" class="textarea" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
            </div>

            <label class="checkbox">
            <input id="dCheck" type="checkbox">
                Correct Answer
            </label>
        </div>

        <p id="error"></p>
        
        <div class="buttons is-right">
            <button id="submitQuestionButton" type="submit" class="button is-success" data-tid="${tid}">Submit Question</button>
            <button id="cancelQuestionButton" class="button" data-tid="${tid}">Cancel</button>
        </div>
    </form>`;
}

export async function handleSubmitQuestionButtonPress(event) {
    let tid = event.target.getAttribute("data-tid");

    let aCheck = document.getElementById("aCheck").checked;
    let bCheck = document.getElementById("bCheck").checked;
    let cCheck = document.getElementById("cCheck").checked;
    let dCheck = document.getElementById("dCheck").checked;

    let questionValue = document.getElementById("questionValue").value;
    let aValue = document.getElementById("aValue").value;
    let bValue = document.getElementById("bValue").value;
    let cValue = document.getElementById("cValue").value;
    let dValue = document.getElementById("dValue").value;

    // CHECK FOR EMPTY ENTRIES AND CHECK FOR ONE CORRECT ANSWER
    if (
        questionValue.length === 0 ||
        aValue.length === 0 ||
        bValue.length === 0 ||
        cValue.length === 0 ||
        dValue.length === 0
    ) {
        event.preventDefault();
        $("#error").replaceWith(
            `<p id="error" class="help is-danger">* Please fill out each section.</p>`
        );
        return;
    } else if (
        aCheck == false &&
        bCheck == false &&
        cCheck == false &&
        dCheck == false
    ) {
        event.preventDefault();
        $("#error").replaceWith(
            `<p id="error" class="help is-danger">* Please mark one answer as the correct answer.</p>`
        );
        return;
    }

    // create new question obj
    let question = {
        answerA: {
            data: aValue,
            isCorrect: false,
        },
        answerB: {
            data: bValue,
            isCorrect: false,
        },
        answerC: {
            data: cValue,
            isCorrect: false,
        },
        answerD: {
            data: dValue,
            isCorrect: false,
        },
        question: questionValue,
    };

    // mark correct answer in obj
    if (aCheck) {
        question.answerA.isCorrect = true;
    } else if (bCheck) {
        question.answerB.isCorrect = true;
    } else if (cCheck) {
        question.answerC.isCorrect = true;
    } else if (dCheck) {
        question.answerD.isCorrect = true;
    }

    // write question to test obj
    const db = firebase.firestore();
    let testRef = db.collection("tests").doc(tid);

    testRef.update({
        questions: firebase.firestore.FieldValue.arrayUnion(question),
    });

    $("#replace").replaceWith(`${await renderAddQuestionForm(tid)}`);
}

export async function handleCancelQuestionButtonPress(event) {
    let tid = event.target.getAttribute("data-tid");

    $("#replace").replaceWith(`${await renderAddQuestionForm(tid)}`);
}

export async function renderAddQuestionForm(tid) {
    return `
    <form id="replace" class="box">
        <h1 class="title">What's next?</h1>
        <div class="buttons">
            <button id="addQuestionButton" class="button is-success" data-tid="${tid}">Add Question</button>
            <button id="finishButton" class="button" data-tid="${tid}">Finish</button>
        </div>
    </form>
    `;
}

export async function handleAddQuestionButtonPress(event) {
    let tid = event.target.getAttribute("data-tid");

    $("#replace").replaceWith(`${await renderQuestionForm(tid)}`);
}

export async function handleFinishButtonPress() {
    $("#replace").replaceWith(`${await renderFinish()}`);
}

export async function renderFinish() {
    return `
    <div id="replace" class="box">
        <h1 class="title">Course Created!</h1>
        <p>
            Congrats! Your new course is now saved. You can edit and assign your course from the course list on the home page.
        <p>
    </div>
    `;
}

export async function renderCreateCourseBody() {
    return `
    <section id="createCourseBody" class="section">
        <div class="container">
            <h1 class="title is-1">Create Course</h1>
            ${await renderTitleForm()}
        </div>
    </section>
    `;
}

export async function renderCreateTestBody(cid) {
    return `
    <section class="section">
        <div class="container">
            <h1 class="title is-1">Create Test</h1>
            ${await renderGradeForm(cid)}
        </div>
    </section>
    `;
}

//Generates a random ID
var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
};

export async function loadIntoDOM() {
    const $root = $("#root");

    // load starting page
    $root.append(await renderNavbar());
    $root.append(await renderCreateCourseBody());

    // button functionality
    $root.on("click", "#submitTitleButton", handleSubmitTitleButtonPress);
    $root.on("click", "#savePageButton", handleSavePageButtonPress);
    $root.on("click", "#cancelPageButton", handleCancelPageButtonPress);
    $root.on("click", "#addContentButton", handleAddContentButtonPress);
    $root.on("click", "#toTestButton", handleToTestButtonPress);
    $root.on("click", "#submitGradeButton", handleSubmitGradeButtonPress);
    $root.on("click", "#addQuestionButton", handleAddQuestionButtonPress);
    $root.on("click", "#finishButton", handleFinishButtonPress);
    $root.on("click", "#submitQuestionButton", handleSubmitQuestionButtonPress);
    $root.on("click", "#cancelQuestionButton", handleCancelQuestionButtonPress);
}

$(function () {
    loadIntoDOM();
});
