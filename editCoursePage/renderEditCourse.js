const $root = $("#root");
const db = firebase.firestore();
let courses = db.collection("courses");
let tests = db.collection("tests");
let tid = null;

export async function renderPage(cid) {
    await renderNavbar();

    $root.append(`
    <div class="section">
        <div class="container">
            <h1 class="title is-1">Edit Course</h1>
            ${await renderInfo()}
            ${await renderCourseContent(cid)}
            ${await renderTest(cid)}

            <div id="notification">
            </div>

            <div class="buttons is-right">
                <button id="savePageButton" type="submit" class="button is-success is-medium" data-cid="${cid}">Save Changes</button>
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
        let isContinue = confirm("Are you sure you want to delete the selected slide/question?");
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
            <a class="navbar-item icon-text" href="../instructorHome/instructorHome.html">
                <span class="icon">
                    <i class="fas fa-home"></i>
                </span>
                <span>Home</span>
            </a>
            <a class="navbar-item icon-text" href="../adminPage/adminPage.html">
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
                alert("Sign out error: ", error);
            });
    });

    return;
}

export async function renderInfo() {
    return `
    <div class="section">
    <article id="message" class="message is-info">
        <div class="message-header">
            <p>Info</p>
        </div>
        <div class="message-body">
            Welcome to the Edit Course feature! Before you start, please read the following to learn about how editing courses works.<br><br>
            - All parts of the course are pre-populated with their current values.<br> 
            - No changes will be saved until you hit the 'Save' button at the bottom of the page.<br>
            - If you would like discard all changes, simply leave the page.<br>
        </div>
    </article>
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

                <div class="buttons is-centered" id="divAddContent">
                    <button id="addContentButton" class="button is-success" data-cid="${cid}">
                        Add Slide
                    </button>
                </div>

            </div>
        </div>
    </div>
    `;
}

export async function renderTitle(title) {
    return `
    <div class="section">
        <div class="container">
        <h1 class="title is-2">Course Content</h1>
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
    </div>      
    `;
}

export async function renderSlides(slides) {
    let html = ``;
    slides.forEach((slide) => {
        html += `
    <div class="section" id="${slide.sid}">
        <div class="container">
            <div class="box">
                <div class="field">
                    <label class="label">
                        <span class="level-right">
                            <button
                                class="delete  is-large is-right"
                                id="delete"
                                data-id="${slide.sid}"
                            ></button>
                        </span>
                         Header:
                    </label>

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
    <section class="section">
        <div class="container">
            <h1 class="title is-2">Test</h1>
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
    </section>
    `;
}

export async function renderQuestions(questions) {
    let qid = ID();

    let isAChecked;
    let isBChecked;
    let isCChecked;
    let isDChecked;
    let html = ``;

    questions.forEach((question) => {
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

        html = `
    <div class="section" id="${qid}">
    <div class ="box">
        <div class="buttons is-right">
            <button
            class="delete is-large is-right"
            id="delete"
            data-id="${qid}">
        </div>
    <div class="field">
        <label class="label">Question</label>
        <div class="control">
            <textarea id="questionValue${question.question}" class="textarea questionValue" placeholder="Question" style="white-space: pre-wrap">${question.question}</textarea>
        </div>
    </div>
    <div class="field">
        <label class="label">Answer A</label>
        <div class="control">
            <textarea id="aValue${question.question}" class="textarea aValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerA.data}</textarea>
        </div>
        <label class="checkbox">
        <input id="aCheck${question.question}" type="checkbox" ${isAChecked} class ="aCheck">
            Correct Answer
        </label>
    </div>
    <div class="field">
        <label class="label">Answer B</label>
        <div class="control">
            <textarea id="bValue${question.question}" class="textarea bValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerB.data}</textarea>
        </div>
        <label class="checkbox ">
        <input id="bCheck${question.question}" type="checkbox" ${isBChecked} class = "bCheck">
            Correct Answer
        </label>
    </div>
    <div class="field">
        <label class="label">Answer C</label>
        <div class="control">
            <textarea id="cValue${question.question}" class="textarea cValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerC.data}</textarea>
        </div>
        <label class="checkbox ">
        <input id="cCheck${question.question}" type="checkbox" ${isCChecked} class = "cCheck">
            Correct Answer
        </label>
    </div>
    <div class="field">
        <label class="label">Answer D</label>
        <div class="control">
            <textarea id="dValue${question.question}" class="textarea dValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerD.data}</textarea>
        </div>
        <label class="checkbox">
        <input id="dCheck${question.question}" type="checkbox" ${isDChecked} class = "dCheck">
            Correct Answer
        </label>
    </div>
    </div>
    <p id="questionError"></p>
    </div>
    `;
    });

    return html;
}

export async function renderTest(cid) {
    let html = ``;
    let addTestButton = `
    <div class= "buttons is-centered" id="test">
        <button id="addCompleteTest" class="button is-info" data-cid="${cid}">Add Test</button>
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
                    html = addTestButton;
                } else {
                    html = `
                    <div id="" class="section">
                        <div class="container">
                        
                            <div class="box">
                
                                <div id="testcontent">
                                    ${await renderPassingGrade(doc.data().passingGrade)}
                                    ${await renderQuestions(doc.data().questions)}
                                </div>

                                <div class="buttons is-centered" id="divAddContent">
                                    <button id="addQuestionButton" class="button is-success" data-cid="${cid}">
                                        Add Question
                                    </button>
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
    <div class="section" id="${notifID}">
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
            $("#notification").replaceWith(
                await renderNotification(
                    "notification",
                    "is-danger",
                    "Course title cannot be empty."
                )
            );
            $("#titleError").replaceWith(
                await renderNotification("titleError", "is-danger", "Please add a title.")
            );
            return;
        }

        // check for empty inputs
        if (header.length === 0) {
            $("#notification").replaceWith(
                await renderNotification(
                    "notification",
                    "is-danger",
                    "Please ensure all slide headers are filled out."
                )
            );
            $(`#headerError${sid}`).replaceWith(
                await renderNotification(`headerError${sid}`, "is-danger", "Please add a header.")
            );

            return;
        } else if (text === "<p><br></p>") {
            $("#notification").replaceWith(
                await renderNotification(
                    "notification",
                    "is-danger",
                    "Please ensure all slides have text/media content."
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

    $("#notification").replaceWith(
        await renderNotification("notification", "is-success", "Slides updated successfully!")
    );

    // START HANDLING TEST DATA
    let tid = data.tid;
    if (tid != null) {
        let grade = document.getElementById("grade").value;

        // check for valid grade input
        if (grade.length === 0) {
            $("#gradeError").replaceWith(
                `<p id="error" class="help is-danger">* A minimum passing grade is required</p>`
            );
            return;
        } else if (isNaN(grade)) {
            $("#gradeError").replaceWith(
                `<p id="error" class="help is-danger">* Please enter a number</p>`
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
                $("#questionError").replaceWith(
                    `<p id="questionError" class="help is-danger">* Please fill out each section.</p>`
                );
                return;
            } else if (aCheck == false && bCheck == false && cCheck == false && dCheck == false) {
                event.preventDefault();
                $("#questionError").replaceWith(
                    `<p id="questionError" class="help is-danger">* Please mark one answer as the correct answer.</p>`
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

        // write question to test obj

        let testRef = db.collection("tests").doc(tid);

        testRef.update({
            cid: cid,
            passingGrade: grade,
            questions: questions,
        });
    }
}

export async function handleAddContent(sid) {
    let html = `
    <div class="section" id="${sid}">
        <div class="container">
            <div class="box">
                <div class="field">
                    <label class="label">
                        <span class="level-right">
                            <button
                                class="delete is-large is-right"
                                id="delete"
                                data-id="${sid}"
                            ></button>
                        </span>
                         Header:
                    </label>

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
    let id = ID();

    let html = ` 
    <div class="section" id="${id}">
    <div class = "box">
        <div class="buttons is-right">
            <button
            class="delete  is-large is-right"
            id="delete"
            data-id="${id}">
        </button>
        </div>
        <div class="field">
            <label class="label">Question</label>
                <div class="control">
                    <textarea id="questionValue${id}" class="textarea questionValue" placeholder="Question" style="white-space: pre-wrap"></textarea>
                </div>
            </div>
            <div class="field">
                <label class="label">Answer A</label>
                <div class="control">
                    <textarea id="aValue${id}" class="textarea aValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox">
                <input id="aCheck${id}" type="checkbox" class ="aCheck">
                    Correct Answer
                </label>
            </div>
            <div class="field">
                <label class="label">Answer B</label>
                <div class="control">
                    <textarea id="bValue${id}" class="textarea bValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox ">
                <input id="bCheck${id}" type="checkbox" class = "bCheck">
                    Correct Answer
                </label>
            </div>
            <div class="field">
                <label class="label">Answer C</label>
                <div class="control">
                    <textarea id="cValue${id}" class="textarea cValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox ">
                <input id="cCheck${id}" type="checkbox" class = "cCheck">
                    Correct Answer
                </label>
            </div>
            <div class="field">
                <label class="label">Answer D</label>
                <div class="control">
                    <textarea id="dValue${id}" class="textarea dValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                </div>
                <label class="checkbox">
                <input id="dCheck${id}" type="checkbox"class = "dCheck">
                    Correct Answer
                </label>
            </div>
            <p id="questionError"></p>
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

export async function deleteMedia(event) {
    event.preventDefault();
    const storageRef = firebase.storage().ref();
    let name = event.target.getAttribute("data-image-name");
    let imageRef = storageRef.child(name);
    let cid = event.target.getAttribute("data-cid");
    let sid = event.target.getAttribute("data-sid");
    const db = firebase.firestore();
    let courseRef = await db.collection("courses").doc(cid).get();
    let newSlides = [];
    let newSlide;
    courseRef.data().slides.forEach((slide) => {
        if (slide.sid == sid) {
            newSlide = {
                sid: slide.sid,
                header: slide.header,
                text: slide.text,
                media: null,
            };
            newSlides.push(newSlide);
        } else {
            newSlide = {
                sid: slide.sid,
                header: slide.header,
                text: slide.text,
                media: slide.media.name,
            };
        }
        courseRef = db.collection("courses").doc(cid);
        courseRef.update({ slides: newSlides });
    });

    // Delete the file
    imageRef
        .delete()
        .then(() => {
            // File deleted successfully
            console.log("success");
        })
        .catch((error) => {
            // Uh-oh, an error occurred!
        });
    event.target.parentElement.removeChild(event.target);
}

export async function createNewTest(event) {
    event.preventDefault();
    let cid = event.target.getAttribute("data-cid");
    let grade = 70;
    let tid = ID();

    let test = {
        cid: cid,
        passingGrade: grade,
        questions: [],
    };

    let db = firebase.firestore();
    // Add a new test document to tests with a generated id.
    db.collection("tests").doc(tid).set(test);
    let courseRef = db.collection("courses").doc(cid);
    courseRef.update({ tid: tid });
    let html = `<div>
            <div class = "box">
                <h1 class="title">Test</h1>
                <h1 class="label">Passing Grade</h1>
                    <div class="field">
                        <div class="control">
                            <input id="grade" class="input" type="text" value="70">
                        </div>
                        <p id="gradeError"></p>
                    </div>
                    
                    <div class ="box">
                    <div class="field">
                        <label class="label">Question</label>
                        <div class="control">
                            <textarea id="questionValue" class="textarea questionValue" placeholder="Question" style="white-space: pre-wrap"></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Answer A</label>
                        <div class="control">
                            <textarea id="aValu" class="textarea aValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                        </div>
                        <label class="checkbox">
                        <input id="aCheck" type="checkbox"  class ="aCheck">
                            Correct Answer
                        </label>
                    </div>
                    <div class="field">
                        <label class="label">Answer B</label>
                        <div class="control">
                            <textarea id="bValue" class="textarea bValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                        </div>
                        <label class="checkbox ">
                        <input id="bCheck" type="checkbox"  class = "bCheck">
                            Correct Answer
                        </label>
                    </div>
                    <div class="field">
                        <label class="label">Answer C</label>
                        <div class="control">
                            <textarea id="cValue" class="textarea cValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                        </div>
                        <label class="checkbox ">
                        <input id="cCheck" type="checkbox"  class = "cCheck">
                            Correct Answer
                        </label>
                    </div>
                    <div class="field">
                        <label class="label">Answer D</label>
                        <div class="control">
                            <textarea id="dValue" class="textarea dValue" placeholder="Answer" rows="1" style="white-space: pre-wrap"></textarea>
                        </div>
                        <label class="checkbox">
                        <input id="dCheck" type="checkbox"  class = "dCheck">
                            Correct Answer
                        </label>
                    </div>
                    </div>
                    <p id="questionError"></p>
                    <div class= "buttons is-centered" id = "divAddTest">
                        <button id="addQuestionButton" class="button is-success" data-cid="${cid}">Add Question</button>
                        </div> 
                        </div>
                    `;
    let insertableDiv = document.createElement("div");
    insertableDiv.innerHTML = html;
    event.target.parentElement.replaceChild(insertableDiv, event.target);
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
