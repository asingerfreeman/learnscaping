const $root = $("#root");
let score = 0;
let increment;

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
    <section class="section">
      <div class="container">
		<div class="block">
			<h1 class="title">${data.title} - Test</h1>
      		<nav class="pagination" role="navigation" aria-label="pagination">
				<a></a>
        		<a class="pagination-next">Next Question</a>
      		</nav>
      		<progress class="progress is-success" id="sProgress" value="${increment}" max="100"></progress>
			<div class="block">
				<a class="button is-fullwidth is-info is-outlined" href="../lessonPage/lessonPage.html?${
                    data.cid
                }">Back to Course</a>
		  	</div class="block">
			${await renderContent(0, data.questions[0])}
  		</div> 
      </div>
    </section>
    `);

    // delete notif button functionality
    $root.on("click", ".delete", () => {
        $(".notification").replaceWith(`<div id="notification"></div>`);
    });

    $root.on("click", "#submit", handleSubmitButtonPress);

    await setupPagination(data);

    return;
}

export async function setupPagination(data) {
    // pagination variables
    let currIndex = 0;
    let lastIndex = data.questions.length - 1;
    if (lastIndex === 0) {
        // edge case. only one question in test.
        $(".pagination-next").replaceWith(
            `<button id="finish" class="button is-success is-outlined">Submit Test</button>`
        );
    }

    $(".pagination-next").on("click", () => {
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
    // replace next button if last question
    if (currIndex === lastIndex) {
        $(".pagination-next").replaceWith(
            `<button id="finish" class="button is-success is-outlined">Submit Test</button>`
        );
    }

    // update page with new question content
    $("#content").replaceWith(await renderContent(currIndex, question));
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
            <p id="a" data-isCorrect="${question.answerA.isCorrect}">A: ${question.answerA.data}</p>
		</div>
		<div class="block">
            <p id="b" data-isCorrect="${question.answerB.isCorrect}">B: ${question.answerB.data}</p>
		</div>
		<div class="block">
            <p id="c" data-isCorrect="${question.answerC.isCorrect}">C: ${question.answerC.data}</p>
		</div>
		<div class="block">
            <p id="d" data-isCorrect="${question.answerD.isCorrect}">D: ${question.answerD.data}</p>
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
            <button id="submit" class="button is-success is-right">Submit</button>
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

export async function loadIntoDOM() {
    // check auth state
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            const db = firebase.firestore();
            let cid, tid, title;

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
                                $root.append(`<p class="help is-danger">${error}</p>`);
                            });
                    } else {
                        // course doc does not exist. doc.data() will be undefined in this case
                        $root.append(`<p class="help is-danger">Course doc does not exist.</p>`);
                    }
                })
                .catch((error) => {
                    // error occured when grabbing course doc / while executing .then code.
                    $root.append(`<p class="help is-danger">${error}</p>`);
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
