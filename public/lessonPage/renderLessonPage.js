/**
 * Authors: Aaron Zhang, Ben Rosenberger, Garrett Olcott
 * Summary: The student lesson view.
 */

const $root = $("#root");
const db = firebase.firestore();

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
                <a class="navbar-item nav-item icon-text" href="../studentHome/studentHome.html">
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

export async function renderBody(title, slide, increment, cid, tid) {
    return `
    <section class="section">
      <div class="container box">
			<div class="block py-4">
				    ${await renderTitle(title, slide.header)}
				<div class="buttons is-inline is-pulled-right pb-4">
                    ${await renderTakeTestButton(cid, tid)}
                </div>
			</div>
            <div class="pb-5">
			    <progress class="progress is-success" id="sProgress" value="${increment}" max="100"></progress>
            </div>
      		<nav class="pagination" role="navigation" aria-label="pagination">
      			<a class="pagination-previous" disabled="true">
				  	<span class="icon">
						<i class="fa fa-arrow-left"></i>
				  	</span>
					<span>Previous Page</span>
				</a>
        		<a class="pagination-next">
					<span class="icon-text">
						<span>Next Page</span>
  						<span class="icon">
    						<i class="fa fa-arrow-right"></i>
  						</span>
					</span>
				</a>
      		</nav>
			${await renderContent(slide)}
      </div>
    </section>
    `;
}

export async function renderTakeTestButton(cid, tid) {
    let enabled = `                    
    <a class="button is-info is-outlined" href="../testPage/testView.html?${cid}">
        <span class="icon">
            <i class="fa fa-pencil"></i>
        </span>
        <span>Take Test</span>
    </a>`;

    let disabled = `                    
    <button class="button is-info is-outlined" href="" disabled>
        <span class="icon">
            <i class="fa fa-pencil"></i>
        </span>
        <span>Take Test</span>
    </button>`;

    // render disabled if test doest not exist
    if (tid === null) {
        return disabled;
    }

    // get test questions to check length
    let testRef = db.collection("tests").doc(tid);
    let len;
    await testRef
        .get()
        .then((doc) => {
            if (doc.exists) {
                len = doc.data().questions.length;
            } else {
                // doc.data() will be undefined in this case
                alert(`renderTakeTestButton(): Test doc does not exist`);
            }
        })
        .catch((error) => {
            alert(`Get test: ${error}`);
        });

    // if not at least one question, render disabled button
    if (len < 1) {
        return disabled;
    }
    return enabled;
}

export async function renderTitle(title, header) {
    return `<h1 id="title" class="title is-inline is-1-mobile"><i class="fas fa-book"></i> ${title} - ${header}</h1>`;
}

export async function renderContent(slide) {
    return `
    <div id="content" class="content">
            <div id="editor"></div>
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
                alert(`Error downloading media: ${error}`);
            });
        return ``;
    }

    return ``;
}

export function createQuill(slide) {
    var quill = new Quill("#editor", {
        modules: {
            toolbar: false,
        },
        theme: "snow",
    });
    quill.disable();
    quill.root.innerHTML = slide.text;
    return quill;
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
    createQuill(slide);
}

export async function loadIntoDOM() {
    // check auth state
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            const userRef = db.collection("users").doc(user.uid);

            let cid, course;

            // get cid
            try {
                cid = location.search.substring(1);
            } catch (error) {
                // if cid is undefined...redirect to student home.
                window.location.href = "../studentHome/studentHome.html";
            }

            let courseRef = db.collection("courses").doc(cid);
            let slidesRef = await db.collection("courses").doc(cid).collection('slides').orderBy('slidenum', 'asc');
            let slides = [];
            await slidesRef.get()
                .then((querySnapshot)=>{
                    querySnapshot.forEach((slide)=> {
                        slides.push(slide.data());
                    
                    });
                });
            // update user course state "isStarted"
            userRef
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        let courses = doc.data().courses;

                        for (let i = 0; i < courses.length; i++) {
                            if (courses[i].cid == cid && courses[i].isStarted == false) {
                                userRef.update({
                                    courses: firebase.firestore.FieldValue.arrayRemove(courses[i]),
                                });

                                courses[i].isStarted = true;

                                userRef.update({
                                    courses: firebase.firestore.FieldValue.arrayUnion(courses[i]),
                                });
                            }
                        }
                    } else {
                        // user doc does not exist. doc.data() will be undefined in this case
                        alert(`User does not exist.`);
                    }
                })
                .catch((error) => {
                    // error occured when grabbing user doc / while executing .then code.
                    alert(`Get user: ${error}.`);
                });

            // build page
            courseRef
                .get()
                .then(async (doc) => {
                    if (doc.exists) {
                        course = doc.data();
                        let increment = 100 / slides.length;

                        // render page
                        await renderNavbar();
                        $root.append(
                            await renderBody(
                                course.title,
                                slides[0],
                                increment,
                                cid,
                                course.tid
                            )
                        );
                        createQuill(slides[0]);
                        let currIndex = 0;
                        let lastIndex = slides.length - 1;
                        if (lastIndex === 0) {
                            // edge case. only one slide in lesson.
                            $(".pagination-next").replaceWith(
                                `<a class="pagination-next" disabled="true">
                                    <span class="icon-text">
						                <span>Next Page</span>
  						                <span class="icon">
    						                <i class="fa fa-arrow-right"></i>
  						                </span>
					                </span>
                                </a>`
                            );
                        }

                        // pagination button functionality
                        $(".pagination-previous").on("click", () => {
                            if (currIndex <= 0) {
                                return;
                            }
                            // decrement by 100/size of section deck
                            document.getElementById("sProgress").value -= increment;
                            currIndex--;
                            recalculateButtons(
                                currIndex,
                                lastIndex,
                                slides[currIndex],
                                course.title
                            );
                        });
                        $(".pagination-next").on("click", () => {
                            if (currIndex >= lastIndex) {
                                return;
                            }
                            // increment by 100/size of section deck
                            document.getElementById("sProgress").value += increment;
                            currIndex++;
                            recalculateButtons(
                                currIndex,
                                lastIndex,
                                slides[currIndex],
                                course.title
                            );
                        });
                    } else {
                        // course doc does not exist. doc.data() will be undefined in this case
                        alert(`Course does not exist.`);
                    }
                })
                .catch((error) => {
                    // error occured when grabbing course doc / while executing .then code.
                    alert(`Get course: ${error}`);
                    console.log(error);
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
