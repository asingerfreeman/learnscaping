export async function renderNavbar() {
    return;
}

export async function renderTitleForm(id) {
    const db = firebase.firestore();
    let courseRef = db.collection("courses");
    let testRef = db.collection("tests");
    let html = `
    
      <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
              <a class="navbar-item" href="../instructorHome/instructorHome.html">
                  <img src="../media/learnscaping_logo.png" width="210">
              </a>
          </div>
  
          <div id="navbarBasicExample" class="navbar-menu">
              <div class="navbar-start">
                  <a class="navbar-item" href="../instructorHome/instructorHome.html">
                      Home
                  </a>
          </div>
      </div>
      </nav> 
    
    <article id="message" class="message is-info">
        <div class="message-header">
            <p>Info</p>
        </div>
        <div class="message-body">
            Welcome to the Edit Course feature! Before you start, please read the following to learn about how editing courses works.<br><br>
            - All parts of the course are pre-populated with their current values.<br> 
            - No changes you make will be saved until you hit the 'Save' button.<br>
            - If you would like to revert the course to where it was before your edits, please use the 'Cancel' button.<br>
            - The course's values will be updated to reflect the values in the input fields when you press the 'Save' button.<br>
        </div>
    </article>
    `;
    let tests = await testRef.get();
    let test ="";
    tests.forEach((t)=> {
        if (t.data().cid == id){
            test = t.data();
        }
    })

    await courseRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data();
        if (doc.id == id){
            
            html = html+`<form id="replace" class="box">
            <div class = "box"><div id="coursecontent">
            <h1 class = "title is-centered">Course Content</h1>
            <h1 class="label">Title: ${data.title}</h1>
            <div class="field">
                <div class="control">
                    <input id="titleValue" class="input slideTitle" type="text" value="${ data.title}">
                </div>
                <p id="titleError"></p>
            </div>
        
            `;
            let existingContent;
            data.slides.forEach((slide) =>{
                html = html+`
                <div class="box">
                
                <div class="field">
                <label class="label">Header: ${slide.header} <span class ="level-right"><button class="delete deleteContent is-large is-right"></span></button></label>
                <div class="control">
                    <input id="header${slide.sid}" class="input header" data-sid="${slide.sid}" type="text" value="${slide.header}">
                </div>
                <p id="headerError"></p>
            </div>
            <div class="field">
                <label class="label">Module Text</label>
                <div class="control">
                    <div id="text${slide.sid}" class="content" data-sid="${slide.sid}">${slide.text}</div>
                </div>
                
                <p id="textError"></p>
            </div>
            
            
            </div>
                `;
            }); 
            html = html+`
            </div>
            <div class= "buttons is-centered" id="divAddContent">
            <button id="addContentButton" class="button is-success" data-cid="${doc.id}">Add Another Content Section</button>
            </div>
            </div>
            
        </div>
    </div>`;
    if (test == ""){
        console.log(1);
        html= html+`<div class= "buttons is-centered" id="divAddCompleteTest">
            <button id="addCompleteTest" class="button is-success" data-cid="${doc.id}">Add Test</button>
            </div>
            <div class="buttons is-right">
                        <button id="savePageButton" type="submit" class="button is-success" data-cid="${doc.id}">Save</button>
                        <button id="cancelPageButton" class="button" data-cid="${doc.id}">Cancel</button>
            </div>
            </form>`;
    } else {
        html = html+`<div>
            <div class = "box">
                <h1 class="title">Test</h1>
                <h1 class="label">Passing Grade</h1>
                    <div class="field">
                        <div class="control">
                            <input id="grade" class="input" type="text" value="${test.passingGrade}">
                        </div>
                        <p id="gradeError"></p>
                    </div>`;
            let isAChecked;
            let isBChecked;
            let isCChecked;
            let isDChecked;
            test.questions.forEach((question)=>{
                console.log("reached");
                if (question.answerA.isCorrect){
                    isAChecked = "checked";
                } else {
                    isAChecked = "";
                }
                if (question.answerB.isCorrect){
                    isBChecked = "checked";
                } else {
                    isBChecked = "";
                }
                if (question.answerC.isCorrect){
                    isCChecked = "checked";
                } else {
                    isCChecked = "";
                }
                if (question.answerD.isCorrect){
                    isDChecked = "checked";
                } else {
                    isDChecked = "";
                }
                console.log("reached");
                html = html + `
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
                    
                    
                    `;
            });
            html = html+`
            
                        <div class= "buttons is-centered" id = "divAddTest">
                        <button id="addTestButton" class="button is-success" data-cid="${doc.id}">Add Another Test Question</button>
                        </div> 
                        </div>
                        <div class="buttons is-right">
                        <button id="savePageButton" type="submit" class="button is-success" data-cid="${doc.id}">Save</button>
                        <button id="cancelPageButton" class="button" data-cid="${doc.id}">Cancel</button>
                    </div>
                    
                    </form>`; 
            }
        }
       
    });
});
    
  
    //document.removeChild(document.documentElement)
    return html;
}

export async function handleSavePageButtonPress(event){
    event.preventDefault();
    const db = firebase.firestore();
    let courseRef = db.collection('courses');

    let cid = document.getElementById("savePageButton").getAttribute("data-cid");
    let title = document.getElementById("titleValue").value;

    let courses =  await courseRef.get();
    let allData;
    let data;

    await courseRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        allData = doc.data();
        if (doc.id == cid) {
            data = allData;
            
        }
    })})
    
    let count;
    let slides =[];
    let headers = document.getElementsByClassName("header");
    let texts = document.getElementsByClassName("ql-editor");
    for (count = 0; count < headers.length; count++){
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
    if (data.tid != null){
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

        
        for (let i = 0; i < aCheckboxes.length; i++){
            aCheck =aCheckboxes[i].checked;
            bCheck=bCheckboxes[i].checked;
            cCheck=cCheckboxes[i].checked;
            dCheck=dCheckboxes[i].checked;
            questionValue=qv[i].value;
            aValue=aV[i].value;
            bValue=bV[i].value;
            cValue=cV[i].value;
            dValue=dV[i].value;

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
                        `<p id="questionError" class="help is-danger">* Please fill out each section.</p>`
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
    $("#replace").replaceWith(`<div class = "box">Slides updated properly. Click Home in the upper left to go back to the home screen</div>`);
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
                <label class="label">Module Text</label>
                <div class="control">
                    <div id="text${sid}" class="content" data-sid="${sid}">Write content here</div>
                </div>
                
                <p id="textError"></p>
            </div>
            </div>`
    //event.target.parentElement.parentElement.insertBefore(newDiv, document.getElementById("divAddContent"));
    return newDiv;
    
}

export async function handleAddTestQuestion(event){
    event.preventDefault();
    let id= ID();
    let newTestDiv = document.createElement("div");
    newTestDiv.innerHTML=
    
    ` <div class = "box"><div class="field">
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
        event.target.parentElement.parentElement.insertBefore(newTestDiv, document.getElementById("divAddTest") )
}

export async function handleCancelPageButtonPress(event) {
    event.preventDefault();
    let cid = document.getElementById("savePageButton").getAttribute("data-cid");
    console.log(await renderTitleForm(cid));
    
    document.body = document.createElement(await renderTitleForm(cid));
}


export async function handleAddContentAndAddQuill(event) {
    event.preventDefault();
    let sid = ID();
    $("#coursecontent").append(`${await handleAddContent(sid)}`)
    .append(function() { var quill = new Quill("#text" + sid, {
        modules: {
            toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6,  false] }],
        ['bold', 'italic', 'underline','strike'],
        ['image'],
        ['link'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean'],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }]
        ],
        imageResize: {}

        },
        theme: 'snow',
        placeholder: '',
    });
    return quill;});
    
}


export async function handleDeleteButton(event){
    event.preventDefault();
    event.target.parentElement.parentElement.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement.parentElement.parentElement);
}

//Generates a random ID
var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
};

export async function deleteMedia(event){
    event.preventDefault()
    const storageRef = firebase.storage().ref();
    let name =event.target.getAttribute("data-image-name");
    let imageRef = storageRef.child(name);
    let cid = event.target.getAttribute("data-cid");
    let sid = event.target.getAttribute("data-sid");
    const db = firebase.firestore();
    let courseRef = await db.collection("courses").doc(cid).get();
    console.log(courseRef.data().slides);
    let newSlides = [];
    let newSlide;
    courseRef.data().slides.forEach((slide)=>{
        if (slide.sid == sid){
            newSlide =  {
                sid: slide.sid,
                header: slide.header,
                text: slide.text,
                media: null
            };
            newSlides.push(newSlide)
        } else {
            newSlide =  {
                sid: slide.sid,
                header: slide.header,
                text: slide.text,
                media: slide.media.name,
            };
        }
        courseRef = db.collection("courses").doc(cid);
        courseRef.update({slides: newSlides,});
    })

    // Delete the file
    imageRef.delete().then(() => {
    // File deleted successfully
    console.log("success")
    }).catch((error) => {
    // Uh-oh, an error occurred!
    }); 
    event.target.parentElement.removeChild(event.target);
}

export async function createNewTest(event){
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
    let courseRef=db.collection("courses").doc(cid);
    courseRef.update({tid: tid,});
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
        [{ header: [1, 2, 3, 4, 5, 6,  false] }],
        ['bold', 'italic', 'underline','strike'],
        ['image'],
        ['link'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean'],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }]
        ],
        imageResize: {}

        },
        theme: 'snow',
        placeholder: '',
    });
    return quill;
}
export async function loadIntoDOM() {
    const $root = $("#root");
    let courseID 
    try {
                courseID = location.search.substring(1);
            } catch (error) {
                // if cid is undefined...redirect to student home.
                window.location.href = "../loginPage/login.html";
            }

    // load starting page
    $root.append(await renderNavbar());
    $root.append(await renderTitleForm(courseID));
    var slides_textboxes = $("div[id^='text']");
    for (let i=0; i<slides_textboxes.length; i++) {
        createQuill(slides_textboxes[i]);
    }
    // button functionality
    $root.on("click", "#savePageButton", handleSavePageButtonPress);
    $root.on("click", "#cancelPageButton", handleCancelPageButtonPress);
    $root.on("click", "#addContentButton", handleAddContentAndAddQuill);
    $root.on("click", "#addTestButton", handleAddTestQuestion);
    $root.on("click", ".deleteContent", handleDeleteButton);
   // $root.on("click", ".removeExistingMedia", deleteMedia);
    $root.on("click", "#addCompleteTest", createNewTest);
}

$(function () {
    loadIntoDOM();
    //renderTitleForm("")
});