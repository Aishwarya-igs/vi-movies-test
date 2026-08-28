# simple_ott_test.py
from selenium import webdriver
from selenium.webdriver.common.by import By

# 1. Start browser and open page
driver = webdriver.Chrome()
driver.implicitly_wait(5)
driver.get("https://example-ott.com/login")

# 2. Enter mobile number and submit
driver.find_element(By.ID, "mobile-input").send_keys("9876543210")
driver.find_element(By.CLASS_NAME, "send-otp-btn").click()

# 3. Enter OTP and login
driver.find_element(By.ID, "otp-input").send_keys("123456")
driver.find_element(By.ID, "login-submit").click()

# 4. Verify login success
assert "/home" in driver.current_url
assert driver.find_element(By.CLASS_NAME, "profile-icon").is_displayed()

# 5. Close browser
driver.quit()
