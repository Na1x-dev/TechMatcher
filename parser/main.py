import requests
from bs4 import BeautifulSoup
import psycopg2
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

service = Service()
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)

DB_NAME = "tech_matcher"
URL = "https://catalog.onliner.by/mobile?mobile_type%5B0%5D=smartphone&mobile_type%5Boperation%5D=union&page="
INSERT_QUERY = """
    INSERT INTO tech_matcher_app_smartphone (
        launch_year, os_version, screen_size, screen_res, screen_type,
        screen_fps, ram_size, ram_type, rom_size, rom_type,
        camera_count, main_camera_mp, camera_type, camera_block,
        max_video_resolution, front_camera_mp, front_camera_aperture,
        cpu, tech_process, gpu, edges_material, back_material,
        back_color, protection, length, width, thickness,
        weight, screen_ratio, screen_protector, color_count,
        ppi, accum_type, accum_volume, charging_power,
        wireless_charging, bluetooth, audio_port, charge_port,
        wifi, nfc, _5g, sim_count, sim_type, title, image_url, price, brand
    ) VALUES (%s) RETURNING id;
    """
COLUMN_MAPPING = {
            "Дата выхода на рынок": "launch_year",
            "Версия ОС на момент выхода": "os_version",
            "Размер экрана": "screen_size",
            "Разрешение экрана": "screen_res",
            "Технология экрана": "screen_type",
            "Частота обновления экрана": "screen_fps",
            "Объем оперативной памяти": "ram_size",
            "Тип оперативной памяти": "ram_type",
            "Объем встроенной памяти": "rom_size",
            "Тип встроенной памяти": "rom_type",
            "Количество основных камер": "camera_count",
            "Количество точек матрицы основной камеры": "main_camera_mp",
            "Модули камер": "camera_type",
            "Характеристики блока камер": "camera_block",
            "Максимальное разрешение видео": "max_video_resolution",
            "Фронтальная камера": "front_camera_mp",
            "Диафрагма фронтальной камеры": "front_camera_aperture",
            "Процессор": "cpu",
            "Техпроцесс": "tech_process",
            "Графический ускоритель": "gpu",
            "Материал граней": "edges_material",
            "Материал задней крышки": "back_material",
            "Цвет задней крышки": "back_color",
            "Пыле- и влагозащита": "protection",
            "Длина": "length",
            "Ширина": "width",
            "Толщина": "thickness",
            "Вес": "weight",
            "Соотношение сторон": "screen_ratio",
            "Защита от царапин": "screen_protector",
            "Количество цветов экрана": "color_count",
            "Разрешающая способность экрана": "ppi",
            "Тип аккумулятора": "accum_type",
            "Емкость аккумулятора": "accum_volume",
            "Мощность зарядки": "charging_power",
            "Беспроводная зарядка": "wireless_charging",
            "Bluetooth": "bluetooth",
            "Аудиовыход": "audio_port",
            "Разъём подключения": "charge_port",
            "Wi-Fi": "wifi",
            "NFC": "nfc",
            "5G": "_5g",
            "Количество физических SIM-карт": "sim_count",
            "Формат SIM-карты": "sim_type",
            "Название":"title",
            "Картинка":"image_url",
            "Стоимость":"price",
            "Бренд":"brand",
        }


def create_connect():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user="postgres",
        password="1234",
        host="127.0.0.1",
        port="5432"
    )
    return conn


def insert_data(data):
    conn = create_connect()
    cursor = conn.cursor()
    try:
        cursor.execute(INSERT_QUERY.replace('%s', ', '.join(['%s'] * len(data))), data)
        conn.commit()
    except psycopg2.errors.SyntaxError as e:
        print(f"Error inserting data: {e}")
        print(f"Data: {data}")
        print(f"INSERT_QUERY: {INSERT_QUERY}")
        raise e
    finally:
        cursor.close()
        conn.close()


def scroll_to_bottom(driver):
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height: 
            break
        last_height = new_height


def parse_mobile_page(url):
    driver.get(url)
    
    scroll_to_bottom(driver)

    while True:
        try:
            offers_list = driver.find_elements(By.CSS_SELECTOR, '.catalog-form__offers-list .catalog-form__link_base-additional')
            if not offers_list:
                break
            for item in offers_list:
                link = item.get_attribute('href')
                print(f"Парсинг объекта: {link}")
                if len(driver.window_handles) < 2:
                    driver.execute_script("window.open('');")
                
                driver.switch_to.window(driver.window_handles[1])
                driver.get(link)
                parse_object(link) 
                driver.close() 
                driver.switch_to.window(driver.window_handles[0])
            next_button = driver.find_elements(By.CSS_SELECTOR, '.pagination-next') 
            if next_button and next_button[0].is_enabled():
                next_button[0].click()
            else:
                break

        except Exception as e:
            print(f"Произошла ошибка: {e}")
            break



# def parse_object(url):
#     data = {column: "-" for column in COLUMN_MAPPING.values()}
#     response = requests.get(url)
#     soup = BeautifulSoup(response.text, 'html.parser')
#     data['title'] = soup.select_one('h1.catalog-masthead__title.js-nav-header').text.strip() if soup.select_one('h1.catalog-masthead__title.js-nav-header') else "-"
    
#     data['image_url'] = soup.select_one(".js-gallery-zoom")['href'] if soup.select_one(".js-gallery-zoom") else "-"
    
#     data['price'] = soup.select_one('div.offers-description__price a').text.strip() if soup.select_one('div.offers-description__price a') else "-"

#     data['brand'] = soup.find_all("a", class_="breadcrumbs__link")[-1].find("span").text
    
#     table = soup.find('table')
    
#     if table:
#         rows = table.find_all('tr')
#         for row in rows:
#             cells = row.find_all('td')
#             if len(cells) >= 2:
#                 key = cells[0].contents[0].strip()  
#                 value = cells[1].text.strip()  
#                 if key in COLUMN_MAPPING:
#                     data[COLUMN_MAPPING[key]] = value if value else "-"

#         for col in COLUMN_MAPPING.values():
#             if col not in data or data[col] == "":
#                 data[col] = False 
                
#         data['nfc'] = bool(soup.select_one('td:contains("NFC") + td span.i-tip'))  # True если есть i-tip
#         data['_5g'] = bool(soup.select_one('td:contains("5G") + td span.i-tip'))  # True если есть i-tip
        
#         try:
#             if 2019 <= int(data['launch_year'][:4]) <= 2024:
#                 insert_data(tuple(data[col] for col in COLUMN_MAPPING.values()))
#                 print("Данные сохранены в базе данных.")
#             else:
#                 print(data['launch_year'])
#         except ValueError:
#             print("error: " + data["launch_year"])
#     else:
#         print("Таблица не найдена на странице.")

def parse_object(url):
    data = {column: "-" for column in COLUMN_MAPPING.values()}
    driver.get(url)

    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'h1.catalog-masthead__title.js-nav-header')))
    
    data['title'] = driver.find_element(By.CSS_SELECTOR, 'h1.catalog-masthead__title.js-nav-header').text.strip()
    
    image_element = driver.find_element(By.CSS_SELECTOR, ".js-gallery-zoom")
    data['image_url'] = image_element.get_attribute('href') if image_element else "-"
    
    price_element = driver.find_element(By.CSS_SELECTOR, 'div.offers-description__price a')
    data['price'] = price_element.text.strip() if price_element else "-"
    
    brand_elements = driver.find_elements(By.CSS_SELECTOR, "a.breadcrumbs__link")
    data['brand'] = brand_elements[-1].find_element(By.TAG_NAME, "span").text if brand_elements else "-"
    
    table = driver.find_element(By.TAG_NAME, 'table')
    
    if table:
        rows = table.find_elements(By.TAG_NAME, 'tr')
        for row in rows:
            cells = row.find_elements(By.TAG_NAME, 'td')
            if len(cells) >= 2:
                key = cells[0].text.strip()  
                value = cells[1].text.strip()  
                if key in COLUMN_MAPPING:
                    data[COLUMN_MAPPING[key]] = value if value else "-"

        for col in COLUMN_MAPPING.values():
            if col not in data or data[col] == "":
                data[col] = False 
                
        data['nfc'] = bool(driver.find_elements(By.XPATH, '//td[contains(text(), "NFC")]/following-sibling::td/span[@class="i-tip"]'))
        data['_5g'] = bool(driver.find_elements(By.XPATH, '//td[contains(text(), "5G")]/following-sibling::td/span[@class="i-tip"]'))
        
        try:
            if 2019 <= int(data['launch_year'][:4]) <= 2024:
                insert_data(tuple(data[col] for col in COLUMN_MAPPING.values()))
                print("Данные сохранены в базе данных.")
            else:
                print(data['launch_year'])
        except ValueError:
            print("error: " + data["launch_year"])
    else:
        print("Таблица не найдена на странице.")


def main():
    page = 1
    while True:
        print('1')
        response = requests.get(URL + str(page))
        print('2')
        if driver.title == '404 Not Found':
            print("Нет больше страниц для парсинга.")
            break
        # if response.status_code != 200:
        #     print("Нет больше страниц для парсинга.")
        #     break
        print('3')
        parse_mobile_page(URL + str(page))
        print('4' + ' страница номер ' +str(page))
        page += 1


if __name__ == "__main__":
    main()
    driver.quit()
