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

export async function renderBody(title, question, increment, cid) {
	return `
    <section class="section">
      <div class="container">
		<div class="block">
			<h1 class="title">${title} - Test</h1>
      		<nav class="pagination" role="navigation" aria-label="pagination">
      			<a class="pagination-previous" disabled="true">Previous</a>
        		<a class="pagination-next">Next page</a>
      		</nav>
      		<progress class="progress is-success" id="sProgress" value="${increment}" max="100"></progress>
            <div class="block">
                <a class="button is-fullwidth is-info is-outlined" href="../lessonPage/lessonPage.html?${cid}">Back to Course</a>
            </div class="block">
			${await renderContent(question)}
  		</div> 
      </div>
    </section>
    `;
}

export async function renderContent(question) {
	return `
    <form>
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
            <label class="label">Answer Choice</label>
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
    </form>
    `;
}

export async function loadIntoDOM() {
	// check auth state
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			const $root = $("#root");
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

									// render navbar
									$root.append(await renderNavbar());
									// Check for click events on the navbar burger icon
									$(".navbar-burger").click(function () {
										// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
										$(".navbar-burger").toggleClass(
											"is-active"
										);
										$(".navbar-menu").toggleClass(
											"is-active"
										);
									});

									// render first question content
									$root.append(
										await renderBody(
											title,
											questions[0],
											increment,
											cid
										)
									);
									// pagination button functionality
								} else {
									// test doc does not exist. doc.data() will be undefined in this case
									$root.append(
										`<p class="help is-danger">Error getting document: tid unrecognized, document does not exist. Please reload and try again. If issue persists, contact an admin for help.</p>`
									);
								}
							})
							.catch((error) => {
								// error occured when grabbing test doc / while executing .then code.
								$root.append(
									`<p class="help is-danger">Error getting document: ${error}. Please reload and try again. If issue persists, contact an admin for help.</p>`
								);
							});
					} else {
						// course doc does not exist. doc.data() will be undefined in this case
						$root.append(
							`<p class="help is-danger">Error getting document: cid unrecognized, document does not exist. Please reload and try again. If issue persists, contact an admin for help.</p>`
						);
					}
				})
				.catch((error) => {
					// error occured when grabbing course doc / while executing .then code.
					$root.append(
						`<p class="help is-danger">Error getting document: ${error}. Please reload and try again. If issue persists, contact an admin for help.</p>`
					);
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
