import random
import string

from selenium import webdriver
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

PATH = 'C:\Program Files (x86)\chromedriver.exe'
ops = webdriver.ChromeOptions()
student_email = ''.join(random.choice(string.ascii_lowercase) for i in range(10)) + '@test.com'


class SeleniumTests(unittest.TestCase):

    def setUp(self):

        self.driver = webdriver.Chrome(executable_path=PATH, options=ops)
        self.driver.maximize_window()

        self.driver.get('http://localhost:3000')
        self.test_student_email = student_email
        self.test_student_password = "goodpass"
        self.test_instructor_email = "testemail2@gmail.com"
        self.test_instructor_pass = "goodpass"
        self.test_course_title = "Test course title"

    def test_signUp(self):
        buttons = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'buttons')))
        signupbtn = self.driver.find_element_by_link_text('Sign Up')
        signupbtn.click()
        signup_form = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((
                By.TAG_NAME, 'form'
            )))
        firstname = self.driver.find_element_by_id('firstName')
        firstname.send_keys("Testing")
        lastname = self.driver.find_element_by_id('lastName')
        lastname.send_keys("Account")
        email = self.driver.find_element_by_id('email')
        email.send_keys(self.test_student_email)
        password = self.driver.find_element_by_id('password')
        password.send_keys(self.test_student_password)
        pass2 = self.driver.find_element_by_id('reenterPassword')
        pass2.send_keys(self.test_student_password)
        signupsubmit  = self.driver.find_element_by_id("signupButton")
        signupsubmit.click()
        studenthome = WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.TAG_NAME, "h1"), "Courses")
        )
        self.assertIn("Courses", self.driver.page_source)

    def test_checkLoginBadCreds(self):
        buttons = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'buttons')))
        loginbtn = self.driver.find_element_by_link_text('Log In')
        loginbtn.click()
        email_form = WebDriverWait(self.driver,10).until(
            EC.presence_of_element_located((
                By.ID, 'email'
            )))
        email_form.send_keys(self.test_student_email)
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys('wrongpass')
        login = self.driver.find_element_by_id('loginButton')
        login.click()
        wrong_creds = WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.ID, "errorMessage"), "User not found.")
        )
        self.assertIn("User not found.", self.driver.page_source)

    def test_loginStudent(self):
        buttons = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'buttons')))
        loginbtn = self.driver.find_element_by_link_text('Log In')
        loginbtn.click()
        email_form = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((
                By.ID, 'email'
            )))
        email_form.send_keys(self.test_student_email)
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys(self.test_student_password)
        login = self.driver.find_element_by_id('loginButton')
        login.click()
        studenthome = WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.TAG_NAME, "h1"), "Courses")
        )
        self.assertIn("Courses", self.driver.page_source)

    def test_loginInstructor(self):
        buttons = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'buttons')))
        loginbtn = self.driver.find_element_by_link_text('Log In')
        loginbtn.click()
        email_form = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((
                By.ID, 'email'
            )))
        email_form.send_keys(self.test_instructor_email)
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys(self.test_instructor_pass)
        login = self.driver.find_element_by_id('loginButton')
        login.click()
        insthome = WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.TAG_NAME, "h2"), "Courses")
        )
        self.assertIn("User Control Panel", self.driver.page_source)

    def test_studentNavigationLesson(self):
        self.loginStudent()
        test_course = self.driver.find_element_by_css_selector("a.box")
        test_course.click()
        next_page = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "pagination-next"))
        )
        disabled_next = next_page.get_attribute("disabled")
        while disabled_next is None:
            next_page.click()
            next_page = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "pagination-next"))
            )
            disabled_next = next_page.get_attribute("disabled")
        self.assertIn("disabled", self.driver.page_source)

    def test_instructorAssignLesson(self):
        self.loginInstructor()
        table = WebDriverWait(self.driver,10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "td"))
        )
        #studentrow = self.driver.find_elements_by_id("lL39IPdUMraMEeBAlhuJ1mnI9BU2")
        studentrow = self.driver.find_elements_by_xpath("//*[text()=Testing Account]")
        assignmod3 = studentrow[4]
        assignmod3.click()
        time.sleep(.5)
        self.driver.refresh()
        table = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "td"))
        )
        studentrow = self.driver.find_elements_by_xpath("//*[text()=Testing Account]")
        self.assertEqual("Not Started", studentrow[5].text)


    def test_toggleInstructor(self):
        self.loginInstructor()
        controlpanel = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "navbar-item"))
        )
        link = self.driver.find_element_by_link_text("User Control Panel")
        link.click()
        tabledata = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "td"))
        )

        student_to_instructor = self.driver.find_element_by_name("TestingStudentisInstr")
        student_to_instructor.click()
        time.sleep(.5)
        home = self.driver.find_element_by_link_text("Instructor Home")
        home.click()
        student_table = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "td"))
        )
        self.assertNotIn("Testing Student", self.driver.page_source)
        #puts account back to instructor
        link = self.driver.find_element_by_link_text("User Control Panel")
        link.click()
        tabledata = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "td"))
        )

        student_to_instructor = self.driver.find_element_by_name("TestingStudentisInstr")
        student_to_instructor.click()

    def test_CourseCreationAndVerificationInstrView(self):
        self.loginInstructor()
        cc_btn = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "is-success"))
        )
        cc_link = self.driver.find_element_by_partial_link_text("New Course")
        cc_link.click()
        title_fld = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "titleValue"))
        )
        title_fld.send_keys(self.test_course_title)
        submit_title = self.driver.find_element_by_id('submitTitleButton')
        submit_title.click()
        page1hdr = WebDriverWait(self.driver, 10).until(
        EC.presence_of_element_located((By.ID, "header"))
        )
        page1hdr.send_keys("example slide header")
        page1text = self.driver.find_element_by_class_name("ql-editor")
        page1text.send_keys("example text here hello world")
        submitbtn = self.driver.find_element_by_id("savePageButton")
        submitbtn.click()
        create_test_page = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "toTestButton"))
        )
        create_test_page.click()
        min_pass = WebDriverWait(self.driver,10).until(
            EC.presence_of_element_located((By.ID, "grade"))
        )
        min_pass.send_keys(80)
        gradebtn = self.driver.find_element_by_id("submitGradeButton")
        gradebtn.click()
        WebDriverWait(self.driver,10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "textarea"))
        )
        questionbox = self.driver.find_element_by_id("questionValue")
        questionbox.send_keys("EXAMPLE QUESTION 1")
        choice_a = self.driver.find_element_by_id("aValue")
        choice_a.send_keys("flowers")
        choice_b = self.driver.find_element_by_id("bValue")
        choice_b.send_keys("trees")
        choice_c = self.driver.find_element_by_id("cValue")
        choice_c.send_keys("bushes")
        choice_d = self.driver.find_element_by_id("dValue")
        choice_d.send_keys("shrubs")
        correct_answer = self.driver.find_element_by_id("bCheck")
        correct_answer.click()
        submit_question = self.driver.find_element_by_id("submitQuestionButton")
        submit_question.click()
        finishpage = WebDriverWait(self.driver,10).until(
            EC.presence_of_element_located((By.ID, "finishButton"))
        )
        finishpage.click()
        WebDriverWait(self.driver,10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "container"))
        )
        homelink = self.driver.find_element_by_link_text('Home')
        homelink.click()
        courses = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "article.media"))
        )
        newcourse = courses[-1]
        self.assertIn(self.test_course_title, newcourse.text)
    def loginInstructor(self):
        buttons = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'buttons')))
        loginbtn = self.driver.find_element_by_link_text('Log In')
        loginbtn.click()
        email_form = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((
                By.ID, 'email'
            )))
        email_form.send_keys(self.test_instructor_email)
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys(self.test_instructor_pass)
        login = self.driver.find_element_by_id('loginButton')
        login.click()

    def loginStudent(self):
        buttons = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'buttons')))
        loginbtn = self.driver.find_element_by_link_text('Log In')
        loginbtn.click()
        email_form = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((
                By.ID, 'email'
            )))
        email_form.send_keys(self.test_student_email)
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys(self.test_student_password)
        login = self.driver.find_element_by_id('loginButton')
        login.click()
        studenthome = WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.TAG_NAME, "h1"), "Courses")
        )

    def tearDown(self):
        self.driver.close()

if __name__  == "__main__":
    unittest.main()