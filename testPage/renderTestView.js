export async function renderPage(data, $root) {
	// render navbar
	$root.append(await renderNavbar());
	// navbar burger functionality
	$(".navbar-burger").click(function () {
		$(".navbar-burger").toggleClass("is-active");
		$(".navbar-menu").toggleClass("is-active");
	});

	// render first question content
	$root.append(await renderBody(data));

	// delete notif button functionality
	$root.on("click", ".delete", () => {
		$(".notification").remove();
	});

	// pagination variables
	let currIndex = 0;
	let lastIndex = data.questions.length - 1;
	if (lastIndex === 0) {
		// edge case. only one question in test.
		$(".pagination-next").replaceWith(
			`<a class="pagination-next" disabled="true">Next</a>`
		);
	}

	// pagination button functionality
	$(".pagination-previous").on("click", () => {
		if (currIndex <= 0) {
			return;
		}
		// decrement by 100/size of section deck
		document.getElementById("sProgress").value -= data.increment;
		currIndex--;
		recalculateButtons(currIndex, lastIndex, data.questions[currIndex]);
	});
	$(".pagination-next").on("click", () => {
		if (currIndex >= lastIndex) {
			return;
		}
		// increment by 100/size of section deck
		document.getElementById("sProgress").value += data.increment;
		currIndex++;
		recalculateButtons(currIndex, lastIndex, data.questions[currIndex]);
	});
}

export async function renderNavbar() {
	return `
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
    </nav> `;
}

export async function renderBody(data) {
	return `
    <section class="section">
      <div class="container">
		<div class="block">
			<h1 class="title">${data.title} - Test</h1>
      		<nav class="pagination" role="navigation" aria-label="pagination">
      			<a class="pagination-previous" disabled="true">Previous</a>
        		<a class="pagination-next">Next page</a>
      		</nav>
      		<progress class="progress is-success" id="sProgress" value="${
				data.increment
			}" max="100"></progress>
            <div class="block">
                <a class="button is-fullwidth is-info is-outlined" href="../lessonPage/lessonPage.html?${
					data.cid
				}">Back to Course</a>
            </div class="block">
			${await renderContent(data.questions[0])}
  		</div> 
      </div>
    </section>
    `;
}

export async function renderContent(question) {
	return `
    <form id="content">
        <div class="notification is-success">
            <button class="delete"></button>
            Correct!
        </div>
        <div class="block">
            <p><strong>${question.question}</strong></p>
        </div>
        <div class="block">
            <p>A: ${question.answerA.data}</p>
            <p>B: ${question.answerB.data}</p>
            <p>C: ${question.answerC.data}</p>
            <p>D: ${question.answerD.data}</p>
        </div>
        <div class="field">
            <div class="control">
                <div class="select">
                    <select>
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
            <button class="button is-success is-right">Submit</button>
        </div>
    </form>
    `;
}

export async function recalculateButtons(currIndex, lastIndex, question) {
	// update button visuals
	if (currIndex === 0) {
		$(".pagination-previous").attr("disabled", true);
		$(".pagination-next").attr("disabled", false);
	} else if (currIndex === lastIndex) {
		$(".pagination-next").attr("disabled", true);
		$(".pagination-previous").attr("disabled", false);
	} else {
		$(".pagination-previous").attr("disabled", false);
		$(".pagination-next").attr("disabled", false);
	}

	// update page with new question content
	$("#content").replaceWith(await renderContent(question));
}

export async function loadIntoDOM() {
	const $root = $("#root");

	// check auth state
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			const db = firebase.firestore();
			let cid, questions, tid, title;

			// get cid
			try {
				cid = location.search.substring(1);
			} catch (error) {
				// if cid is undefined...redirect to student home.
				window.location.href = "../studentHome/studentHome.html";
			}

			// get course doc to get test
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
									questions = doc.data().questions;
									let increment = 100 / questions.length;
									let data = {
										title: title,
										questions: questions,
										increment: increment,
										cid: cid,
									};

									await renderPage(data, $root);
								} else {
									// test doc does not exist. doc.data() will be undefined in this case
									$root.append(
										`<p class="help is-danger">Error getting document: tid unrecognized, document does not exist.</p>`
									);
								}
							})
							.catch((error) => {
								// error occured when grabbing test doc / while executing .then code.
								$root.append(
									`<p class="help is-danger">${error}</p>`
								);
							});
					} else {
						// course doc does not exist. doc.data() will be undefined in this case
						$root.append(
							`<p class="help is-danger">Error getting document: cid unrecognized, document does not exist.</p>`
						);
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
