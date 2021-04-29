/**
 * Author: Aaron Zhang
 * Summary: Sign up page.
 */

export async function renderBody() {
    return ` 
    <section class="hero is-fullheight">
      <div class="hero-body">
          <div class="container">
              <div class="columns is-centered">
                  <div class="column is-5-tablet is-4-desktop is-4-widescreen">
                      
                      <div class="has-text-centered">
                          <img class="login-logo" src="../media/learnscaping_logo.png">
                      </div>
  
                      <form action="" class="box">
                        <h1 class="title is-spaced">Sign Up</h1>

                        <div id="message"></div>

                        <div class="field">
                            <label for="" class="label">First Name</label>
                            <div class="control has-icons-left">
                                <input id="firstName" type="text" placeholder="Bob" class="input" required>
                                <span class="icon is-small is-left">
                                    <i class="fa fa-user"></i>
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label for="" class="label">Last Name</label>
                            <div class="control has-icons-left">
                                <input id="lastName" type="text" placeholder="Smith" class="input" required>
                                <span class="icon is-small is-left">
                                    <i class="fa fa-user"></i>
                                </span>
                            </div>
                        </div>  
                        <div class="field">
                              <label for="" class="label">Email</label>
                              <div class="control has-icons-left">
                                  <input id="email" type="email" placeholder="e.g. bobsmith@live.unc.edu" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-envelope"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <label for="" class="label">Password</label>
                              <div class="control has-icons-left">
                                  <input id="password" type="password" placeholder="*******" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-lock"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <label for="" class="label">Re-enter Password</label>
                              <div class="control has-icons-left">
                                  <input id="reenterPassword" type="password" placeholder="*******" class="input" required>
                                  <span class="icon is-small is-left">
                                      <i class="fa fa-lock"></i>
                                  </span>
                              </div>
                          </div>
                          <div class="field">
                              <button class="button is-info" id="signupButton">
                                  Sign Up
                              </button>
                          </div>
                          <div class="field">
                                <div>
                                  <a href="../loginPage/login.html"> Already have an account? Log in here!</a>
                              </div>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </section>
      `;
}

export async function handleSignupButtonPress(event) {
    event.preventDefault();

    let first = document.getElementById("firstName").value;
    let last = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let reenterPassword = document.getElementById("reenterPassword").value;

    // check if all inputs are filled
    if (
        first.length === 0 ||
        last.length === 0 ||
        email.length === 0 ||
        password.length === 0 ||
        reenterPassword.length === 0
    ) {
        event.preventDefault();
        $("#message").replaceWith(
            `<div id="message" class="subtitle" style="color: red">Please fill out all sections.</div>`
        );
        return;
    }

    //check if password and reenterPassword match
    if (password !== reenterPassword) {
        event.preventDefault();
        $("#message").replaceWith(
            `<div id="message" class="subtitle" style="color: red">Passwords do not match.</div>`
        );

        return;
    }

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;

            // ADD NEW USER OBJECT TO DATABASE
            let db = firebase.firestore();
            db.collection("users")
                .doc(`${user.uid}`)
                .set({
                    courses: [],
                    first: first,
                    isInstructor: false,
                    last: last,
                })
                .then(() => {
                    // redirect to student home (all new users start as students)
                    window.location.href = "../studentHome/studentHome.html";
                })
                .catch((error) => {
                    alert("Error adding document: ", error);
                });
        })
        .catch((error) => {
            var errorCode = error.code;

            // sign in error handling
            if (errorCode === "auth/weak-password") {
                $("#message").replaceWith(
                    `<div id="message" class="subtitle" style="color: red">Password must be at least 6 characters.</div>`
                );
            } else if (errorCode === "auth/email-already-in-use") {
                $("#message").replaceWith(
                    `<div id="message" class="subtitle" style="color: red">Email already in use.</div>`
                );
            } else if (errorCode === "auth/invalid-email") {
                $("#message").replaceWith(
                    `<div id="message" class="subtitle" style="color: red">Invalid email.</div>`
                );
            }
        });
}

export async function loadIntoDOM() {
    // check user auth state
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            const db = firebase.firestore();
            const userRef = db.collection("users").doc(user.uid);

            userRef
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        if (doc.data().isInstructor) {
                            window.location.href = "../instructorHome/instructorHome.html";
                        } else {
                            window.location.href = "../studentHome/studentHome.html";
                        }
                    } else {
                        // doc.data() will be undefined in this case
                        alert(`User does not exist.`);
                    }
                })
                .catch((error) => {
                    alert(`Get user: ${error}.`);
                });
        } else {
            // No user is signed in.
            const $root = $("#root");

            $root.append(await renderBody());

            $root.on("click", "#signupButton", handleSignupButtonPress);
        }
    });
}

$(function () {
    loadIntoDOM();
});
