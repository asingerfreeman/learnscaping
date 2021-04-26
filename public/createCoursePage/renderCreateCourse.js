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
            <strong>Welcome to the Course Creator! Before you start, please read the following to learn about how Courses work.</strong><br>
            - A course must have at least one slide to be saved.<br>
            - Your work will be saved as you go.<br>
            - Return to your work by using the corresponding "Edit" button on the home page.<br>
            - It is best to add lesson slides/questions in the final order you intend. Reorganizing is difficult in the editor.<br><br>
            Happy teaching!
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
        $("#error").replaceWith(`<p id="error" class="help is-danger">* A title is required</p>`);
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
    createQuill();
    $("#message").remove();
}

export async function renderContentForm(cid) {
    return `
    <form id="replace" class="box">
        <h1 class="title">New Slide</h1>

        <div class="field">
            <label class="label">Header</label>
            <div class="control">
                <input id="header" class="input" type="text" placeholder="Enter a page header">
            </div>
            <p id="headerError"></p>
        </div>

        <div class="field">
        <label class="label">Text</label>
        <div id="editor"></div>
        <p id="textError"></p>
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
    let text = $(".ql-editor").html();

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
    slide = {
        sid: ID(),
        header: header,
        text: text,
        media: null,
    };

    // Update firestore
    let db = firebase.firestore();
    let courseRef = db.collection("courses").doc(cid);

    courseRef.update({
        slides: firebase.firestore.FieldValue.arrayUnion(slide),
    });

    $("#replace").replaceWith(`${await renderConnectorForm(cid)}`);
    $("#editor").empty();
}

export async function handleCancelPageButtonPress(event) {
    let cid = event.target.getAttribute("data-cid");

    $("#replace").replaceWith(`${await renderConnectorForm(cid)}`);
    $("#editor").empty();
}

export async function renderConnectorForm(cid) {
    return `
    <div id="replace" class="box">
        <h1 class="title">Slide saved! What's next?</h1>
        <div class="buttons">
            <button id="addContentButton" class="button is-success" data-cid="${cid}">Add Slide</button>
            <button id="toTestButton" class="button" data-cid="${cid}">Create Test</button>
        </div>
    </div>
    `;
}

export async function handleAddContentButtonPress(event) {
    let cid = event.target.getAttribute("data-cid");

    $("#replace").replaceWith(`${await renderContentForm(cid)}`);
    $("#message").remove();
    createQuill();
}

export function createQuill() {
    var quill = new Quill("#editor", {
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                ["image", "code-block"],
                ["link"],
                [{ script: "sub" }, { script: "super" }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
                [{ align: "" }, { align: "center" }, { align: "right" }, { align: "justify" }],
            ],
            imageResize: {},
        },
        theme: "snow",
        placeholder: "Enter slide content here",
    });
    return quill;
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
            Your progress will be saved as you go. Remember you can always return to it later by accessing the course through the "Edit" button on the home page.
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
        $("#error").replaceWith(`<p id="error" class="help is-danger">* Please enter a number</p>`);
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
    } else if (aCheck == false && bCheck == false && cCheck == false && dCheck == false) {
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
        <h1 class="title">Question saved! What's next?</h1>
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
            Congrats! Your work has been saved. You can edit and assign your new course from the home page.
        <p>
        <div class="buttons is-right">
            <a class="button is-success" href="../instructorHome/instructorHome.html">
                <span class="icon">
                    <i class="fas fa-home"></i>
                </span>
                <span>Home</span>
            </a>
        </div>
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
    // check user auth state
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            const userRef = db.collection("users").doc(user.uid);
            await userRef
                .get()
                .then(async (doc) => {
                    if (doc.exists) {
                        let isInstructor = doc.data().isInstructor;

                        // prevents an student from accessing create course page
                        if (!isInstructor) {
                            window.location.href = "../studentHome/studentHome.html";
                        }
                    } else {
                        // doc.data() will be undefined in this case
                        alert(`User doc does not exist`);
                    }
                })
                .catch((error) => {
                    alert(`Get user: ${error}`);
                });

            // load starting page
            await renderNavbar();
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
        } else {
            // No user is signed in. Redirect to login.
            window.location.href = "../loginPage/login.html";
        }
    });
}

$(function () {
    loadIntoDOM();
});
