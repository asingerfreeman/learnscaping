const $root = $("#root");
const db = firebase.firestore();
let uid, cid, increment, passingGrade;
let score = 0;

export async function renderNavbar() {
    $root.append(`
    <nav class="navbar" role="navigation" aria-label="main navigation">
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
                <a class="navbar-item" href="../studentHome/studentHome.html">
                    Home
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
    </nav> `);

    // navbar burger functionality
    $(".navbar-burger").click(function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
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
		            <div id="body" class="box">
			            <h1 class="title is-inline">${data.title} - Test</h1>
                        <span class="icon-text has-text-info">
                            <a id="infoIcon">
                                <span class="icon">
                                    <i class="fa fa-info-circle"></i>
                                </span>
                            </a>
                        </span>
                        
                        <div class="buttons is-inline is-pulled-right"</div>
                            <a class="button is-info is-outlined" href="../lessonPage/lessonPage.html?${
                                data.cid
                            }">Back to Course</a>
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

    $("#pagination-next").on("click", () => {
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
        <div class="field">
            <div class="control">
                <div class="select">
                    <select id="answer">
                        <option>Answer</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="buttons is-right">
            <button id="submit" class="button is-info ">Submit</button>
            <a id="pagination-next" class="button">Next Question</a>
        </div>
    </form>
    `;
}

export async function handleSubmitButtonPress(event) {
    event.preventDefault();
    let answer = document.getElementById("answer").value;
    let disabledSubmit = `<button id= "disabledSubmit" class="button is-success" disabled>Submit</button>`;

    // check if answer is selected and check if correct
    if (answer === "Answer") {
        $("#notification").replaceWith(
            `<div id="notification" class="notification is-warning">
				<button class="delete"></button>
				Please select an answer before submitting.
			</div>`
        );
    } else if (
        document.getElementById("a").getAttribute("data-isCorrect") === "true" &&
        answer === "A"
    ) {
        await handleCorrectAnswerEvent(disabledSubmit);
    } else if (
        document.getElementById("b").getAttribute("data-isCorrect") === "true" &&
        answer === "B"
    ) {
        await handleCorrectAnswerEvent(disabledSubmit);
    } else if (
        document.getElementById("c").getAttribute("data-isCorrect") === "true" &&
        answer === "C"
    ) {
        await handleCorrectAnswerEvent(disabledSubmit);
    } else if (
        document.getElementById("d").getAttribute("data-isCorrect") === "true" &&
        answer === "D"
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
                $root.append(`<p class="help is-danger">User doc does not exist.</p>`);
            }
        })
        .catch((error) => {
            $root.append(`<p class="help is-danger">Get user: ${error}</p>`);
        });
}

export async function renderFinishMessage(passed) {
    if (passed) {
        $("#body").replaceWith(`
            <div class="box">
                <div class="block">
                    <h1 class="title">Test Submitted! - Passed<h1>
                    <p>Your score: ${score}</p>
                    <p>Congrats, you passed! You met the passing grade of ${passingGrade}.</p>
                </div>
                <div class="block">
                    <p>Remember:<br>
                    - Your course will now be marked as "completed". <br>
                    - However, you may take the test again as many times as you want. <br>
                    - Your highest score will be saved. <br>
                    </p>
                </div>
            <div class="buttons is-right">
                <a class="button is-info" href="../studentHome/studentHome.html">Home</a>
            </div>
        </div>
        `);
        return;
    }

    $("#body").replaceWith(`
        <div class="box">
            <div class="block">
                <h1 class="title">Test Submitted! - Failed<h1>
                <p>Your score: ${score}</p>
                <p>Unfortunately, you did not meet the passing grade of ${passingGrade}. Please review the course material and try again.</p>
            </div>
            <div class="block">
                <p>Remember:<br>
                - You must pass the test to have your course count as "completed". <br>
                - You may take the test as many times as you want. <br>
                - Your highest score will be saved. <br>
                </p>
            </div>
            <div class="buttons is-right">
                <a class="button is-info" href="../lessonPage/lessonPage.html?${cid}">Back to Course</a>
                <button class="button" onClick="window.location.reload()">Retake Test</button>
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
                                    $root.append(
                                        `<p class="help is-danger">Test doc does not exist.</p>`
                                    );
                                }
                            })
                            .catch((error) => {
                                // error occured when grabbing test doc / while executing .then code.
                                $root.append(`<p class="help is-danger">Get test: ${error}</p>`);
                            });
                    } else {
                        // course doc does not exist. doc.data() will be undefined in this case
                        $root.append(`<p class="help is-danger">Course doc does not exist.</p>`);
                    }
                })
                .catch((error) => {
                    // error occured when grabbing course doc / while executing .then code.
                    $root.append(`<p class="help is-danger">Get course: ${error}</p>`);
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
