/**
 * Authors: Ari Singer-Freeman, Aaorn Zhang, Garrett Olcott, Ben Rosenberger
 * Summary: This page handles course editting.
 */

const $root = $("#root");
const db = firebase.firestore();
let courses = db.collection("courses");
let tests = db.collection("tests");
let tid = null;
let slideNum = 0;
let questionNum = 0;

export async function renderPage(cid) {
    await renderNavbar();

    $root.append(`
    <div class="section">
        <div class="container">
                ${await renderInfo()}
                ${await renderCourseContent(cid)}
                ${await renderTest(cid)}

                <div id="insertNewTest">
                </div>

                <div id="slidesUpdateSuccessNotif">
                </div>
                <div id="testUpdateSuccessNotif">
                </div>
                <div id="errorNotification">
                </div>

                <div class="buttons is-right">
                    <span id="savePageButton" type="submit" class="button icon-text is-success is-large" data-cid="${cid}">
                        <span class="icon">
                            <i class="fas fa-save"></i>
                        </span>
                    <span>Save Changes</span>
                    </span>
                </div>
        </div>
    </div>
    `);

    // quill
    var slides_textboxes = $("div[id^='text']");
    for (let i = 0; i < slides_textboxes.length; i++) {
        createQuill(slides_textboxes[i]);
    }

    // button functionality
    $root.on("click", "#savePageButton", handleSavePageButtonPress);
    $root.on("click", "#addContentButton", handleAddContentAndAddQuill);
    $root.on("click", "#addQuestionButton", handleAddQuestion);
    $root.on("click", "#addCompleteTest", createNewTest);

    $root.on("click", "#delete", (event) => {
        let isContinue = confirm(
            "Are you sure you want to delete? Reminder: don't forget to save after deleting."
        );
        if (!isContinue) {
            return;
        }

        $(`#${event.currentTarget.getAttribute("data-id")}`).remove();
    });

    $root.on("click", "#deleteNotif", (event) => {
        $(`#${event.currentTarget.getAttribute("data-notifID")}`).replaceWith(`
            <div id="${event.currentTarget.getAttribute("data-notifID")}">
            </div>
        `);
    });
}

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
            <a class="navbar-item nav-item icon-text" href="../instructorHome/instructorHome.html">
                <span class="icon">
                    <i class="fas fa-home"></i>
                </span>
                <span>&nbspHome</span>
            </a>
            <a class="navbar-item nav-item icon-text" href="../adminPage/adminPage.html">
                <span class="icon">
                    <i class="fas fa-users"></i>
                </span>
                <span>&nbspUser Control Panel</span>
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
                alert("Sign out error: ", error);
            });
    });

    return;
}

export async function renderInfo() {
    // renders an info message under the title
    return `
    <div class="section">
    <div class="container">
    <h1 class="title is-1">Course Editor <i class="far fa-edit"></i></h1>
    <article id="message" class="message is-dark">
        <div class="message-body">
            <strong>Welcome to the Course Editor! Before you start, please read the following to learn about how editing courses works.</strong><br>
            - All parts of the course are pre-populated with their current values.<br> 
            - <strong>To save changes:</strong> press the "Save Changes" button.<br>
            - If you would like to discard all changes, simply leave the page.<br>
        </div>
    </article>
    </div>
    </div>
`;
}

export async function renderCourseSection(cid, data) {
    return `
    <div id="replace" class="section">
        <div class="container">
            <div class="box">
                
                <div id="coursecontent">
                    ${await renderTitle(data.title)}
                    ${await renderSlides(data.slides)}
                </div>

                <div class="section  py-5">
                <div class="buttons is-centered" id="divAddContent">                    
                    <span id="addContentButton" class="button icon-text is-success is-outlined is-medium" data-cid="${cid}">
                        <span class="icon">
                            <i class="fas fa-plus"></i>
                        </span>
                        <span>Add Slide</span>
                    </span>
                </div>
                </div>
                
            </div>
        </div>
    </div>
    `;
}

export async function renderTitle(title) {
    return `
        <div class="section py-5">
        <h2 class="title is-2">Course Content</h2>
            <div class="box">
                <h1 class="label">Title: ${title}</h1>
                <div class="field">
                    <div class="control">
                        <input
                            id="titleValue"
                                class="input slideTitle"
                                type="text"
                                value="${title}"
                            />
                    </div>
                    <p id="titleError"></p>
                </div>
            </div>   
        </div>  
    `;
}

export async function renderSlides(slides) {
    let html = ``;
    slides.forEach((slide) => {
        slideNum++;
        html += `
    <div class="section py-5" id="${slide.sid}">
        <div class="container">
            <div class="box">
                <div style="display: flex; justify-content: space-between">
                <h3 class="title">Slide ${slideNum}</h3>
                <button id="delete" class="button is-danger is-outlined" title="Delete Slide" data-id="${slide.sid}">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>
                </div>
                <div class="field">
                    <label class="label">Header</label>
                    <div class="control">
                        <input
                            id="header${slide.sid}"
                            class="input header"
                            data-sid="${slide.sid}"
                            type="text"
                            value="${slide.header}"
                            />
                    </div>

                    <p id="headerError${slide.sid}"></p>

                </div>
                <div class="field">
                    <label class="label">Text</label>
                        <div class="control">
                            <div
                                id="text${slide.sid}"
                                class="content"
                                data-sid="${slide.sid}"
                            >
                                ${slide.text}
                            </div>
                        </div>

                        <p id="textError${slide.sid}"></p>
                </div>
            </div>
        </div>
    </div>`;
    });
    return html;
}

export async function renderCourseContent(cid) {
    let html = ``;

    let courseRef = courses.doc(cid);

    // render course material
    await courseRef
        .get()
        .then(async (doc) => {
            if (doc.exists) {
                html += await renderCourseSection(cid, doc.data());
                tid = doc.data().tid;
            } else {
                // doc.data() will be undefined in this case
                alert("Error getting course doc");
            }
        })
        .catch((error) => {
            alert("Error getting course:", error);
        });

    return html;
}

export async function renderPassingGrade(grade) {
    return `
        <div class="section  py-5">
            <h2 class="title is-2">Test</h2>
            <div class="box">
                <h1 class="label">Passing Grade</h1>
                <div class="field">
                    <div class="control">
                        <input id="grade" class="input" type="text" value="${grade}">
                    </div>
                    <p id="gradeError"></p>
                </div>
            </div>
        </div>
    `;
}

export async function renderQuestions(questions) {
    let qid;

    let isAChecked;
    let isBChecked;
    let isCChecked;
    let isDChecked;
    let html = ``;

    questions.forEach((question) => {
        qid = ID();
        if (question.answerA.isCorrect) {
            isAChecked = "checked";
        } else {
            isAChecked = "";
        }
        if (question.answerB.isCorrect) {
            isBChecked = "checked";
        } else {
            isBChecked = "";
        }
        if (question.answerC.isCorrect) {
            isCChecked = "checked";
        } else {
            isCChecked = "";
        }
        if (question.answerD.isCorrect) {
            isDChecked = "checked";
        } else {
            isDChecked = "";
        }
        questionNum++;
        html += `
    <div class="section  py-5" id="${qid}">
    <div class ="box">
        <div style="display: flex; justify-content: space-between">
                <h3 class="title">Question ${questionNum}</h3>
                <button id="delete" class="button is-danger is-outlined" title="Delete Question" data-id="${qid}">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>
                </div>
    <div class="field">
        <label class="label">Question</label>
        <div class="control">
            <textarea class="textarea questionValue" placeholder="Question" style="white-space: pre-wrap" data-qid="${qid}">${question.question}</textarea>
        </div>
    </div>
    <div class="field">
        <label class="label">Answer A</label>
        <div class="control">
            <textarea class="textarea aValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerA.data}</textarea>
        </div>
        <label class="checkbox">
        <input type="checkbox" class ="aCheck" ${isAChecked} >
            Correct Answer
        </label>
    </div>
    <div class="field">
        <label class="label">Answer B</label>
        <div class="control">
            <textarea class="textarea bValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerB.data}</textarea>
        </div>
        <label class="checkbox ">
        <input type="checkbox" class = "bCheck" ${isBChecked}>
            Correct Answer
        </label>
    </div>
    <div class="field">
        <label class="label">Answer C</label>
        <div class="control">
            <textarea class="textarea cValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerC.data}</textarea>
        </div>
        <label class="checkbox ">
        <input type="checkbox" class = "cCheck" ${isCChecked}>
            Correct Answer
        </label>
    </div>
    <div class="field">
        <label class="label">Answer D</label>
        <div class="control">
            <textarea class="textarea dValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerD.data}</textarea>
        </div>
        <label class="checkbox">
        <input type="checkbox" ${isDChecked} class = "dCheck">
            Correct Answer
        </label>
        <p id="questionError${qid}"></p>
    </div>
    </div>
    </div>
    `;
    });

    return html;
}

export async function renderTest(cid) {
    let html = ``;
    let addTestButton = `
    <div class= "buttons is-centered">
        <button id="addCompleteTest" class="button is-info is-medium icon-text is-outlined" data-cid="${cid}">
            <span class="icon">
                <i class="fas fa-plus"></i>
            </span>
            <span>Add Test</span>
        </button>
    </div>`;

    if (tid === null) {
        html = addTestButton;
        return html;
    }

    let testRef = tests.doc(tid);

    await testRef
        .get()
        .then(async (doc) => {
            if (doc.exists) {
                if (doc.data().questions.length < 1) {
                    html = `
                    <div id="" class="section">
                        <div class="container">
                            <div class="box">
                
                                <div id="testcontent">
                                    ${await renderPassingGrade(doc.data().passingGrade)}
                                </div>

                                
                                <div class="section  py-5">
                                <div class="buttons is-centered" id="divAddContent">
                                    <span id="addQuestionButton" class="button icon-text is-success is-outlined is-medium" data-cid="${cid}">
                                        <span class="icon">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                        <span>Add Question</span>
                                    </span>
                                </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    `;
                } else {
                    html = `
                    <div id="" class="section">
                        <div class="container">
                            <div class="box">
                
                                <div id="testcontent">
                                    ${await renderPassingGrade(doc.data().passingGrade)}
                                    ${await renderQuestions(doc.data().questions)}
                                </div>

                                <div class="section  py-5">
                                <div class="buttons is-centered" id="divAddContent">
                                    <span id="addQuestionButton" class="button icon-text is-success is-outlined is-medium" data-cid="${cid}">
                                        <span class="icon">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                        <span>Add Question</span>
                                    </span>
                                </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    `;
                }
            } else {
                // doc.data() will be undefined in this case
                alert("Test does not exist.");
            }
        })
        .catch((error) => {
            alert("Error getting test:", error);
        });

    return html;
}

export async function renderNotification(notifID, color, message) {
    return `
    <div class="section  py-5" id="${notifID}">
        <div class="notification ${color}">
            <button class="delete" id="deleteNotif" data-notifID="${notifID}"></button>
            ${message}
        </div>
    </div>
    `;
}

export async function handleSavePageButtonPress(event) {
    event.preventDefault();
    const db = firebase.firestore();
    let coursesDB = db.collection("courses");

    // START of COLLECT AND UPDATE COURSE CONTENT
    let cid = document.getElementById("savePageButton").getAttribute("data-cid");
    let title = document.getElementById("titleValue").value;

    let data;

    // get old course data
    await coursesDB.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == cid) {
                data = doc.data();
            }
        });
    });

    let count;
    let slides = [];
    let headers = document.getElementsByClassName("header");
    let texts = document.getElementsByClassName("ql-editor");
    let sid;

    for (count = 0; count < headers.length; count++) {
        let header = headers[count].value;
        let text = texts[count].innerHTML;
        sid = headers[count].getAttribute("data-sid");

        // check for empty title value
        if (title.length === 0) {
            $("#errorNotification").replaceWith(
                await renderNotification(
                    "errorNotification",
                    "is-danger",
                    "<strong>Error saving course:</strong> Course title cannot be empty."
                )
            );
            $("#titleError").replaceWith(
                await renderNotification("titleError", "is-danger", "Please add a title.")
            );
            return;
        }

        // check for empty inputs
        if (header.length === 0) {
            $("#errorNotification").replaceWith(
                await renderNotification(
                    "errorNotification",
                    "is-danger",
                    "<strong>Error saving slides:</strong> Please ensure all slide headers are filled out."
                )
            );
            $(`#headerError${sid}`).replaceWith(
                await renderNotification(`headerError${sid}`, "is-danger", "Please add a header.")
            );

            return;
        } else if (text === "<p><br></p>") {
            $("#errorNotification").replaceWith(
                await renderNotification(
                    "errorNotification",
                    "is-danger",
                    "<strong>Error saving slides:</strong> Please ensure all slides have text/media content."
                )
            );
            $(`#textError${sid}`).replaceWith(
                await renderNotification(`textError${sid}`, "is-danger", "Slide must have content.")
            );

            return;
        }

        // store updated slide
        let slide;
        slide = {
            sid: document.getElementsByClassName("header")[count].getAttribute("data-sid"),
            header: header,
            text: text,
            media: null,
        };
        slides.push(slide);
    }

    let courseRef = coursesDB.doc(cid);

    // update slides
    courseRef.update({
        title: title,
        slides: slides,
    });

    $("#slidesUpdateSuccessNotif").replaceWith(
        await renderNotification(
            "slidesUpdateSuccessNotif",
            "is-success",
            "Slides updated successfully!"
        )
    );

    // START HANDLING TEST DATA
    let tid = data.tid;
    if (tid != null) {
        let grade = document.getElementById("grade").value;

        // check for valid grade input
        if (grade.length === 0) {
            $("#gradeError").replaceWith(
                await renderNotification(
                    "gradeError",
                    "is-danger",
                    "Please enter a minimum passing grade."
                )
            );
            $("#errorNotification").replaceWith(
                await renderNotification(
                    "errorNotification",
                    "is-danger",
                    "<strong>Error saving test:</strong> Passing grade for the test is invalid."
                )
            );
            return;
        } else if (isNaN(grade)) {
            $("#gradeError").replaceWith(
                await renderNotification(
                    "gradeError",
                    "is-danger",
                    "Please enter a numerical value."
                )
            );
            $("#errorNotification").replaceWith(
                await renderNotification(
                    "errorNotification",
                    "is-danger",
                    "<strong>Error saving test:</strong> Passing grade for the test is invalid."
                )
            );
            return;
        }

        let aCheckboxes = document.getElementsByClassName("aCheck");
        let bCheckboxes = Array.from(document.getElementsByClassName("bCheck"));
        let cCheckboxes = Array.from(document.getElementsByClassName("cCheck"));
        let dCheckboxes = Array.from(document.getElementsByClassName("dCheck"));
        let qv = document.getElementsByClassName("questionValue");
        let aV = document.getElementsByClassName("aValue");
        let bV = document.getElementsByClassName("bValue");
        let cV = document.getElementsByClassName("cValue");
        let dV = document.getElementsByClassName("dValue");
        let aCheck, bCheck, cCheck, dCheck;
        let questionValue;
        let aValue, bValue, cValue, dValue;
        let question;
        let questions = [];

        for (let i = 0; i < aCheckboxes.length; i++) {
            aCheck = aCheckboxes[i].checked;
            bCheck = bCheckboxes[i].checked;
            cCheck = cCheckboxes[i].checked;
            dCheck = dCheckboxes[i].checked;
            questionValue = qv[i].value;
            aValue = aV[i].value;
            bValue = bV[i].value;
            cValue = cV[i].value;
            dValue = dV[i].value;

            // CHECK FOR EMPTY ENTRIES AND CHECK FOR ONE CORRECT ANSWER
            if (
                questionValue.length === 0 ||
                aValue.length === 0 ||
                bValue.length === 0 ||
                cValue.length === 0 ||
                dValue.length === 0
            ) {
                event.preventDefault();
                $(`#questionError${qv[i].getAttribute("data-qid")}`).replaceWith(
                    await renderNotification(
                        `questionError${qv[i].getAttribute("data-qid")}`,
                        "is-danger",
                        "Please fill out each section of the question."
                    )
                );
                $("#errorNotification").replaceWith(
                    await renderNotification(
                        "errorNotification",
                        "is-danger",
                        "<strong>Error saving question:</strong> Please ensure every question's content is filled out."
                    )
                );
                return;
            } else if (aCheck == false && bCheck == false && cCheck == false && dCheck == false) {
                event.preventDefault();
                $(`#questionError${qv[i].getAttribute("data-qid")}`).replaceWith(
                    await renderNotification(
                        `questionError${qv[i].getAttribute("data-qid")}`,
                        "is-danger",
                        "Please mark one answer as the correct answer."
                    )
                );
                $("#errorNotification").replaceWith(
                    await renderNotification(
                        "errorNotification",
                        "is-danger",
                        "<strong>Error saving question:</strong> Please ensure every question has a correct answer selected."
                    )
                );
                return;
            }
            question = {
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
            questions.push(question);
        }

        // write questions to test obj
        let testRef = db.collection("tests").doc(tid);

        testRef.update({
            cid: cid,
            passingGrade: grade,
            questions: questions,
        });
    }

    $("#testUpdateSuccessNotif").replaceWith(
        await renderNotification(
            "testUpdateSuccessNotif",
            "is-success",
            "Test updated successfully!"
        )
    );
}

export async function handleAddContent(sid) {
    slideNum++;
    let html = `
    <div class="section  py-5" id="${sid}">
        <div class="container">
            <div class="box">
            <div style="display: flex; justify-content: space-between">
            <h3 class="title">New Slide</h3>
            <button id="delete" class="button is-danger is-outlined" title="Delete Slide" data-id="${sid}">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>
            
            </div>
                <div class="field">
                    <label class="label">Header</label>
                    <div class="control">
                        <input
                            id="header${sid}"
                            class="input header"
                            data-sid="${sid}"
                            type="text"
                            placeholder="Header"
                            />
                    </div>

                    <p id="headerError${sid}"></p>

                </div>
                <div class="field">
                    <label class="label">Text</label>
                        <div class="control">
                            <div
                                id="text${sid}"
                                class="content"
                                data-sid="${sid}"
                            >
                                
                            </div>
                        </div>

                        <p id="textError${sid}"></p>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

export async function handleAddQuestion(event) {
    event.preventDefault();
    let qid = ID();
    let html = ` 
    <div class="section  py-5" id="${qid}">
    <div class="box">
        <div style="display: flex; justify-content: space-between">
            <h3 class="title">New Question</h3>
            <button id="delete" class="button is-danger is-outlined" title="Delete Question" data-id="${qid}">
                <span class="icon">
                    <i class="fas fa-trash"></i>
                </span>
            </button>
        </div>
        <div class="field">
            <label class="label">Question</label>
                <div class="control">
                    <textarea class="textarea questionValue" placeholder="Question" style="white-space: pre-wrap" data-qid="${qid}"></textarea>
                </div>
            </div>
            <div class="field">
                <label class="label">Answer A</label>
                <div class="control">
                    <textarea class="textarea aValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox">
                <input type="checkbox" class ="aCheck">
                    Correct Answer
                </label>
            </div>
            <div class="field">
                <label class="label">Answer B</label>
                <div class="control">
                    <textarea class="textarea bValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox ">
                <input type="checkbox" class = "bCheck">
                    Correct Answer
                </label>
            </div>
            <div class="field">
                <label class="label">Answer C</label>
                <div class="control">
                    <textarea class="textarea cValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox ">
                <input type="checkbox" class = "cCheck">
                    Correct Answer
                </label>
            </div>
            <div class="field">
                <label class="label">Answer D</label>
                <div class="control">
                    <textarea class="textarea dValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox">
                <input type="checkbox"class = "dCheck">
                    Correct Answer
                </label>
            </div>
            <p id="questionError${qid}"></p>
        </div>
    </div>
    </div>`;

    $("#testcontent").append(html);
    return;
}

export async function handleAddContentAndAddQuill(event) {
    event.preventDefault();
    let sid = ID();
    $("#coursecontent")
        .append(`${await handleAddContent(sid)}`)
        .append(function () {
            var quill = new Quill("#text" + sid, {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["image"],
                        ["link"],
                        [{ script: "sub" }, { script: "super" }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["clean"],
                        [
                            { align: "" },
                            { align: "center" },
                            { align: "right" },
                            { align: "justify" },
                        ],
                    ],
                    imageResize: {},
                },
                theme: "snow",
                placeholder: "",
            });
            return quill;
        });
}

//Generates a random ID
var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
};

export async function createNewTest(event) {
    event.preventDefault();
    let cid = event.currentTarget.getAttribute("data-cid");
    let grade = 70;
    let tid = ID();
    let qid = ID();
    let courseRef = await courses.doc(cid);
    questionNum++;

    let test = {
        cid: cid,
        passingGrade: grade,
        questions: [],
    };

    // Add a new test document to tests with a generated id.
    await tests.doc(tid).set(test);
    await courseRef.update({ tid: tid });
    let html = `
    <div class="section">
        <div class="container">
            <div class="box">

                <div id="testcontent">

                    <section class="section  py-5">
                        <div class="container">
                            <h1 class="title is-2">Test</h1>
                            <div class="box">
                                <h1 class="label">Passing Grade</h1>
                                <div class="field">
                                    <div class="control">
                                        <input id="grade" class="input" type="text" value="70">
                                    </div>
                                    <p id="gradeError"></p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div class="section  py-5" id="${qid}">
                        <div class = "box">
                            <div style="display: flex; justify-content: space-between">
                                <h3 class="title">Question ${questionNum}</h3>
                                <button id="delete" class="button is-danger is-outlined" title="Delete Slide" data-id="${qid}">
                                    <span class="icon">
                                        <i class="fas fa-trash"></i>
                                    </span>
                                </button>
                            </div>
                           
                            <div class="field">
                                <label class="label">Question</label>
                                    <div class="control">
                                        <textarea class="textarea questionValue" placeholder="Question" style="white-space: pre-wrap" data-qid="${qid}"></textarea>
                                    </div>
                            </div>
                            <div class="field">
                                <label class="label">Answer A</label>
                                <div class="control">
                                    <textarea class="textarea aValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                                </div>
                                <label class="checkbox">
                                    <input type="checkbox" class ="aCheck">
                                        Correct Answer
                                </label>
                            </div>
                            <div class="field">
                                <label class="label">Answer B</label>
                                <div class="control">
                                    <textarea class="textarea bValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                                </div>
                                <label class="checkbox ">
                                    <input type="checkbox" class = "bCheck">
                                        Correct Answer
                                </label>
                            </div>
                            <div class="field">
                                <label class="label">Answer C</label>
                                <div class="control">
                                    <textarea class="textarea cValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                                </div>
                                <label class="checkbox ">
                                    <input type="checkbox" class = "cCheck">
                                        Correct Answer
                                </label>
                            </div>
                            <div class="field">
                                <label class="label">Answer D</label>
                                <div class="control">
                                    <textarea class="textarea dValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                                </div>
                                <label class="checkbox">
                                    <input type="checkbox" class = "dCheck">
                                        Correct Answer
                                </label>
                            </div>
                            <p id="questionError${qid}"></p>
                        </div>
                    </div>
                </div>


                <div class="section  py-5">
                    <div class="buttons is-centered" id="divAddContent">
                        <span id="addQuestionButton" class="button icon-text is-success is-outlined is-medium" data-cid="${cid}">
                            <span class="icon">
                                <i class="fas fa-plus"></i>
                            </span>
                            <span>Add Question</span>
                        </span>
                    </div>
                </div>
            
            </div>
        </div>
    </div>`;

    await event.currentTarget.parentElement.remove();
    await $("#insertNewTest").replaceWith(html);
}
export function createQuill(slidecontent) {
    var quill = new Quill("#" + slidecontent.id, {
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                ["image"],
                ["link"],
                [{ script: "sub" }, { script: "super" }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
                [{ align: "" }, { align: "center" }, { align: "right" }, { align: "justify" }],
            ],
            imageResize: {},
        },
        theme: "snow",
        placeholder: "",
    });
    return quill;
}
export async function loadIntoDOM() {
    // check user auth state
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            let cid;
            try {
                cid = location.search.substring(1);
            } catch (error) {
                // if cid is undefined...redirect to instructor home.
                window.location.href = "../instructorHome/instructorHome.html";
            }

            // load page
            await renderPage(cid);
        } else {
            // No user is signed in. Redirect to login.
            window.location.href = "../loginPage/login.html";
        }
    });
}

$(function () {
    loadIntoDOM();
});
