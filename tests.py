from selenium import webdriver
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class SeleniumTests(unittest.TestCase):

    def setUp(self):
        PATH = 'C:\Program Files (x86)\chromedriver.exe'
        ops = webdriver.ChromeOptions()
        self.driver = webdriver.Chrome(executable_path=PATH, options=ops)
        self.driver.maximize_window()

        self.driver.get('http://localhost:3000')

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
        email.send_keys("testemail2@gmail.com")
        password = self.driver.find_element_by_id('password')
        password.send_keys("goodpass")
        pass2 = self.driver.find_element_by_id('reenterPassword')
        pass2.send_keys("goodpass")
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
        email_form.send_keys('testemail@gmail.com')
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
        email_form.send_keys('testemail1@gmail.com')
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys('goodpass')
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
        email_form.send_keys('testemail2@gmail.com')
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys('goodpass')
        login = self.driver.find_element_by_id('loginButton')
        login.click()
        insthome = WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.TAG_NAME, "h2"), "Courses")
        )
        self.assertIn("User Control Panel", self.driver.page_source)

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


#doesnt work yet
    def test_CourseCreation(self):
        self.loginInstructor()
        cc_btn = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "box"))
        )
        cc_link = self.driver.find_element_by_partial_link_text("New Course")
        cc_link.click()

    def loginInstructor(self):
        buttons = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'buttons')))
        loginbtn = self.driver.find_element_by_link_text('Log In')
        loginbtn.click()
        email_form = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((
                By.ID, 'email'
            )))
        email_form.send_keys('testemail2@gmail.com')
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys('goodpass')
        login = self.driver.find_element_by_id('loginButton')
        login.click()



    def tearDown(self):
        self.driver.close()

if __name__  == "__main__":
    unittest.main()