#from selenium import webdriver
#import time
#PATH = "C:\Program Files (x86)\chromedriver.exe"
#realoptions = webdriver.ChromeOptions()
#realoptions.add_experimental_option('excludeSwitches', ['enable-logging'])



#driver = webdriver.Chrome(PATH, options=realoptions)

#driver.get("https://cs.unc.edu")

#element = driver.find_element_by_name('s')
#element.send_keys("stotts")

#element = driver.find_element_by_class_name('search-submit')
#element.click()

#elements = driver.find_elements_by_class_name('gs-title')

#for element in elements:
#    print(element.text)


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
#driver.quit()