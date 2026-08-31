# ZEE5 Automation Smoke Test Script
# Language: Python
# Framework: Selenium WebDriver

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def run_zee5_test():
    # 1. Initialize the Chrome WebDriver with options
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")

    print("Initializing Chrome Driver...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        # 2. Open the ZEE5 platform
        print("Navigating to ZEE5 Official Website...")
        driver.get("https://www.zee5.com/")

        # 3. Wait and Verify Homepage Title
        wait = WebDriverWait(driver, 15)
        wait.until(EC.title_contains("ZEE5"))
        print(f"â Homepage loaded successfully. Title: {driver.title}")

        # 4. Locate and Click on the 'TV Shows' Navigation Link
        print("Locating 'TV Shows' navigation link...")
        tv_shows_tab = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "TV Shows")))
        tv_shows_tab.click()

        # 5. Verify the TV Shows page URL redirection
        wait.until(EC.url_contains("/tv-shows"))
        print(f"â Successfully navigated to TV Shows page: {driver.current_url}")

        # 6. Scroll down to trigger lazy loading of image and video modules
        print("Scrolling down to render dynamic contents...")
        driver.execute_script("window.scrollTo(0, 500);")
        time.sleep(3)

        # 7. Check if content cards are present on the DOM
        video_cards = driver.find_elements(By.XPATH, "//div[contains(@class, 'card')]")
        print(f"â Found {len(video_cards)} video content elements on the target layout page.")

        if len(video_cards) > 0:
            print("STATUS: Test Passed - Basic platform navigation smoke verification complete.")
        else:
            print("STATUS: Test Failed - Structural components failed to load inside timeouts.")

    except Exception as e:
        print(f"â Test Automation Execution Interrupted: {e}")

    finally:
        # 8. Clean up and close the active browser window session
        print("Terminating testing browser session...")
        driver.quit()

if __name__ == "__main__":
    run_zee5_test()
