from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
import time

PATH = "C:\Program Files (x86)\chromedriver.exe"
realoptions = webdriver.ChromeOptions()
#realoptions.add_argument("--headless")
#realoptions.add_argument("--disable-gpu")
#realoptions.add_argument("--no-sandbox")
realoptions.add_experimental_option('excludeSwitches', ['enable-logging'])

driver = webdriver.Chrome(PATH, options=realoptions)
driver.maximize_window()
driver.get("https://cs.unc.edu")

#search_input = WebDriverWait(driver, 10).until(
#    expected_conditions.presence_of_element_located((By.NAME, "s"))
#)
#search_input.send_keys("stotts")
#submit = driver.find_element_by_class_name('search-submit')
#submit.click()

#results = WebDriverWait(driver, 10).until(
#    expected_conditions.presence_of_all_elements_located((By.CLASS_NAME, "gsc-result"))
#)

#titles = driver.find_elements_by_css_selector('a.gs-title')

#for title in titles:
#    print(title.text)


#EXAMPLE 2

#element = driver.find_element_by_class_name("menu-people")
#element.click()

#time.sleep(2)

#element = driver.find_element_by_class_name("menu-faculty")
#element.click()

#elements = driver.find_elements_by_class_name("uncperson")

#for element in elements:
#    print(element.text)
#    print("")
driver.quit()