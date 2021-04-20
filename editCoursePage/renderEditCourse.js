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
    $root.on("click", "#cancelPageButton", handleCancelPageButtonPress);
    $root.on("click", "#addContentButton", handleAddContentAndAddQuill);
    $root.on("click", "#addTestButton", handleAddTestQuestion);
    $root.on("click", ".deleteContent", handleDeleteButton);
    $root.on("click", "#addCompleteTest", createNewTest);
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
            - If you would like discard all changes, use the 'Cancel' button or simply leave the page.<br>
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
        <h1 class="title is-centered">Course Content</h1>
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
    <div class="section">
        <div class="container">
            <div class="box">
                <div class="field">
                    <label class="label">
                        <span class="level-right">
                            <button
                                class="delete deleteContent is-large is-right"
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

                    <p id="headerError"></p>

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

                        <p id="textError"></p>
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

    // check for existing test where tid != null and test has at least one question
    //     let tests = await testRef.get();
    //     let test = "";
    //     tests.forEach((t) => {
    //         if (t.data().cid == cid) {
    //             test = t.data();
    //         }
    //     });
    //     if (test === null) {
    //         $root.append(
    //             `
    //             <div class= "buttons is-centered" id="test">
    //                 <button id="addCompleteTest" class="button is-success" data-cid="${doc.id}">Add Test</button>
    //             </div>
    //             <div class="buttons is-right">
    //                 <button id="savePageButton" type="submit" class="button is-success" data-cid="${doc.id}">Save</button>
    //                 <button id="cancelPageButton" class="button" data-cid="${doc.id}">Cancel</button>
    //             </div>
    //             </div>`
    //         );
    //     } else {
    //         html += `
    // <form class="section">
    // <div class="container">
    // <div class = "box">
    // <h1 class="title">Test</h1>
    // <section class="section">
    //     <div class="container">
    //         <div class="box">
    //             <h1 class="label">Passing Grade</h1>
    //             <div class="field">
    //                 <div class="control">
    //                     <input id="grade" class="input" type="text" value="${test.passingGrade}">
    //                 </div>
    //                 <p id="gradeError"></p>
    //             </div>
    //         </div>
    //     </div>
    // </section>`;
    // let isAChecked;
    // let isBChecked;
    // let isCChecked;
    // let isDChecked;
    // test.questions.forEach((question) => {
    //     console.log("reached");
    //     if (question.answerA.isCorrect) {
    //         isAChecked = "checked";
    //     } else {
    //         isAChecked = "";
    //     }
    //     if (question.answerB.isCorrect) {
    //         isBChecked = "checked";
    //     } else {
    //         isBChecked = "";
    //     }
    //     if (question.answerC.isCorrect) {
    //         isCChecked = "checked";
    //     } else {
    //         isCChecked = "";
    //     }
    //     if (question.answerD.isCorrect) {
    //         isDChecked = "checked";
    //     } else {
    //         isDChecked = "";
    //     }
    //     console.log("reached");
    //     html += `
    // <div class ="box">
    // <div class="field">
    //     <label class="label">Question</label>
    //     <div class="control">
    //         <textarea id="questionValue${question.question}" class="textarea questionValue" placeholder="Question" style="white-space: pre-wrap">${question.question}</textarea>
    //     </div>
    // </div>
    // <div class="field">
    //     <label class="label">Answer A</label>
    //     <div class="control">
    //         <textarea id="aValue${question.question}" class="textarea aValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerA.data}</textarea>
    //     </div>
    //     <label class="checkbox">
    //     <input id="aCheck${question.question}" type="checkbox" ${isAChecked} class ="aCheck">
    //         Correct Answer
    //     </label>
    // </div>
    // <div class="field">
    //     <label class="label">Answer B</label>
    //     <div class="control">
    //         <textarea id="bValue${question.question}" class="textarea bValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerB.data}</textarea>
    //     </div>
    //     <label class="checkbox ">
    //     <input id="bCheck${question.question}" type="checkbox" ${isBChecked} class = "bCheck">
    //         Correct Answer
    //     </label>
    // </div>
    // <div class="field">
    //     <label class="label">Answer C</label>
    //     <div class="control">
    //         <textarea id="cValue${question.question}" class="textarea cValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerC.data}</textarea>
    //     </div>
    //     <label class="checkbox ">
    //     <input id="cCheck${question.question}" type="checkbox" ${isCChecked} class = "cCheck">
    //         Correct Answer
    //     </label>
    // </div>
    // <div class="field">
    //     <label class="label">Answer D</label>
    //     <div class="control">
    //         <textarea id="dValue${question.question}" class="textarea dValue" placeholder="Answer" rows="1" style="white-space: pre-wrap">${question.answerD.data}</textarea>
    //     </div>
    //     <label class="checkbox">
    //     <input id="dCheck${question.question}" type="checkbox" ${isDChecked} class = "dCheck">
    //         Correct Answer
    //     </label>
    // </div>
    // </div>
    // <p id="questionError"></p>

    // `;
    // });
    //         html += `

    //             <div class= "buttons is-centered" id = "divAddTest">
    //             <button id="addTestButton" class="button is-success" data-cid="${doc.id}">Add Another Test Question</button>
    //             </div>
    //             </div>
    //             <div class="buttons is-right">
    //             <button id="savePageButton" type="submit" class="button is-success" data-cid="${doc.id}">Save</button>
    //             <button id="cancelPageButton" class="button" data-cid="${doc.id}">Cancel</button>
    //         </div>
    //         </div>
    // </div>
    // </form>`;
    //     }

    //document.removeChild(document.documentElement)
    return html;
}

export async function renderPassingGrade(grade) {
    return `
    <section class="section">
        <div class="container">
            <h1 class="title">Test</h1>
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
    let isAChecked;
    let isBChecked;
    let isCChecked;
    let isDChecked;
    let html = ``;

    questions.forEach((question) => {
        console.log("reached");
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
    <div class="section">
    <div class ="box">
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
                                    <button id="addTestButton" class="button is-success" data-cid="${cid}">
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

export async function handleSavePageButtonPress(event) {
    event.preventDefault();
    const db = firebase.firestore();
    let courseRef = db.collection("courses");

    let cid = document.getElementById("savePageButton").getAttribute("data-cid");
    let title = document.getElementById("titleValue").value;

    let courses = await courseRef.get();
    let allData;
    let data;

    await courseRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            allData = doc.data();
            if (doc.id == cid) {
                data = allData;
            }
        });
    });

    let count;
    let slides = [];
    let headers = document.getElementsByClassName("header");
    let texts = document.getElementsByClassName("ql-editor");
    for (count = 0; count < headers.length; count++) {
        let header = headers[count].value;
        let text = texts[count].innerHTML;

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
        // check for empty title value
        if (title.length === 0) {
            $("#titleError").replaceWith(
                `<p id="error" class="help is-danger">* A title is required</p>`
            );
            return;
        }
        // upload media to firebase
        let slide;
        slide = {
            sid: document.getElementsByClassName("header")[count].getAttribute("data-sid"),
            header: header,
            text: text,
            media: null,
        };
        slides.push(slide);
    }

    courseRef = db.collection("courses").doc(cid);

    courseRef.update({
        title: title,
        slides: slides,
    });

    //START HANDLING TEST DATA
    if (data.tid != null) {
        let grade = document.getElementById("grade").value;

        // check for valid input
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

        let tid = data.tid;

        let aCheckboxes = document.getElementsByClassName("aCheck");
        let bCheckboxes = Array.from(document.getElementsByClassName("bCheck"));
        let cCheckboxes = Array.from(document.getElementsByClassName("cCheck"));
        let dCheckboxes = Array.from(document.getElementsByClassName("dCheck"));
        let qv = document.getElementsByClassName("questionValue");
        let aV = document.getElementsByClassName("aValue");
        let bV = document.getElementsByClassName("bValue");
        let cV = document.getElementsByClassName("cValue");
        let dV = document.getElementsByClassName("dValue");
        let aCheck;
        let bCheck;
        let cCheck;
        let dCheck;
        let questionValue;
        let aValue;
        let bValue;
        let cValue;
        let dValue;
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
                console.log("hi");
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
        console.log(questions);

        // write question to test obj

        let testRef = db.collection("tests").doc(tid);

        testRef.update({
            cid: cid,
            passingGrade: grade,
            questions: questions,
        });
    }
    $("#replace").replaceWith(`<div class = "box">Slides updated successfully!</div>`);
}

export async function handleAddContent(sid) {
    //event.preventDefault()
    //let sid = ID();
    // let newDiv = document.createElement("div")
    let newDiv = `<div class = "box"><div class="field">
                <label class="label">Header</label>
                <div class="control">
                    <input id="header${sid}" class="input header" data-sid="${sid}" type="text" placeholder="Header">
                </div>
                <p id="headerError"></p>
            </div>
            <div class="field">
                <label class="label">Text</label>
                <div class="control">
                    <div id="text${sid}" class="content" data-sid="${sid}">Write content here</div>
                </div>
                
                <p id="textError"></p>
            </div>
            </div>`;
    //event.target.parentElement.parentElement.insertBefore(newDiv, document.getElementById("divAddContent"));
    return newDiv;
}

export async function handleAddTestQuestion(event) {
    event.preventDefault();
    let id = ID();
    let newTestDiv = document.createElement("div");
    newTestDiv.innerHTML = ` <div class = "box"><div class="field">
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
            
            
        </div></div>`;
    console.log(event.target.parentElement.parentElement);
    event.target.parentElement.parentElement.insertBefore(
        newTestDiv,
        document.getElementById("divAddTest")
    );
}

export async function handleCancelPageButtonPress(event) {
    event.preventDefault();
    let cid = document.getElementById("savePageButton").getAttribute("data-cid");
    console.log(await renderBody(cid));

    document.body = document.createElement(await renderBody(cid));
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

export async function handleDeleteButton(event) {
    event.preventDefault();

    let isContinue = confirm("Are you sure you want to delete the selected slide?");

    if (!isContinue) {
        return;
    }

    event.target.parentElement.parentElement.parentElement.parentElement.parentElement.removeChild(
        event.target.parentElement.parentElement.parentElement.parentElement
    );
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
    console.log(courseRef.data().slides);
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
    console.log("reached");
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
                        <button id="addTestButton" class="button is-success" data-cid="${cid}">Add Another Test Question</button>
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
