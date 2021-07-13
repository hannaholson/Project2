# def scrape():
# dependencies
import re
import datetime
import pandas as pd
from splinter import Browser
from selenium import webdriver
from bs4 import BeautifulSoup as bs
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# NASA Mars News
executable_path = {'executable_path': ChromeDriverManager().install()}
browser = Browser('chrome', **executable_path, headless=True)
url = "https://beta.bls.gov/dataQuery/find?q=data+science&q=data+scientists&r=100&st=0"
browser.visit(url)
html = browser.html
soup = bs(html, 'html.parser')
data_query_results = soup.find_all('a', class_='dq-result-item')
url_dict = {"url":[]}
data_query_df = pd.DataFrame([])

for result in data_query_results:
    result_url = data_query_results.find(href=True)
    url_dict["url"].append(result_url)

url_dict_df = pd.DataFrame(url_dict)

url_dict_df