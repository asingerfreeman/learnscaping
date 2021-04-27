const $root = $("#root");
const db = firebase.firestore();
let uid, cid, increment, passingGrade;
let score = 0;

export async function renderNavbar() {
    $root.append(`
    <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="../studentHome/studentHome.html">
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
                <a class="navbar-item icon-text nav-item" href="../studentHome/studentHome.html">
                    <span class="icon">
                        <i class="fas fa-home"></i>
                    </span>
                    <span>Home</span>
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

export async function renderBody(data) {
    $root.append(`
    <!-- Main body html here -->
    <section class="section">
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-11-tablet is-10-desktop is-10-widescreen">
                    <h1 class="title is-1"></h1>
		            <div id="body" class="box">
			            <h1 class="title is-inline"><i class="fas fa-pencil-alt"></i> ${data.title} Test</h1>
                        <span class="icon-text has-text-info" title="Help">
                            <a id="infoIcon">
                                <span class="icon">
                                    <i class="fa fa-info-circle"></i>
                                </span>
                            </a>
                        </span>
                        
                        <div class="buttons is-inline is-pulled-right"</div>
                            <a class="button is-info is-outlined" href="../lessonPage/lessonPage.html?${
                                data.cid
                            }">
                                <span class="icon">
							        <i class="fa fa-book"></i>
					  	        </span>
						        <span>Back to Course</span>
                            </a>
                        </div>
      		            <progress class="progress is-success" id="sProgress" value="${increment}" max="100"></progress>
			            ${await renderContent(0, data.questions[0])}
  		            </div>  
                </div>
            </div>
        </div>
    </section>

    <!-- Info modal html here -->
    <div class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <div class="block">
                    <p><strong>Welcome to the Test Taker!</strong></p>
                </div>
                <div class="block">
                    <p>
                        - To answer a question: 1. Select an answer 2. Click "submit" 3. Click "Next Question"<br>
                        - You get one attempt at each question.<br>
                        - As you complete questions, your score will be updated.<br>
                        - You must get a score equal to or greater than the minimum passing grade.<br>
                        - You will lose your progress if you leave the page.<br>
                        - There is no time limit.<br>
                        - You may retake the test as many times as you want.<br>
                    </p>
                </div>
                <div class="block">
                    <p>Good luck!</p>
                </div>
            </div>
        </div>
        <button id="closeModal" class="modal-close is-large" aria-label="close"></button>
    </div>
    `);

    // delete notif button functionality
    $root.on("click", ".delete", () => {
        $(".notification").replaceWith(`<div id="notification"></div>`);
    });

    // info modal functionality
    $root.on("click", "#infoIcon", () => {
        $(".modal").attr("class", "modal is-active is-clipped");
    });
    $root.on("click", "#closeModal", () => {
        $(".modal").attr("class", "modal");
    });
    $root.on("click", ".modal-background", () => {
        $(".modal").attr("class", "modal");
    });

    $root.on("click", "#submit", handleSubmitButtonPress);
    $root.on("click", "#finish", handleFinishButtonPress);

    await setupPagination(data);

    return;
}

export async function setupPagination(data) {
    let currIndex = 0;
    let lastIndex = data.questions.length - 1;
    if (lastIndex === 0) {
        // edge case. only one question in test.
        $("#pagination-next").replaceWith(
            `<button id="finish" class="button is-success is-outlined">Submit Test</button>`
        );
    }

    $root.on("click", "#pagination-next", () => {
        if (currIndex >= lastIndex) {
            return;
        }

        // check if answer is submitted
        if (document.getElementById("disabledSubmit") === null) {
            $("#notification").replaceWith(
                `<div id="notification" class="notification is-warning">
					<button class="delete"></button>
					Please submit your answer before proceeding.
				</div>`
            );
            return;
        }

        // increment by 100/size of section deck
        document.getElementById("sProgress").value += increment;
        currIndex++;
        updateContent(currIndex, lastIndex, data.questions[currIndex]);
    });
}

export async function updateContent(currIndex, lastIndex, question) {
    // update page with new question content
    $("#content").replaceWith(await renderContent(currIndex, question));

    // replace next button if last question
    if (currIndex === lastIndex) {
        console.log(currIndex, lastIndex);
        $("#pagination-next").replaceWith(
            `<button id="finish" class="button is-success is-outlined">Submit Test</button>`
        );
    }
}

export async function renderContent(currIndex, question) {
    return `
    <form id="content">
        <div id="notification">
        </div>
        <div class="block">
            <p><strong>${currIndex + 1}. ${question.question}</strong></p>
        </div>
        <div class="block">
            <p id="a" data-isCorrect="${question.answerA.isCorrect}"><strong>A:</strong> ${
        question.answerA.data
    }</p>
		</div>
		<div class="block">
            <p id="b" data-isCorrect="${question.answerB.isCorrect}"><strong>B:</strong> ${
        question.answerB.data
    }</p>
		</div>
		<div class="block">
            <p id="c" data-isCorrect="${question.answerC.isCorrect}"><strong>C:</strong> ${
        question.answerC.data
    }</p>
		</div>
		<div class="block">
            <p id="d" data-isCorrect="${question.answerD.isCorrect}"><strong>D:</strong> ${
        question.answerD.data
    }</p>
        </div>
        <div id="radioAnswer" class="control">
            <label class="radio">
                <input id="radioA" type="radio" name="answer">
                    A
            </label>
            <label class="radio">
            <input id="radioB" type="radio" name="answer">
                    B
            </label>
            <label class="radio">
            <input id="radioC"type="radio" name="answer">
                    C
            </label>
            <label class="radio">
            <input id="radioD" type="radio" name="answer">
                    D
            </label>
        </div>
        <div class="buttons is-right">
            <button id="submit" class="button is-info ">Submit</button>
            <a id="pagination-next" class="button">
                <span class="icon-text">
                    <span>Next Question</span>
                    <span class="icon">
                        <i class="fa fa-arrow-right"></i>
                    </span>
                </span>
            </a>
        </div>
    </form>
    `;
}

export async function handleSubmitButtonPress(event) {
    event.preventDefault();
    let disabledSubmit = `<button id= "disabledSubmit" class="button is-info" disabled>Submit</button>`;

    let answerA = document.getElementById("radioA").checked;
    let answerB = document.getElementById("radioB").checked;
    let answerC = document.getElementById("radioC").checked;
    let answerD = document.getElementById("radioD").checked;

    // check if answer is selected and check if correct
    if (answerA === false && answerB === false && answerC === false && answerD === false) {
        $("#notification").replaceWith(
            `<div id="notification" class="notification is-warning">
				<button class="delete"></button>
				Please select an answer before submitting.
			</div>`
        );
    } else if (
        document.getElementById("a").getAttribute("data-isCorrect") === "true" &&
        answerA === true
    ) {
        await handleCorrectAnswerEvent(disabledSubmit);
    } else if (
        document.getElementById("b").getAttribute("data-isCorrect") === "true" &&
        answerB === true
    ) {
        await handleCorrectAnswerEvent(disabledSubmit);
    } else if (
        document.getElementById("c").getAttribute("data-isCorrect") === "true" &&
        answerC === true
    ) {
        await handleCorrectAnswerEvent(disabledSubmit);
    } else if (
        document.getElementById("d").getAttribute("data-isCorrect") === "true" &&
        answerD === true
    ) {
        await handleCorrectAnswerEvent(disabledSubmit);
    } else {
        $("#notification").replaceWith(`
		<div id="notification" class="notification is-danger">
				<button class="delete"></button>
				Incorrect. Score: ${score}
		</div>`);
        $("#submit").replaceWith(disabledSubmit);
    }
}

export async function handleCorrectAnswerEvent(disabledSubmit) {
    score += increment;

    let isCorrectNotif = `
	<div id="notification" class="notification is-success">
		<button class="delete"></button>
		Correct! Score: ${score}
	</div>`;

    $("#notification").replaceWith(isCorrectNotif);
    $("#submit").replaceWith(disabledSubmit);
}

export async function handleFinishButtonPress(event) {
    event.preventDefault();

    // check if last answer is submitted
    if (document.getElementById("disabledSubmit") === null) {
        $("#notification").replaceWith(
            `<div id="notification" class="notification is-warning">
                        <button class="delete"></button>
                        Please submit your answer before proceeding.
                    </div>`
        );
        return;
    }

    // get user
    const userRef = db.collection("users").doc(uid);
    userRef
        .get()
        .then(async (doc) => {
            if (doc.exists) {
                let courses = doc.data().courses;
                let updatedCourse;
                // if user passes
                if (score >= passingGrade) {
                    for (let i = 0; i <= courses.length; i++) {
                        if (courses[i].cid === cid) {
                            // update courses array
                            userRef.update({
                                courses: firebase.firestore.FieldValue.arrayRemove(courses[i]),
                            });

                            updatedCourse = courses[i];
                            updatedCourse.isComplete = true;

                            // update score if new score is higher
                            if (courses[i].testScore < score) {
                                updatedCourse.testScore = score;
                            }

                            userRef.update({
                                courses: firebase.firestore.FieldValue.arrayUnion(updatedCourse),
                            });

                            // render "you passed" message
                            await renderFinishMessage(true);
                            break;
                        }
                    }
                } else {
                    // user does not pass
                    for (let i = 0; i <= courses.length; i++) {
                        if (courses[i].cid === cid) {
                            // update courses array
                            userRef.update({
                                courses: firebase.firestore.FieldValue.arrayRemove(courses[i]),
                            });

                            updatedCourse = courses[i];

                            // update score if new score is higher
                            if (courses[i].testScore < score) {
                                updatedCourse.testScore = score;
                            }

                            userRef.update({
                                courses: firebase.firestore.FieldValue.arrayUnion(updatedCourse),
                            });

                            // render DIDNT pass message
                            await renderFinishMessage(false);
                            break;
                        }
                    }
                }
            } else {
                // doc.data() will be undefined in this case
                alert(`User does not exist`);
            }
        })
        .catch((error) => {
            alert(`Get user: ${error}`);
        });
}

export async function renderFinishMessage(passed) {
    if (passed) {
        $("#body").replaceWith(`
            <div class="box">
                <div class="block">
                    <h1 class="title">Test Submitted! - Passed<h1>
                    <p><strong>Your score: ${score}</strong></p>
                    <p>Congrats, you passed! You met the passing grade of <strong>${passingGrade}</strong>.</p>
                </div>
                <div class="block">
                    <p>Remember:<br>
                    - Your course will now be marked as "completed". <br>
                    - However, you may take the test again as many times as you want. <br>
                    - Your highest score will be saved. <br>
                    </p>
                </div>
            <div class="buttons is-right">
                <a class="button is-info" href="../studentHome/studentHome.html">
                    <span class="icon">
                        <i class="fa fa-home"></i>
                    </span>
                    <span>Home</span>
                </a>
            </div>
        </div>
        `);
        return;
    }

    $("#body").replaceWith(`
        <div class="box">
            <div class="block">
                <h1 class="title">Test Submitted! - Try Again<h1>
                <p><strong>Your score: ${score}</strong></p>
                <p>Unfortunately, you did not meet the passing grade of <strong>${passingGrade}</strong>. Please review the course material and try again.</p>
            </div>
            <div class="block">
                <p>Remember:<br>
                - You must pass the test to have your course count as "completed". <br>
                - You may take the test as many times as you want. <br>
                - Your highest score will be saved. <br>
                </p>
            </div>
            <div class="buttons is-right">
                <a class="button is-info" href="../lessonPage/lessonPage.html?${cid}">
                    <span class="icon">
                        <i class="fa fa-book"></i>
                    </span>
                    <span>Back to Course</span>
                </a>
                <button class="button" onClick="window.location.reload()">
                    <span class="icon">
                        <i class="fa fa-redo"></i>
                    </span>
                    <span>Retake Test</span>
                </button>
            </div>
        </div>
    `);
    return;
}

export async function loadIntoDOM() {
    // check auth state
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            let tid, title;
            uid = user.uid;

            // get cid
            try {
                cid = location.search.substring(1);
            } catch (error) {
                // if cid is undefined...redirect to student home.
                window.location.href = "../studentHome/studentHome.html";
            }

            // get course doc
            const courseRef = db.collection("courses").doc(cid);
            courseRef
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        tid = doc.data().tid;
                        title = doc.data().title;
                        const testRef = db.collection("tests").doc(tid);

                        // get test doc
                        testRef
                            .get()
                            .then(async (doc) => {
                                if (doc.exists) {
                                    increment = 100 / doc.data().questions.length;
                                    passingGrade = doc.data().passingGrade;
                                    let data = {
                                        title: title,
                                        questions: doc.data().questions,
                                        cid: cid,
                                    };

                                    // render page with first question content
                                    await renderNavbar();
                                    await renderBody(data);
                                } else {
                                    // test doc does not exist. doc.data() will be undefined in this case
                                    alert(`Test does not exist.`);
                                }
                            })
                            .catch((error) => {
                                // error occured when grabbing test doc / while executing .then code.
                                alert(`Get test: ${error}`);
                            });
                    } else {
                        // course doc does not exist. doc.data() will be undefined in this case
                        alert(`Course does not exist.`);
                    }
                })
                .catch((error) => {
                    // error occured when grabbing course doc / while executing .then code.
                    alert(`Get course: ${error}`);
                });
        } else {
            // No user is signed in. Redirect to login.
            window.location.href = "../loginPage/login.html";
        }
    });
}

$(function () {
    loadIntoDOM();
});
