export async function renderNavbar() {
    return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="../studentHome/studentHome.html">
                <img src="../media/learnscaping_logo.png" width="210">
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
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

export async function renderBody(title, slide, increment, cid) {
    return `
    <section class="section">
      <div class="container">
		<div class="block">
			${await renderTitle(title, slide.header)}
      		<nav class="pagination" role="navigation" aria-label="pagination">
      			<a class="pagination-previous" disabled="true">Previous</a>
        		<a class="pagination-next">Next page</a>
      		</nav>
      		<progress class="progress is-success" id="sProgress" value="${increment}" max="100"></progress>
            <div class="block">
                <a class="button is-fullwidth is-info is-outlined" href="../testPage/test.html?${cid}">Take Test</a>
            </div class="block">
			${await renderContent(slide)}
  		</div> 
      </div>
    </section>
    `;
}

export async function renderTitle(title, header) {
    return `<h1 id="title" class="title">${title} - ${header}</h1>`;
}

export async function renderContent(slide) {
    return `
    <div id="content" class="content">
		<p style="white-space: pre-wrap">${slide.text}</p>
            <figure class="image">
                <img id="media">
                <div id="script">${await downloadMedia(slide.media)}</div>
            </figure>
	</div>`;
}

export async function downloadMedia(media) {
    // find, download, and append any media to the lesson page
    if (media != null) {
        const storage = firebase.storage();
        const storageRef = storage.ref();
        storageRef
            .child(media)
            .getDownloadURL()
            .then((url) => {
                var img = document.getElementById("media");
                img.setAttribute("src", url);
            })
            .catch((error) => {
                console.log(error);
                $("#content").append(
                    `<p class="help is-danger">Error downloading media: ${error}</p>`
                );
            });
        return ``;
    }

    return ``;
}

export async function recalculateButtons(currIndex, lastIndex, slide, title) {
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

    // update page with new lesson content
    $("#title").replaceWith(await renderTitle(title, slide.header));
    $("#content").replaceWith(await renderContent(slide));
}

export async function loadIntoDOM() {
    // check auth state
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            const $root = $("#root");
            const db = firebase.firestore();
            const userRef = db.collection("users").doc(user.uid);

            let cid, slides, title;

            // get course slides
            try {
                cid = location.search.substring(1);
            } catch (error) {
                // if cid is undefined...redirect to student home.
                window.location.href = "../loginPage/login.html";
            }

            let courseRef = db.collection("courses").doc(cid);

            // update user course state "isStarted"
            userRef
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        let courses = doc.data().courses;

                        for (let i = 0; i < courses.length; i++) {
                            if (
                                courses[i].cid == cid &&
                                courses[i].isStarted == false
                            ) {
                                userRef.update({
                                    courses: firebase.firestore.FieldValue.arrayRemove(
                                        courses[i]
                                    ),
                                });

                                courses[i].isStarted = true;

                                userRef.update({
                                    courses: firebase.firestore.FieldValue.arrayUnion(
                                        courses[i]
                                    ),
                                });
                            }
                        }
                    } else {
                        // user doc does not exist. doc.data() will be undefined in this case
                        $root.append(
                            `<p class="help is-danger">Error getting document: uid unrecognized. Please reload and try again. If issue persists, contact an admin for help.</p>`
                        );
                    }
                })
                .catch((error) => {
                    // error occured when grabbing user doc / while executing .then code.
                    $root.append(
                        `<p class="help is-danger">Error getting document: ${error}. Please reload and try again. If issue persists, contact an admin for help.</p>`
                    );
                });

            // build page
            courseRef
                .get()
                .then(async (doc) => {
                    if (doc.exists) {
                        title = doc.data().title;
                        slides = doc.data().slides;
                        let increment = 100 / slides.length;

                        // render page
                        $root.append(await renderNavbar());
                        $root.append(
                            await renderBody(title, slides[0], increment, cid)
                        );

                        let currIndex = 0;
                        let lastIndex = slides.length - 1;
                        if (lastIndex === 0) {
                            // edge case. only one slide in lesson.
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
                            document.getElementById(
                                "sProgress"
                            ).value -= increment;
                            currIndex--;
                            recalculateButtons(
                                currIndex,
                                lastIndex,
                                slides[currIndex],
                                title
                            );
                        });
                        $(".pagination-next").on("click", () => {
                            if (currIndex >= lastIndex) {
                                return;
                            }
                            // increment by 100/size of section deck
                            document.getElementById(
                                "sProgress"
                            ).value += increment;
                            currIndex++;
                            recalculateButtons(
                                currIndex,
                                lastIndex,
                                slides[currIndex],
                                title
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
